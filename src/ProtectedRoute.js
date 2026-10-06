import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading, sessionError, refreshSession } = useUser();

    if (loading) return <p role="status">Checking your session…</p>;
    if (sessionError) return (
        <div role="alert">
            <p>{sessionError}</p>
            <button onClick={refreshSession}>Retry session check</button>
        </div>
    );

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    if (!roles.map(String).includes(String(user.role))) {
        return <Navigate to="/AdminError" />;
    }

    return children;
};

export default ProtectedRoute;
