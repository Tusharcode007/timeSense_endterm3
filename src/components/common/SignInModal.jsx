import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Zap, Mail, Lock } from 'lucide-react';

const LoaderSpinner = () => (
   <div style={{ border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
);

const SignInModal = () => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail, authLoading } = useAuth();
  
  // UI States
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleSignIn = async () => {
      setErrorMsg('');
      setIsLoading(true);
      try {
          await loginWithGoogle();
      } catch (err) {
          setErrorMsg("Google Sign-In failed. Please verify your account popup.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleEmailSubmit = async (e) => {
      e.preventDefault();
      setErrorMsg('');

      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          setErrorMsg("Please enter a valid email address.");
          return;
      }

      if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          return;
      }

      setIsLoading(true);
      try {
          if (isLoginView) {
              await loginWithEmail(email, password);
          } else {
              await signUpWithEmail(email, password, displayName);
          }
      } catch (err) {
          const code = err.code || '';
          if (code === 'auth/email-already-in-use') {
              setErrorMsg("Account already exists. Please log in.");
              setIsLoginView(true);
          } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
              setErrorMsg("Incorrect password.");
          } else if (code === 'auth/user-not-found') {
              setErrorMsg("No account found.");
          } else if (code === 'auth/invalid-email') {
              setErrorMsg("Invalid email format.");
          } else {
              setErrorMsg("Authentication failed. Please verify your credentials.");
          }
      } finally {
          setIsLoading(false);
      }
  };

  if (authLoading) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }}>
           
           <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)' }}>
                   <Zap color="#fff" size={32} />
               </div>
           </div>

           <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'center', margin: '0 0 8px 0' }}>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
           <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
               {isLoginView ? 'Sign in to sync your productivity analytics.' : 'Join the Focus Protocol today.'}
           </p>

           {errorMsg && (
               <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--primary)', padding: '12px', borderRadius: '8px', marginBottom: '24px', color: 'var(--primary)', fontSize: '0.875rem', textAlign: 'center' }}>
                   {errorMsg}
               </div>
           )}

           <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
               {!isLoginView && (
                   <input 
                      type="text" 
                      placeholder="Display Name"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                   />
               )}
               <div style={{ position: 'relative' }}>
                   <Mail color="var(--text-muted)" size={18} style={{ position: 'absolute', top: '14px', left: '16px' }} />
                   <input 
                      type="email" 
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                   />
               </div>
               <div style={{ position: 'relative' }}>
                   <Lock color="var(--text-muted)" size={18} style={{ position: 'absolute', top: '14px', left: '16px' }} />
                   <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
                   />
               </div>

               <button 
                  type="submit"
                  disabled={isLoading}
                  className="glass-button"
                  style={{ width: '100%', padding: '14px', marginTop: '8px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '1rem', fontWeight: 'bold', border: 'none', display: 'flex', justifyContent: 'center' }}
               >
                  {isLoading ? <LoaderSpinner /> : (isLoginView ? 'Sign In' : 'Sign Up')}
               </button>
           </form>

           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
               <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
               <span style={{ padding: '0 12px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
               <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
           </div>

           <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="glass-button"
              style={{ padding: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
           >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
           </button>

           <div style={{ marginTop: '24px', textAlign: 'center' }}>
               <button 
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                     setIsLoginView(!isLoginView);
                     setErrorMsg(''); // Clean bounds on swap
                  }} 
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', cursor: 'pointer', padding: '8px' }}
               >
                   {isLoginView ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}
               </button>
           </div>
       </div>
    </div>
  );
};

export default SignInModal;
