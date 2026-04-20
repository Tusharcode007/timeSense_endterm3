import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

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
         const provider = new GoogleAuthProvider();
         // Explicitly request calendar scopes to generate a usable access token
         provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
         
         const result = await signInWithPopup(auth, provider);
         
         // Extract the Google Access Token securely
         const credential = GoogleAuthProvider.credentialFromResult(result);
         const token = credential.accessToken;
         const userPayload = result.user;

         setUser({
             id: userPayload.uid,
             email: userPayload.email,
             displayName: userPayload.displayName,
             photoURL: userPayload.photoURL,
             plan: 'free',
             isAuthenticated: true,
             calendarToken: token
         });
         return true;
     } catch (error) {
         console.error("Google SSO Failure:", error);
         return false;
     }
  };

  const logout = async () => {
      await signOut(auth);
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
      logout,
      upgradeToPremium 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
