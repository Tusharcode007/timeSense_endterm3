import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useProjects } from './ProjectContext';
import { useAuth } from './AuthContext';
import { generateInsights } from '../utils/productivityEngine';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const { projects } = useProjects();
  const { isPremium } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const USER_ID = 'demo_user';

  // Fetch Global Tasks and Focus Sessions
  useEffect(() => {
    setLoading(true);

    // Calculate free-tier boundary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Fetch ALL tasks for user (Gated if free)
    let qTasks;
    if (isPremium) {
       qTasks = query(collection(db, 'users', USER_ID, 'tasks'), orderBy('createdAt', 'desc'));
    } else {
       // Free tier restricted
       qTasks = query(collection(db, 'users', USER_ID, 'tasks'), where('createdAt', '>=', sevenDaysAgo.toISOString()), orderBy('createdAt', 'desc'));
    }
    
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllTasks(tasksData);
    }, (err) => {
        console.error("Analytics Mock - Global Tasks", err);
        // Fallback Mock
        setAllTasks([
           { id: 't1', projectId: 'mock1', isCompleted: true, estimatedTime: 60, title: 'Draft' },
           { id: 't2', projectId: 'mock1', isCompleted: false, estimatedTime: 120, title: 'Revise' },
           { id: 't3', projectId: 'mock2', isCompleted: true, estimatedTime: 30, title: 'Send' }
        ]);
    });

    // 2. Fetch ALL focus sessions (Gated if free)
    let qFocus;
    if (isPremium) {
       qFocus = query(collection(db, 'users', USER_ID, 'focus_sessions'), orderBy('startTime', 'asc'));
    } else {
       // Free tier strictly restricted to polling last 7 days natively
       qFocus = query(collection(db, 'users', USER_ID, 'focus_sessions'), where('startTime', '>=', sevenDaysAgo.toISOString()), orderBy('startTime', 'asc'));
    }

    const unsubFocus = onSnapshot(qFocus, (snapshot) => {
        const focusData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFocusSessions(focusData);
        setLoading(false);
    }, (err) => {
        console.error("Analytics Mock - Focus Sessions", err);
        // Fallback Mock respecting limits
        const mockSessions = [];
        const today = new Date();
        const limit = isPremium ? 180 : 7; // Gen limit based on tier
        
        for(let i=0; i<limit; i++) {
           if(Math.random() > 0.4) {
               const d = new Date(today);
               d.setDate(d.getDate() - i);
               mockSessions.push({
                   id: 'fs_'+i, 
                   durationMinutes: Math.floor(Math.random() * 120) + 15,
                   startTime: d.toISOString()
               });
           }
        }
        setFocusSessions(mockSessions);
        setLoading(false);
    });

    return () => {
        unsubTasks();
        unsubFocus();
    }
  }, [isPremium]);

  // --- MEMOIZED ANALYTICS ENGINES --- //

  // 1. Completion Rate & Project Distribution
  const { completionRate, projectDistribution } = useMemo(() => {
      if (!allTasks.length) return { completionRate: 0, projectDistribution: [] };

      let completed = 0;
      const distMap = {};

      allTasks.forEach(task => {
          if (task.isCompleted) completed++;
          if (task.projectId) {
              distMap[task.projectId] = (distMap[task.projectId] || 0) + (task.estimatedTime || 0);
          }
      });

      // Map projectId to actual project names/colors
      const distArray = Object.keys(distMap).map(pid => {
          const proj = projects.find(p => p.id === pid) || { name: 'Unknown', color: '#ccc' };
          return {
              name: proj.name,
              value: distMap[pid],
              color: proj.color
          };
      });

      return {
          completionRate: Math.round((completed / allTasks.length) * 100),
          projectDistribution: distArray
      };
  }, [allTasks, projects]);

  // 2. Focus Heatmap Data
  const heatmapData = useMemo(() => {
      return focusSessions.reduce((acc, session) => {
          const dateKey = session.startTime.split('T')[0];
          acc[dateKey] = (acc[dateKey] || 0) + session.durationMinutes;
          return acc;
      }, {});
  }, [focusSessions]);

  // 3. Weekly Trends
  const weeklyTrends = useMemo(() => {
     // Groups last 7 days of focus sessions
     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
     const trendMap = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
     
     const sevenDaysAgo = new Date();
     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

     focusSessions.forEach(session => {
         const date = new Date(session.startTime);
         if (date >= sevenDaysAgo) {
             const dayName = days[date.getDay()];
             trendMap[dayName] += session.durationMinutes;
         }
     });

     return Object.keys(trendMap).map(day => ({
         name: day,
         minutes: trendMap[day]
     }));
  }, [focusSessions]);


  // 4. AI Rule Engine Overlays
  const aiInsights = useMemo(() => {
      return generateInsights(allTasks, focusSessions);
  }, [allTasks, focusSessions]);

  return (
    <AnalyticsContext.Provider value={{
      loading,
      completionRate,
      projectDistribution,
      heatmapData,
      weeklyTrends,
      totalFocusSessions: focusSessions.length,
      aiInsights
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
