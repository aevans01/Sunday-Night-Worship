import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Only the server can establish a valid session, never cached localStorage.
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionError, setSessionError] = useState(null);
    const requestVersion = useRef(0);

    const refreshSession = useCallback(async () => {
        const version = ++requestVersion.current;
        setLoading(true);
        setSessionError(null);
        try {
            const { data } = await Axios.get('/api/session', { withCredentials: true });
            if (version !== requestVersion.current) return;
            if (typeof data.loggedIn !== 'boolean' || (data.loggedIn && !data.user)) {
                throw new Error('Invalid session response');
            }
            setUser(data.loggedIn ? data.user : null);
        } catch {
            if (version !== requestVersion.current) return;
            // A connection failure does not mean the server signed the user out.
            setSessionError('Unable to check your session. Please try again.');
        } finally {
            if (version === requestVersion.current) setLoading(false);
        }
    }, []);

    const login = (userData) => {
        ++requestVersion.current; // Ignore any older, still-running session check.
        setUser(userData);
        setSessionError(null);
        setLoading(false);
    };

    const logout = async () => {
        await Axios.post('/api/logout', {}, { withCredentials: true });
        ++requestVersion.current;
        setUser(null);
        setSessionError(null);
        setLoading(false);
    };

    useEffect(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('userID');
        refreshSession();
        const versionRef = requestVersion;
        return () => { ++versionRef.current; };
    }, [refreshSession]);

    return (
        <UserContext.Provider value={{ user, role: user ? String(user.role) : null,
            login, logout, loading, sessionError, refreshSession }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
