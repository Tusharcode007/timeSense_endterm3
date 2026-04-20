import React from 'react';
import { X, Calendar, Flag, Clock } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import SubtaskList from './SubtaskList';

const TaskDetailPanel = () => {
  const { tasks, selectedTaskId, setSelectedTaskId } = useTasks();

  if (!selectedTaskId) return null;

  const activeTask = tasks.find(t => t.id === selectedTaskId);

  // If task doesn't exist in local state (perhaps deleted), close panel
  if (!activeTask) {
    setSelectedTaskId(null);
    return null;
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'transparent',
      borderLeft: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 20px 10px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: activeTask.isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: activeTask.isCompleted ? 'line-through' : 'none', flex: 1, marginRight: '12px' }}>
          {activeTask.title}
        </h2>
        <button 
          onClick={() => setSelectedTaskId(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Body (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* Task Metadata Readonly Representation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {activeTask.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Calendar size={16} /> <span>Due: {activeTask.dueDate}</span>
            </div>
          )}
          {activeTask.estimatedTime > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Clock size={16} /> <span>{activeTask.estimatedTime} minutes est.</span>
            </div>
          )}
          {activeTask.priority > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: activeTask.priority === 4 ? '#ef4444' : activeTask.priority === 3 ? '#f97316' : '#3b82f6' }}>
              <Flag size={16} /> <span>Priority {activeTask.priority}</span>
            </div>
          )}
        </div>

        {/* The Subtask Engine */}
        <SubtaskList />

      </div>
    </div>
  );
};

export default TaskDetailPanel;
