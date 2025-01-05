import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/Login-Admin" />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/AdminError" />;
    }

    return children;
};

export default ProtectedRoute;
