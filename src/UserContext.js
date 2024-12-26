import React, { createContext, useContext, useState } from 'react';

// Create a context
const UserContext = createContext();

// Hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user info and role here

    const login = (username, role) => {
        setUser({ username, role });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user,setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
