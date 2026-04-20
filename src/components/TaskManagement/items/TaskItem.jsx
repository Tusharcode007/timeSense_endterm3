import React, { useState } from 'react';
import { Circle, CheckCircle2, Calendar, Flag, Clock, Trash2, Edit2, Play } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useTimer } from '../../../context/TimerContext';

const TaskItem = ({ task }) => {
  const { updateTask, deleteTask, selectedTaskId, setSelectedTaskId } = useTasks();
  const { activeSession, startTimer } = useTimer();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggleComplete = () => {
    updateTask(task.id, { isCompleted: !task.isCompleted });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const isSaving = task.id.toString().startsWith('temp_');

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderBottom: '1px solid var(--border-color)',
        opacity: isSaving ? 0.6 : 1,
        transition: 'background-color 0.2s',
        backgroundColor: (isHovered || selectedTaskId === task.id) ? 'var(--hover-bg)' : 'transparent',
        borderLeft: selectedTaskId === task.id ? '3px solid var(--primary)' : '3px solid transparent',
        gap: '12px'
      }}
    >
      {/* Checkbox */}
      <button 
        onClick={handleToggleComplete}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.isCompleted ? 'var(--primary)' : 'var(--text-muted)' }}
      >
        {task.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      {/* Task Content */}
      <div 
        style={{ flex: 1, cursor: 'pointer' }}
        onClick={(e) => {
          if (!isEditing) {
            setSelectedTaskId(task.id);
          }
        }}
      >
        {isEditing ? (
          <input 
            type="text" 
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            style={{ width: '100%', fontSize: '0.95rem', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px' }}
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)}
            style={{ 
              fontSize: '0.95rem', 
              color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)', 
              textDecoration: task.isCompleted ? 'line-through' : 'none',
              cursor: 'text'
            }}
          >
            {task.title}
          </span>
        )}

        {/* Metadata Details below title */}
        {(!isEditing && (task.dueDate || task.estimatedTime > 0 || task.priority > 1)) && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {task.dueDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {task.dueDate}
              </span>
            )}
            {task.estimatedTime > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {task.estimatedTime}m
              </span>
            )}
            {task.priority > 1 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: task.priority === 4 ? '#ef4444' : task.priority === 3 ? '#f97316' : '#3b82f6' }}>
                <Flag size={12} /> P{task.priority}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions (Hover) */}
      {(isHovered || isEditing) && !isSaving && (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); startTimer(task.id, task.title); }}
            title="Start Pomodoro Timer natively"
            style={{ 
              background: activeSession?.taskId === task.id ? 'rgba(59, 130, 246, 0.1)' : 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: activeSession?.taskId === task.id ? '#3b82f6' : 'var(--text-muted)', 
              padding: '6px',
              borderRadius: '4px' 
            }}
          >
            <Play size={16} fill={activeSession?.taskId === task.id ? "#3b82f6" : "none"} />
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '6px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
