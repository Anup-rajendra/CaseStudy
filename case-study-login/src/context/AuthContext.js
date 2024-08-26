    // context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ username: '', password: '' });

    const updateAuth = (username, password) => {
        setAuth({ username, password });
    };

    return (
        <AuthContext.Provider value={{ auth, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
