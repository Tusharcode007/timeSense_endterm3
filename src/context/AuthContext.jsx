import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginWithGoogleService, logoutService, signUpWithEmailService, loginWithEmailService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
     id: null,
     email: null,
     displayName: null,
     photoURL: null,
     plan: 'free', 
     isAuthenticated: false,
     calendarToken: null // Stores OAuth accessToken natively
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Standard persistent Firebase auth check
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
          // Note: Persistent logins don't automatically contain the standalone oauthToken again without re-auth.
          // But we securely remount the identity map.
          setUser(prev => ({
             ...prev, 
             id: firebaseUser.uid,
             email: firebaseUser.email,
             displayName: firebaseUser.displayName,
             photoURL: firebaseUser.photoURL,
             isAuthenticated: true 
          }));
      } else {
          setUser({ id: null, email: null, displayName: null, photoURL: null, plan: 'free', isAuthenticated: false, calendarToken: null });
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
     try {
         const userPayload = await loginWithGoogleService();
         setUser(prev => ({
             ...prev,
             id: userPayload.uid,
             email: userPayload.email,
             displayName: userPayload.displayName,
             photoURL: userPayload.photoURL,
             isAuthenticated: true,
             calendarToken: userPayload.calendarToken
         }));
         return true;
     } catch (error) {
         throw error;
     }
  };

  const signUpWithEmail = async (email, password, displayName) => {
      try {
          const userPayload = await signUpWithEmailService(email, password, displayName);
          setUser(prev => ({
              ...prev,
              id: userPayload.uid,
              email: userPayload.email,
              displayName: userPayload.displayName,
              photoURL: userPayload.photoURL,
              isAuthenticated: true,
              calendarToken: null
          }));
          return true;
      } catch (error) {
          throw error;
      }
  };

  const loginWithEmail = async (email, password) => {
      try {
          const userPayload = await loginWithEmailService(email, password);
          setUser(prev => ({
              ...prev,
              id: userPayload.uid,
              email: userPayload.email,
              displayName: userPayload.displayName,
              photoURL: userPayload.photoURL,
              isAuthenticated: true,
              calendarToken: null
          }));
          return true;
      } catch (error) {
          throw error;
      }
  };

  const logout = async () => {
      await logoutService();
      setUser({ id: null, email: null, displayName: null, photoURL: null, plan: 'free', isAuthenticated: false, calendarToken: null });
  };

  const upgradeToPremium = () => setUser(prev => ({ ...prev, plan: 'premium' }));

  return (
    <AuthContext.Provider value={{ 
      user, 
      isPremium: user.plan === 'premium', 
      isAuthenticated: user.isAuthenticated, 
      authLoading,
      loginWithGoogle, 
      loginWithEmail,
      signUpWithEmail,
      logout,
      upgradeToPremium 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
