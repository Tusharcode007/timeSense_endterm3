import React, { useMemo } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { groupTasksByDate } from '../../../utils/taskUtils';
import TaskItem from '../items/TaskItem';

const TaskGroup = ({ title, tasks, titleColor = 'var(--text-main)' }) => {
  if (tasks.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        color: titleColor, 
        borderBottom: '1px solid var(--border-color)', 
        paddingBottom: '8px', 
        marginBottom: '12px' 
      }}>
        {title} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>({tasks.length})</span>
      </h3>
      <div>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TaskList = () => {
  const { tasks, loading } = useTasks();

  const groupedTasks = useMemo(() => groupTasksByDate(tasks), [tasks]);
  
  // Show completed items at the very bottom
  const completedTasks = useMemo(() => tasks.filter(t => t.isCompleted), [tasks]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        <p>No tasks remaining in this project!</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Use the input above to add a new task.</p>
      </div>
    );
  }

  return (
    <div>
      <TaskGroup title="Overdue" tasks={groupedTasks.Overdue} titleColor="#ef4444" />
      <TaskGroup title="Today" tasks={groupedTasks.Today} titleColor="#3b82f6" />
      <TaskGroup title="Tomorrow" tasks={groupedTasks.Tomorrow} />
      <TaskGroup title="Upcoming" tasks={groupedTasks.Upcoming} />
      <TaskGroup title="No Date Assigned" tasks={groupedTasks['No Date']} />
      
      {completedTasks.length > 0 && (
        <div style={{ marginTop: '48px', opacity: 0.7 }}>
          <TaskGroup title="Completed" tasks={completedTasks} />
        </div>
      )}
    </div>
  );
};

export default TaskList;
