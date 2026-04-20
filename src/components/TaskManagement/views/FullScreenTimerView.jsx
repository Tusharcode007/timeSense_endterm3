import React, { useMemo } from 'react';
import { useTimer } from '../../../context/TimerContext';
import { useTasks } from '../../../context/TaskContext';
import { Play, Pause, Square, Plus, Minus, ArrowLeft, MoreVertical, Trash2 } from 'lucide-react';

const FullScreenTimerView = ({ onExit }) => {
    const { activeSession, displayTime, pauseTimer, resumeTimer, stopTimer, adjustTime } = useTimer();
    const { tasks } = useTasks();

    // Default duration map - in a real app this is strictly calculated via tracking
    const circumference = 300 * 2 * Math.PI; // r=300
    
    // Parse displayTime 'MM:SS' into seconds for radial calculation
    const currentSeconds = useMemo(() => {
        if (!displayTime) return 0;
        const parts = displayTime.split(':');
        if (parts.length === 3) return parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2]);
        return parseInt(parts[0])*60 + parseInt(parts[1]);
    }, [displayTime]);

    // Target represents a 25min bound (1500 secs)
    const targetSeconds = 1500; 
    const strokeDashoffset = activeSession 
         ? circumference - (currentSeconds / targetSeconds) * circumference 
         : circumference;

    const pendingTasks = tasks.filter(t => !t.isCompleted).slice(0, 5);

    if (!activeSession) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
                <h2>No active focus session.</h2>
                <button onClick={onExit} style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 9999, display: 'flex',
            backgroundImage: 'url("https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2560&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            {/* Cinematic Vignette Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} />

            {/* Top Left Navigation (Z-Index Over) */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
                <button 
                  onClick={onExit}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', padding: '8px 16px', borderRadius: '24px', backdropFilter: 'blur(4px)' }}
                >
                    <ArrowLeft size={16} /> Hide Timer (Keeps Running)
                </button>
            </div>

            {/* Central Giant Timer Focus */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                
                {/* Active Task Pill */}
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px 24px', borderRadius: '32px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                     <span style={{ fontSize: '1.25rem', color: '#fff', letterSpacing: '0.05em' }}>{activeSession.taskName}</span>
                </div>

                {/* Vector Radial Progress */}
                <div style={{ position: 'relative', width: '640px', height: '640px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle 
                            cx="320" cy="320" r="300"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="12"
                        />
                        <circle 
                            cx="320" cy="320" r="300"
                            fill="transparent"
                            stroke="var(--primary)"
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>
                    
                    {/* Inner Clock Text */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '8rem', fontWeight: '200', color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: '1', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                            {displayTime}
                        </div>
                        <span style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', marginTop: '16px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            {activeSession.isPaused ? 'Paused' : 'Deep Work'}
                        </span>
                    </div>
                </div>

                {/* Adjust Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginTop: '40px' }}>
                    <button 
                       onClick={() => adjustTime(-5)}
                       title="Subtract 5 minutes"
                       style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                    >
                        <Minus size={20} />
                    </button>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '48px', display: 'flex', alignItems: 'center', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                        {activeSession.isPaused ? (
                            <button 
                               onClick={() => resumeTimer()}
                               style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--primary)', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: '32px', cursor: 'pointer', marginRight: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}
                            >
                                <Play size={24} fill="#fff" /> Resume
                            </button>
                        ) : (
                            <button 
                               onClick={() => pauseTimer()}
                               style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: '32px', cursor: 'pointer', marginRight: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}
                            >
                                <Pause size={24} fill="currentColor" /> Pause
                            </button>
                        )}

                        <button 
                           onClick={() => stopTimer()}
                           title="Stop & Save Session"
                           style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <Square size={20} fill="currentColor" />
                        </button>
                    </div>

                    <button 
                       onClick={() => adjustTime(5)}
                       title="Add 5 minutes"
                       style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                    >
                        <Plus size={20} />
                    </button>
                </div>

            </div>

            {/* Right Pane: Up Next Translucent Panel */}
            <div style={{ width: '350px', backgroundColor: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(16px)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', letterSpacing: '0.05em' }}>Focus Queue</h3>
                    <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Up Next Today</p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {pendingTasks.map(t => (
                        <div key={t.id} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', marginTop: '4px' }} />
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '0.95rem', fontWeight: '500' }}>{t.title}</h4>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>{t.estimatedTime || 25}m est</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FullScreenTimerView;
