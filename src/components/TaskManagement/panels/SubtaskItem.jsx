import React, { useState } from 'react';
import { Circle, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { useSubtasks } from '../../../context/SubtaskContext';

const SubtaskItem = ({ subtask }) => {
  const { updateSubtask, deleteSubtask } = useSubtasks();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const handleToggleComplete = () => {
    updateSubtask(subtask.id, { isCompleted: !subtask.isCompleted });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== subtask.title) {
      updateSubtask(subtask.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const isSaving = subtask.id.toString().startsWith('temp_');

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderBottom: '1px solid var(--border-color)',
        opacity: isSaving ? 0.6 : 1,
        transition: 'background-color 0.2s',
        backgroundColor: isHovered ? 'var(--hover-bg)' : 'transparent',
        gap: '12px'
      }}
    >
      <button 
        onClick={handleToggleComplete}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: subtask.isCompleted ? 'var(--primary)' : 'var(--text-muted)' }}
      >
        {subtask.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: subtask.color || 'var(--primary)',
          display: 'inline-block'
        }} />
        
        {isEditing ? (
          <input 
            type="text" 
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            style={{ width: '100%', fontSize: '0.875rem', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)}
            style={{ 
              fontSize: '0.875rem', 
              color: subtask.isCompleted ? 'var(--text-muted)' : 'var(--text-main)', 
              textDecoration: subtask.isCompleted ? 'line-through' : 'none',
              cursor: 'text'
            }}
          >
            {subtask.title}
          </span>
        )}
      </div>

      {(isHovered || isEditing) && !isSaving && (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => deleteSubtask(subtask.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubtaskItem;
