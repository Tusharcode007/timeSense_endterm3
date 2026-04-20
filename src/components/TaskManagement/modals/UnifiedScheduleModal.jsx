import React, { useState } from 'react';
import { X, Calendar as CalIcon, Clock, CheckCircle2, Circle } from 'lucide-react';
import { useSchedule } from '../../../context/ScheduleContext';
import { useTimer } from '../../../context/TimerContext';

const UnifiedScheduleModal = ({ onClose }) => {
  const { unifiedSchedule, authorized, triggerOAuthLogin } = useSchedule();
  const { startTimer } = useTimer();

  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalIcon size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Unified Schedule</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Auth / Empty States */}
        {!authorized && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Connect Google Calendar to see your meetings alongside your tasks.</p>
            <button 
              onClick={triggerOAuthLogin}
              style={{ padding: '12px 24px', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Sign in with Google
            </button>
          </div>
        )}

        {/* Timeline View */}
        {authorized && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {unifiedSchedule.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Your schedule is completely clear!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {unifiedSchedule.map((item, idx) => (
                  <div key={item.id + idx} style={{ 
                    display: 'flex', gap: '16px', padding: '16px', 
                    borderRadius: '12px', border: '1px solid var(--border-color)',
                    backgroundColor: item.type === 'event' ? '#f0f9ff' : '#fff',
                    borderLeft: item.type === 'event' ? '4px solid #0ea5e9' : '4px solid #10b981'
                  }}>
                    {/* Time Column */}
                    <div style={{ minWidth: '80px', borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{formatTime(item.startObj)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.durationMinutes}m</div>
                    </div>

                    {/* Content Column */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {item.type === 'task' ? <Circle size={14} color="#10b981" /> : <CalIcon size={14} color="#0ea5e9" />}
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                          {item.type}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{item.title}</h3>
                    </div>

                    {/* Actions Column */}
                    {item.type === 'task' && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button 
                          onClick={() => { startTimer(item.id, item.title); onClose(); }}
                          style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                        >
                          Focus
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedScheduleModal;
