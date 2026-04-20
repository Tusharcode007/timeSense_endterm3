import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useTasks } from './TaskContext';
import { useAuth } from './AuthContext';

const ScheduleContext = createContext();

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider = ({ children }) => {
  const { tasks } = useTasks();
  const { user, isAuthenticated } = useAuth();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false); 

  // 1. LIVE: Fetch Google Calendar Events via OAuth Token
  const fetchGoogleCalendarEvents = async () => {
    if (!user.calendarToken) {
       console.warn("No Calendar OAuth token available.");
       return;
    }
    
    setLoading(true);
    try {
        const timeMin = new Date().toISOString();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const timeMax = futureDate.toISOString();

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`, {
            headers: {
                Authorization: `Bearer ${user.calendarToken}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch calendar events");
        
        const data = await response.json();
        setCalendarEvents(data.items || []);
        setAuthorized(true);

    } catch (error) {
        console.error("Calendar Sync Error:", error);
    } finally {
        setLoading(false);
    }
  };

  // Automatically fetch if user logs in securely
  useEffect(() => {
     if (isAuthenticated && user.calendarToken) {
         fetchGoogleCalendarEvents();
     } else {
         setCalendarEvents([]);
         setAuthorized(false);
     }
  }, [isAuthenticated, user.calendarToken]);

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

    // Normalize Calendar Events
    const mappedEvents = calendarEvents.map(e => {
       const startD = new Date(e.start.dateTime || e.start.date);
       const endD = new Date(e.end.dateTime || e.end.date);
       return {
         id: e.id,
         type: 'event',
         title: e.summary,
         startObj: startD,
         durationMinutes: Math.round((endD - startD) / 60000),
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
