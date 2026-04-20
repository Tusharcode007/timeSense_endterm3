import React, { useState } from 'react';
import { PlusCircle, Loader2, Calendar } from 'lucide-react';
import { useProjects } from '../../../context/ProjectContext';
import ProjectItem from './ProjectItem';
import ProjectFormModal from '../modals/ProjectFormModal';
import UnifiedScheduleModal from '../../TaskManagement/modals/UnifiedScheduleModal';
import { Activity } from 'lucide-react';

const Sidebar = ({ onNavigate, currentView }) => {
  const { projects, loading } = useProjects();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <>
      <aside className="glass-sidebar" style={{
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)' }}>Projects</h2>
          <button 
            onClick={() => setCreateModalOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            title="Add Project"
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 className="animate-spin" size={24} color="var(--text-muted)" />
          </div>
        ) : (
          <ul style={{ listStyle: 'none', overflowY: 'auto', flex: 1 }}>
            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>No projects yet.</p>
            ) : (
              projects.map(project => (
                <li key={project.id}>
                  <ProjectItem project={project} />
                </li>
              ))
            )}
          </ul>
        )}

        {/* Global Navigation Actions */}
        <div style={{ padding: '1.5rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <button 
             className="glass-button"
             onClick={() => onNavigate(currentView === 'analytics' ? 'tasks' : 'analytics')}
             style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: currentView === 'analytics' ? 'var(--primary)' : '' }}
           >
             <Activity size={18} color={currentView === 'analytics' ? "#fff" : "var(--primary)"} /> 
             {currentView === 'analytics' ? 'Back to Projects' : 'Analytics Dashboard'}
           </button>

           <button 
             className="glass-button"
             onClick={() => setIsScheduleOpen(true)}
             style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
             <Calendar size={18} color="var(--primary)" /> My Schedule
           </button>
        </div>
      </aside>

      {isCreateModalOpen && (
        <ProjectFormModal 
          onClose={() => setCreateModalOpen(false)} 
        />
      )}

      {isScheduleOpen && (
        <UnifiedScheduleModal 
          onClose={() => setIsScheduleOpen(false)} 
        />
      )}
    </>
  );
};

export default Sidebar;
