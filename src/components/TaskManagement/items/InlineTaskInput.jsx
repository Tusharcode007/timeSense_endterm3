import React, { useState } from 'react';
import { PlusCircle, Calendar, Flag, Clock } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useProjects } from '../../../context/ProjectContext';

const InlineTaskInput = () => {
  const { addTask } = useTasks();
  const { activeProjectId } = useProjects();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // If no project is active, hide input
  if (!activeProjectId) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      dueDate: dueDate || null,
      priority,
      estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : 0,
      isCompleted: false,
    });

    // Reset Form
    setTitle('');
    setDueDate('');
    setPriority(1);
    setEstimatedTime('');
    setIsExpanded(false);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        padding: '12px',
        boxShadow: isExpanded ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.2s',
        marginBottom: '24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          type="submit" 
          disabled={!title.trim()}
          style={{ background: 'none', border: 'none', cursor: title.trim() ? 'pointer' : 'default', color: title.trim() ? 'var(--primary)' : 'var(--border-color)' }}
        >
          <PlusCircle size={20} />
        </button>
        <input 
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
        />
      </div>

      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Due Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Calendar size={16} />
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Priority */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Flag size={16} color={priority === 4 ? '#ef4444' : priority === 3 ? '#f97316' : priority === 2 ? '#3b82f6' : 'var(--text-muted)'} />
            <select 
              value={priority} 
              onChange={(e) => setPriority(Number(e.target.value))}
              style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px', fontSize: '0.875rem' }}
            >
              <option value={1}>P4 (None)</option>
              <option value={2}>P3 (Low)</option>
              <option value={3}>P2 (Medium)</option>
              <option value={4}>P1 (High)</option>
            </select>
          </div>

          {/* Estimated Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Clock size={16} />
            <input 
              type="number" 
              placeholder="Mins"
              value={estimatedTime} 
              onChange={(e) => setEstimatedTime(e.target.value)}
              style={{ width: '70px', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              onClick={() => setIsExpanded(false)}
              style={{ padding: '6px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!title.trim()}
              style={{ padding: '6px 12px', border: 'none', background: 'var(--primary)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', opacity: title.trim() ? 1 : 0.5 }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default InlineTaskInput;
