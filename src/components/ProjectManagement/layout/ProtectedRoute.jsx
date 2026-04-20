import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import SignInModal from '../../common/SignInModal';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authLoading } = useAuth();
    
    // Prevent flickering while Firebase initially verifies the token payload
    if (authLoading) {
        return (
            <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    // Explicit rejection barrier routing
    if (!isAuthenticated) {
        return <SignInModal />;
    }

    // Authorized Pipeline
    return children;
};

export default ProtectedRoute;
