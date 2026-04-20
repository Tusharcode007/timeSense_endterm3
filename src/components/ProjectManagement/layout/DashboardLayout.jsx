import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import ProjectTasksView from '../views/ProjectTasksView';
import AnalyticsDashboard from '../../TaskManagement/views/AnalyticsDashboard';
import TaskDetailPanel from '../../TaskManagement/panels/TaskDetailPanel';
import FullScreenTimerView from '../../TaskManagement/views/FullScreenTimerView';
import { useTimer } from '../../../context/TimerContext';

const DashboardLayout = () => {
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' | 'analytics'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { activeSession } = useTimer();

  // Auto-expand timer to full screen when it first starts
  React.useEffect(() => {
     if (activeSession) setIsFullscreen(true);
  }, [activeSession]);
  if (isFullscreen && activeSession) {
      return <FullScreenTimerView onExit={() => setIsFullscreen(false)} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'transparent', overflow: 'hidden' }}>
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      
      {/* Central Content Area (Column 2) */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {currentView === 'analytics' ? <AnalyticsDashboard /> : <ProjectTasksView />}
      </main>

      {/* Persistent Task Details Panel (Column 3) */}
      <div className="glass-panel" style={{ width: '400px', flexShrink: 0, overflowY: 'auto' }}>
         <TaskDetailPanel />
      </div>
    </div>
  );
};

export default DashboardLayout;
