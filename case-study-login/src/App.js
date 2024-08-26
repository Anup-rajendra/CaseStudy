import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Signing from './components/signing';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/signing" element={<Signing />} />
                    <Route path="*" element={<Login />}/>
                    {/* Wrap protected routes with ProtectedRoute */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart/>}/>
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
