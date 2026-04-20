import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { SubtaskProvider } from './context/SubtaskContext';
import { TimerProvider } from './context/TimerContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/ProjectManagement/layout/AuthGuard';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TimerProvider>
          <TaskProvider>
            <SubtaskProvider>
              <ScheduleProvider>
                <AnalyticsProvider>
                  <AuthGuard />
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
