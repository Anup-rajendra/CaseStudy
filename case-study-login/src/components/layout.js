import React from 'react';
import NavBar from './NavBar'; // Adjust the path as needed
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1 bg-gray min-h-[100vh-100px] bg-gray-100 pb-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
