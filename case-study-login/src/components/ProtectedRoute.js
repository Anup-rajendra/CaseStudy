import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login page if the user is not authenticated
        return <Navigate to="/Login" />;
    }

    return children;
};

export default ProtectedRoute;
