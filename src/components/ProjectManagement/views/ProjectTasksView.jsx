import React from 'react';
import { useProjects } from '../../../context/ProjectContext';
import InlineTaskInput from '../../TaskManagement/items/InlineTaskInput';
import TaskList from '../../TaskManagement/views/TaskList';
import ScheduleGeneratorView from '../../TaskManagement/views/ScheduleGeneratorView';
import ProjectStatsBanner from './ProjectStatsBanner';

const ProjectTasksView = () => {
  const { projects, activeProjectId, loading } = useProjects();
  const activeProject = projects.find(p => p.id === activeProjectId);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading...</div>;
  }

  if (!activeProject) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <h2>Select a project from the sidebar to view tasks.</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)' }}>
      <ProjectStatsBanner />

      <div className="glass-card" style={{ padding: '2rem' }}>
        <InlineTaskInput />
        <TaskList />
      </div>

      {activeProject.taskCount > 0 && <ScheduleGeneratorView />}
    </div>
  );
};

export default ProjectTasksView;
