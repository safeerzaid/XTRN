import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = () => {
  const { accessToken, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  const isLoggedIn = Boolean(accessToken) || Boolean(user);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
