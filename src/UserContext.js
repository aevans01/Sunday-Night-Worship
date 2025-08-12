import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from 'axios';

// ✅ Always include credentials (cookies) with requests
Axios.defaults.withCredentials = true;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Optional: load from localStorage for faster page reload
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Called after login
    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Called after logout
    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('user');
    };

    // ✅ Check existing session on first render
    useEffect(() => {
        Axios.get('https://hhbc-snw-api.netlify.app/api/session')
            .then(res => {
                if (res.data.loggedIn) {
                    setUser(res.data.user);
                    setRole(res.data.user.role);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                } else {
                    logout();
                }
            })
            .catch(() => logout())
            .finally(() => setLoading(false));
    }, []);

    return (
        <UserContext.Provider value={{ user, role, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
