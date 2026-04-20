import { useState, useRef, useEffect, useCallback } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const USER_ID = 'demo_user'; // hardcoded config for offline compat

export const usePomodoro = () => {
  // Localized decoupled state just for UI renders
  const [activeSession, setActiveSession] = useState(null); 
  // { taskId, taskName, startTimeString, isPaused, accumulatedSeconds }
  
  const [displaySeconds, setDisplaySeconds] = useState(0);

  // Background non-rendering refs
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null); // When the current running chunk started
  const accumulatedTimeRef = useRef(0); // Time accumulated before current pause/play chunk

  // 1. Tick Function
  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = Date.now();
    const currentChunkSecs = Math.floor((now - startTimeRef.current) / 1000);
    setDisplaySeconds(accumulatedTimeRef.current + currentChunkSecs);
  }, []);

  // 2. Start
  const startTimer = useCallback((taskId, taskName) => {
    setActiveSession({
      taskId,
      taskName,
      startTimeString: new Date().toISOString(),
      isPaused: false
    });
    
    startTimeRef.current = Date.now();
    accumulatedTimeRef.current = 0;
    setDisplaySeconds(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // 3. Pause
  const pauseTimer = useCallback(() => {
    if (!intervalRef.current) return;
    
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    
    // Lock in accumulated time
    if (startTimeRef.current) {
        const chunk = Math.floor((Date.now() - startTimeRef.current) / 1000);
        accumulatedTimeRef.current += chunk;
        startTimeRef.current = null;
    }
    
    setActiveSession(prev => prev ? { ...prev, isPaused: true } : null);
  }, []);

  // 4. Resume
  const resumeTimer = useCallback(() => {
    if (!activeSession || !activeSession.isPaused) return;
    
    startTimeRef.current = Date.now();
    setActiveSession(prev => ({ ...prev, isPaused: false }));
    
    intervalRef.current = setInterval(tick, 1000);
  }, [activeSession, tick]);

  // Adjust time dynamically
  const adjustTime = useCallback((minutes) => {
    if (!activeSession) return;
    const secondsToAdjust = minutes * 60;
    // We adjust the accumulated time pool directly
    accumulatedTimeRef.current = Math.max(0, accumulatedTimeRef.current + secondsToAdjust);
    // Force a UI tick update so it shows instantly
    tick();
  }, [activeSession, tick]);

  // 5. Stop & Save
  const stopTimer = useCallback(async () => {
    if (!activeSession) return;
    
    let totalSeconds = accumulatedTimeRef.current;
    if (startTimeRef.current && !activeSession.isPaused) {
       totalSeconds += Math.floor((Date.now() - startTimeRef.current) / 1000);
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;

    const sessionToSave = {
       taskId: activeSession.taskId,
       startTime: activeSession.startTimeString,
       endTime: new Date().toISOString(),
       durationMinutes: Math.ceil(totalSeconds / 60), // converting to mins for DB
       durationSecondsRaw: totalSeconds
    };

    setActiveSession(null);
    setDisplaySeconds(0);

    if (totalSeconds > 10) { // Only save if it was meaningful (>10s)
      try {
        const ref = collection(db, 'users', USER_ID, 'focus_sessions');
        await addDoc(ref, sessionToSave);
      } catch(e) {
        console.error("Failed to save Pomodoro Session", e);
      }
    }
  }, [activeSession]);

  // 6. Interruption Handler (Visibility API)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && activeSession && !activeSession.isPaused) {
        console.log("Tab backgrounded! Auto-pausing timer to prevent divergence.");
        pauseTimer();
        // Advanced: We could trigger a mini sync here or append an "interruptions" array
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [activeSession, pauseTimer]);

  // 7. Auto-save on unmount/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
       if (activeSession) {
          // If we had a real backend, we'd use navigator.sendBeacon here.
          // Since it's firebase, async writes during unload are volatile, 
          // standard practice is relying on pause-syncs or periodic localstorage dumps.
          localStorage.setItem('orphaned_pomodoro', JSON.stringify({
             ...activeSession,
             elapsed: accumulatedTimeRef.current
          }));
       }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeSession]);

  // Format Helper HH:MM:SS
  const formatTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    activeSession,
    displayTime: formatTime(displaySeconds),
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    adjustTime
  };
};
