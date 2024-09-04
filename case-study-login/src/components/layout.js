import React from 'react';
import NavBar from './NavBar'; // Adjust the path as needed
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <NavBar />
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
