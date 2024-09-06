import React, { useState,useEffect } from 'react';
import {   Route, Routes, useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Login from './components/Login';
import Products from './components/Products';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Order from './components/Order';
import Signing from './components/signing';

function App() {
 
    const location = useLocation();
    const [progress,setProgress]=useState(0);

    useEffect(() => {
        // Start loading when location changes
        setProgress(30); // Start with 30% progress
        const timer = setTimeout(() => {
            setProgress(100); // Complete loading after a short delay
        }, 500); // Adjust the delay as needed

        // Reset progress to 0 when loading is complete
        return () => {
            clearTimeout(timer);
            setProgress(0);
        };
    }, [location]);

    return (
      
            <div>
                <LoadingBar
        color="#ffffff"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
                
                <Routes>
                    <Route path="/signing" element={<Signing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Login />}/>
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/orders" element={<Order/>}/>
                    </Route>
                </Routes>
            </div>
  
    );
}

export default App;
