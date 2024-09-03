import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Order from './components/Order';
import Signing from './components/signing';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

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
                        <Route path="/orders" element={<Order/>}/>
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
