import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useTasks } from './TaskContext';

const SubtaskContext = createContext();

export const useSubtasks = () => useContext(SubtaskContext);

export const SubtaskProvider = ({ children }) => {
  const { selectedTaskId, updateTask } = useTasks();
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const USER_ID = 'demo_user';

  useEffect(() => {
    if (!selectedTaskId) {
      setSubtasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'users', USER_ID, 'subtasks'),
      where('taskId', '==', selectedTaskId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubtasks(stData);
      setLoading(false);
      
      // Auto-complete logic check could exist here potentially, 
      // but it's safer during explicit toggle to prevent infinite loops.
    }, (error) => {
      console.error("Firebase Subtasks fetch error. Using mock mode.", error);
      // Fallback local memory for testing
      if (selectedTaskId === 'mock_t1') {
        setSubtasks([
          { id: 'mock_st1', taskId: 'mock_t1', title: 'Start breaking down task', isCompleted: false, color: '#f59e0b', createdAt: new Date().toISOString() }
        ]);
      } else {
        setSubtasks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedTaskId]);

  const addSubtask = async (stData) => {
    if (!selectedTaskId) return;

    const optimisticId = 'temp_st_' + Date.now();
    const newSt = {
      ...stData,
      id: optimisticId,
      taskId: selectedTaskId,
      createdAt: new Date().toISOString()
    };
    
    setSubtasks(prev => [...prev, newSt]);

    try {
      const stRef = collection(db, 'users', USER_ID, 'subtasks');
      await addDoc(stRef, {
        ...stData,
        taskId: selectedTaskId,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Failed to add subtask", e);
    }
  };

  const updateSubtask = async (id, fields) => {
    if (id.startsWith('temp_')) return;
    
    setSubtasks(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t));

    try {
      const stRef = doc(db, 'users', USER_ID, 'subtasks', id);
      await updateDoc(stRef, fields);

      // Auto-complete check logic
      if (fields.isCompleted !== undefined && fields.isCompleted === true) {
        // Snapshot the state AFTER this toggle
        const checkArr = subtasks.map(t => t.id === id ? { ...t, ...fields } : t);
        const allDone = checkArr.length > 0 && checkArr.every(st => st.isCompleted);
        
        // If all are completed, optionally complete the parent.
        // Doing this seamlessly without a user option for the sake of standard Focus-Todo UX
        if (allDone) {
            updateTask(selectedTaskId, { isCompleted: true });
        }
      }
    } catch (e) {
      console.error("Failed to update subtask", e);
    }
  };

  const deleteSubtask = async (id) => {
    if (id.startsWith('temp_')) return;

    setSubtasks(prev => prev.filter(t => t.id !== id));
    try {
      const stRef = doc(db, 'users', USER_ID, 'subtasks', id);
      await deleteDoc(stRef);
    } catch (e) {
      console.error("Failed to delete subtask", e);
    }
  };

  return (
    <SubtaskContext.Provider value={{
      subtasks,
      loading,
      addSubtask,
      updateSubtask,
      deleteSubtask
    }}>
      {children}
    </SubtaskContext.Provider>
  );
};
