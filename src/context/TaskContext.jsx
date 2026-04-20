import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useProjects } from './ProjectContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { activeProjectId } = useProjects();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const USER_ID = 'demo_user';

  useEffect(() => {
    if (!activeProjectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'users', USER_ID, 'tasks'),
      where('projectId', '==', activeProjectId),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Tasks fetch error. Using mock mode.", error);
      // Fallback local memory for testing
      setTasks(prev => {
        // Only inject mock if we don't have local state yet to prevent blowing away optimistics
        if(prev.length === 0) {
            return [{
              id: 'mock_t1',
              projectId: activeProjectId,
              title: 'Welcome to this Project',
              isCompleted: false,
              dueDate: new Date().toISOString().split('T')[0],
              priority: 1,
              estimatedTime: 30,
              color: '#3b82f6',
              createdAt: new Date().toISOString()
            }];
        }
        return prev;
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeProjectId]);

  const addTask = async (taskData) => {
    // Optimistic UI Data
    const optimisticId = 'temp_' + Date.now();
    const newTask = {
      ...taskData,
      id: optimisticId,
      projectId: activeProjectId,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);

    try {
      const taskRef = collection(db, 'users', USER_ID, 'tasks');
      await addDoc(taskRef, {
        ...taskData,
        projectId: activeProjectId,
        createdAt: new Date().toISOString()
      });
      // the onSnapshot will naturally replace the temp item
    } catch (e) {
      console.error("Failed to add task", e);
    }
  };

  const updateTask = async (id, fields) => {
    if (id.startsWith('temp_')) return; // Avoid updating an optimism item still syncing
    
    // Optimistic UI updates
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t));

    try {
      const taskRef = doc(db, 'users', USER_ID, 'tasks', id);
      await updateDoc(taskRef, fields);
    } catch (e) {
      console.error("Failed to update task", e);
    }
  };

  const deleteTask = async (id) => {
    if (id.startsWith('temp_')) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      const taskRef = doc(db, 'users', USER_ID, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      selectedTaskId,
      setSelectedTaskId,
      addTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};
