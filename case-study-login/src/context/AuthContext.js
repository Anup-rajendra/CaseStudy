import React, { createContext, useState } from 'react';

// Create a Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to log in the user
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userData",userData.userId);
    };

    // Function to log out the user
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
