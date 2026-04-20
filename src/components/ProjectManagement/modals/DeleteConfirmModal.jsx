import React, { useState } from 'react';
import { useProjects } from '../../../context/ProjectContext';

const DeleteConfirmModal = ({ project, onClose }) => {
  const { removeProject } = useProjects();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await removeProject(project.id);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>Delete Project?</h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
          Are you sure you want to delete <strong>"{project.name}"</strong>? This action cannot be undone and will permanently remove all associated tasks.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onClose}
            disabled={isDeleting}
            style={{ padding: '8px 16px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ padding: '8px 16px', border: 'none', backgroundColor: '#ef4444', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', opacity: isDeleting ? 0.5 : 1 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
