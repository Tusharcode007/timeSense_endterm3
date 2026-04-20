import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useProjects } from '../../../context/ProjectContext';
import ProjectFormModal from '../modals/ProjectFormModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const ProjectItem = ({ project }) => {
  const { activeProjectId, setActiveProjectId } = useProjects();
  const isActive = activeProjectId === project.id;
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleClick = (e) => {
    // Only set active if the click wasn't on the action menu
    if (!e.target.closest('.action-menu-btn') && !e.target.closest('.dropdown')) {
      setActiveProjectId(project.id);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 0.75rem',
          margin: '0.25rem 0',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: isActive ? 'var(--active-bg)' : isHovered ? 'var(--hover-bg)' : 'transparent',
          color: isActive ? 'var(--primary)' : 'var(--text-main)',
          transition: 'background-color 0.2s, color 0.2s',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: project.color || '#ccc',
            display: 'inline-block'
          }} />
          <span style={{ fontWeight: isActive ? '600' : '500', fontSize: '0.95rem' }}>
            {project.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {project.taskCount > 0 && !isHovered && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              backgroundColor: isActive ? '#fff' : 'var(--border-color)',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {project.taskCount}
            </span>
          )}

          {isHovered && (
            <div style={{ position: 'relative' }}>
              <button 
                className="action-menu-btn"
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div 
                  className="dropdown"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    zIndex: 10,
                    minWidth: '120px',
                    padding: '4px'
                  }}
                >
                  <button 
                    onClick={() => { setShowMenu(false); setEditModalOpen(true); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => { setShowMenu(false); setDeleteModalOpen(true); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', color: '#ef4444' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {isEditModalOpen && (
        <ProjectFormModal 
          project={project} 
          onClose={() => setEditModalOpen(false)} 
        />
      )}
      
      {isDeleteModalOpen && (
        <DeleteConfirmModal 
          project={project} 
          onClose={() => setDeleteModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProjectItem;
