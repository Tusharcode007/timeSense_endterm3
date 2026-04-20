import React from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { usePomodoro } from '../../../hooks/usePomodoro';

// We make this Singleton-like by exporting the hook instance 
// Or we pass down the instance via props from App/Layout.
// For simplicity, we'll assume it's mounted once at the top of DashboardLayout.

const GlobalTimer = ({ timerInstance }) => {
  const { activeSession, displayTime, resumeTimer, pauseTimer, stopTimer } = timerInstance;

  if (!activeSession) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0f172a',
      color: '#fff',
      padding: '8px 24px',
      borderRadius: '32px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
      zIndex: 100,
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
        <Clock size={16} />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{displayTime}</span>
      </div>
      
      <div style={{ fontSize: '0.875rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#94a3b8' }}>
        Focusing: <span style={{ color: '#fff' }}>{activeSession.taskName}</span>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {activeSession.isPaused ? (
          <button 
            onClick={resumeTimer}
            style={{ background: '#3b82f6', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Play size={14} fill="#fff" />
          </button>
        ) : (
          <button 
            onClick={pauseTimer}
            style={{ background: '#f59e0b', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Pause size={14} fill="#fff" />
          </button>
        )}
        <button 
          onClick={stopTimer}
          style={{ background: '#ef4444', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Square size={14} fill="#fff" />
        </button>
      </div>
    </div>
  );
};

export default GlobalTimer;
