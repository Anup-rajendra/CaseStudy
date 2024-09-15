import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const publicRoutes = ['/forgot-password', '/reset-password', '/verify-otp'];

  // Allow access to public routes
  if (!token && publicRoutes.includes(window.location.pathname)) {
    return children;
  }

  // Redirect to login page if the user is not authenticated
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
