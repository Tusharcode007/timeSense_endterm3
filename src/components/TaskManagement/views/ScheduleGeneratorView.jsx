import React, { useMemo } from 'react';
import { Sparkles, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useSchedule } from '../../../context/ScheduleContext';
import { generateSchedule } from '../../../utils/scheduleGenerator';

const ScheduleGeneratorView = () => {
  const { tasks } = useTasks();
  const { calendarEvents } = useSchedule();

  const { timeline, unplacedTasks } = useMemo(() => {
    return generateSchedule(tasks, calendarEvents);
  }, [tasks, calendarEvents]);

  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
        <Sparkles color="#8b5cf6" size={24} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>AI Daily Schedule Suggestion</h2>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Timeline Line */}
        <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }} />

        {timeline.map((block, idx) => {
            const isEvent = block.type === 'calendar_event';
            const isFree = block.type === 'free_gap';
            
            let color = '#3b82f6';
            let icon = <Clock size={14} color="#fff" />;
            if (isEvent) { color = '#ef4444'; icon = <Calendar size={14} color="#fff" />; }
            if (isFree) { color = '#94a3b8'; icon = <Circle size={14} color="#fff" />; }

            return (
              <div key={idx} style={{ display: 'flex', gap: '24px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                
                {/* Node */}
                <div style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, border: '4px solid #fff' }}>
                     {icon}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, backgroundColor: isFree ? 'transparent' : 'var(--bg-color)', border: isFree ? '1px dashed var(--border-color)' : '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: isFree ? 'var(--text-muted)' : 'var(--text-main)', margin: 0 }}>
                        {block.title}
                      </h3>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: isFree ? 'var(--text-muted)' : styleColor(block.type) }}>
                        {formatTime(block.start)} - {formatTime(block.end)}
                      </span>
                   </div>
                   
                   {block.type === 'task_suggestion' && (
                       <span style={{ display: 'inline-block', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>
                          AI Match (Priority Fit)
                       </span>
                   )}
                </div>
              </div>
            )
        })}

        {/* Unplaceable Tasks Warning */}
        {unplacedTasks.length > 0 && (
            <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', gap: '12px' }}>
               <AlertTriangle color="#ef4444" size={24} />
               <div>
                 <h4 style={{ color: '#991b1b', margin: '0 0 8px 0', fontSize: '1rem' }}>Unable to Fit Today</h4>
                 <ul style={{ margin: 0, paddingLeft: '16px', color: '#b91c1c', fontSize: '0.875rem' }}>
                    {unplacedTasks.map(t => (
                        <li key={t.id}>{t.title} ({t.estimatedTime}m)</li>
                    ))}
                 </ul>
                 <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#991b1b' }}>Try splitting these tasks into smaller chunks or adjusting calendar events.</p>
               </div>
            </div>
        )}
      </div>

    </div>
  );
};

// Simple helper right inside
import { Circle } from 'lucide-react';
const styleColor = (type) => {
    switch(type) {
        case 'calendar_event': return '#ef4444';
        case 'task_suggestion': return '#3b82f6';
        default: return 'var(--text-muted)';
    }
}

export default ScheduleGeneratorView;
