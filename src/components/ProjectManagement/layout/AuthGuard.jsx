import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import SignInModal from '../../common/SignInModal';
import DashboardLayout from './DashboardLayout';

const AuthGuard = () => {
    const { isAuthenticated } = useAuth();
    
    return (
        <>
           {!isAuthenticated && <SignInModal />}
           <DashboardLayout />
        </>
    );
};

export default AuthGuard;
