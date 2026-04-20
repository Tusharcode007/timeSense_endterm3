import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useTasks } from './TaskContext';
import { useAuth } from './AuthContext';
import { fetchGoogleEvents } from '../services/calendar';

const ScheduleContext = createContext();

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider = ({ children }) => {
  const { tasks } = useTasks();
  const { user, isAuthenticated } = useAuth();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false); 

  // 1. LIVE: Fetch Google Calendar Events via external service
  const fetchGoogleCalendarEvents = useCallback(async () => {
    if (!user?.calendarToken) return;
    
    setLoading(true);
    try {
        const events = await fetchGoogleEvents(user.calendarToken);
        setCalendarEvents(events);
        setAuthorized(true);
    } catch (error) {
        console.error("Schedule Context Calendar Sync Error:", error);
    } finally {
        setLoading(false);
    }
  }, [user?.calendarToken]);

  // Automatically fetch if user logs in securely and map 5 min interval background polling
  useEffect(() => {
     if (isAuthenticated && user?.calendarToken) {
         fetchGoogleCalendarEvents();
         
         const interval = setInterval(() => {
             fetchGoogleCalendarEvents();
         }, 300000); // 5 minutes
         
         return () => clearInterval(interval);
     } else {
         setCalendarEvents([]);
         setAuthorized(false);
     }
  }, [isAuthenticated, user?.calendarToken, fetchGoogleCalendarEvents]);

  // 2. Data Normalization & Merge
  const unifiedSchedule = useMemo(() => {
    if (!tasks || tasks.length === 0 && calendarEvents.length === 0) return [];

    // Normalize Tasks
    const mappedTasks = tasks
      // Ensure we only plot tasks with valid due dates
      .filter(t => t.dueDate && !t.isCompleted) 
      .map(t => {
         const d = new Date(t.dueDate);
         // Sub-optimal tasks without hours assume start of day
         d.setHours(9, 0, 0, 0); 
         return {
           id: t.id,
           type: 'task',
           title: t.title,
           startObj: d,
           durationMinutes: t.estimatedTime || 60,
           raw: t
         };
      });

    // Normalize Calendar Events (Already normalized inside the API layer structure!)
    // We just map the objects over securely
    const mappedEvents = calendarEvents.map(e => {
       return {
         ...e, // Contains { id, title, startTime, endTime, type, isExternal, durationMinutes }
         startObj: e.startTime, // Mapping back for merge compatibility
         raw: e
       };
    });

    // 3. Merge & Sort Chronologically Ascending
    const unified = [...mappedTasks, ...mappedEvents].sort((a, b) => a.startObj - b.startObj);
    return unified;
  }, [tasks, calendarEvents]);

  // Expose trigger to force re-sync
  const triggerOAuthLogin = () => {
    fetchGoogleCalendarEvents();
  };

  return (
    <ScheduleContext.Provider value={{
      calendarEvents,
      unifiedSchedule,
      loading,
      authorized,
      triggerOAuthLogin
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};
