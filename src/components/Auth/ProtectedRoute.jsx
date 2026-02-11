import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { currentUser, userData, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!currentUser) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && userData && !allowedRoles.includes(userData.role)) {
        // User logged in but unauthorized role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
