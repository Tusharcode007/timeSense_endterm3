import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { SubtaskProvider } from './context/SubtaskContext';
import { TimerProvider } from './context/TimerContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProjectManagement/layout/ProtectedRoute';
import DashboardLayout from './components/ProjectManagement/layout/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TimerProvider>
          <TaskProvider>
            <SubtaskProvider>
              <ScheduleProvider>
                <AnalyticsProvider>
                  <ProtectedRoute>
                      <DashboardLayout />
                  </ProtectedRoute>
                </AnalyticsProvider>
              </ScheduleProvider>
            </SubtaskProvider>
          </TaskProvider>
        </TimerProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
