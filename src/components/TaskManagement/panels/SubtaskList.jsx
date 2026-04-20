import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { useSubtasks } from '../../../context/SubtaskContext';
import SubtaskItem from './SubtaskItem';

const SubtaskList = () => {
  const { subtasks, loading, addSubtask } = useSubtasks();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Progress Calculation
  const totalCount = subtasks.length;
  const completedCount = useMemo(() => subtasks.filter(st => st.isCompleted).length, [subtasks]);
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask({
      title: newSubtaskTitle.trim(),
      isCompleted: false,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), // Random color for fun or could have picker
    });
    setNewSubtaskTitle('');
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Subtasks
      </h3>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: progressPercentage === 100 ? '#10b981' : 'var(--primary)', 
              width: `${progressPercentage}%`,
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Subtask Items */}
      {loading ? (
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          {subtasks.map(st => (
            <SubtaskItem key={st.id} subtask={st} />
          ))}
        </div>
      )}

      {/* Inline Add */}
      <form onSubmit={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="submit" disabled={!newSubtaskTitle.trim()} style={{ background: 'none', border: 'none', color: newSubtaskTitle.trim() ? 'var(--primary)' : 'var(--border-color)', cursor: newSubtaskTitle.trim() ? 'pointer' : 'default' }}>
          <PlusCircle size={16} />
        </button>
        <input 
          type="text" 
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add subtask..."
          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem' }}
        />
      </form>
    </div>
  );
};

export default SubtaskList;
