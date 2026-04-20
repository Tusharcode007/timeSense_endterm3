import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProjects } from '../../../context/ProjectContext';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b'];

const ProjectFormModal = ({ project, onClose }) => {
  const { createProject, editProject } = useProjects();
  const [name, setName] = useState(project ? project.name : '');
  const [color, setColor] = useState(project ? project.color : COLORS[4]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    if (project) {
      await editProject(project.id, { name: name.trim(), color });
    } else {
      await createProject({ name: name.trim(), color });
    }
    setIsSubmitting(false);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{project ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Project Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Roadmap"
              required
              autoFocus
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '6px',
                border: '1px solid var(--border-color)', outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Project Color</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: c, border: 'none', cursor: 'pointer',
                    boxShadow: color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                    transition: 'box-shadow 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ padding: '8px 16px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
              style={{ padding: '8px 16px', border: 'none', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', opacity: (!name.trim() || isSubmitting) ? 0.5 : 1 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
