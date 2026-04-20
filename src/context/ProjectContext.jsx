import { createContext, useState, useEffect, useContext } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded generic user ID for this module since auth isn't in scope yet.
  const USER_ID = 'demo_user'; 

  useEffect(() => {
    // 1. Setup Real-time Firebase Subscription
    const q = query(
      collection(db, 'users', USER_ID, 'projects'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projData);
      setLoading(false);
      
      // Auto-select first project if nothing is picked
      if (projData.length > 0 && !activeProjectId) {
        setActiveProjectId(projData[0].id);
      } else if (projData.length === 0) {
        setActiveProjectId(null);
      }
    }, (error) => {
      console.error("Firebase fetch error. Using mock offline mode.", error);
      // Fallback for demo when Firebase config is empty
      setProjects([{ id: 'mock1', name: 'Mock Project', color: '#3b82f6', taskCount: 3 }]);
      setActiveProjectId('mock1');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeProjectId]);

  const createProject = async (projectData) => {
    try {
      const projectRef = collection(db, 'users', USER_ID, 'projects');
      await addDoc(projectRef, {
        ...projectData,
        taskCount: 0,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Failed to create project", e);
      // Fallback
      setProjects([{ id: Date.now().toString(), ...projectData, taskCount: 0 }, ...projects]);
    }
  };

  const editProject = async (id, updates) => {
    try {
      const projectRef = doc(db, 'users', USER_ID, 'projects', id);
      await updateDoc(projectRef, updates);
    } catch (e) {
      console.error("Failed to update project", e);
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const removeProject = async (id) => {
    try {
      const projectRef = doc(db, 'users', USER_ID, 'projects', id);
      await deleteDoc(projectRef);
    } catch (e) {
      console.error("Failed to delete project", e);
      setProjects(projects.filter(p => p.id !== id));
    }
    if (activeProjectId === id) {
      const remaining = projects.filter(p => p.id !== id);
      setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProjectId,
      setActiveProjectId,
      loading,
      createProject,
      editProject,
      removeProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
