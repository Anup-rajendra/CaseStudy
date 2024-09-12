import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Order from './components/Order';
import Signing from './components/signing';
import ChangeAddress from './components/ChangeAddress';
import AddAddress from './components/AddAddress';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import Checkout from './components/Checkout';

import NotificationComponent from './components/Notification';
function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/signing" element={<Signing />} />
                    <Route path="*" element={<Login />}/>
                    <Route path='/notification' element={<NotificationComponent/>}/>
                    {/* Wrap protected routes with ProtectedRoute */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/order" element={<Order/>}/>
                        <Route path="/add-address" element={<AddAddress />} />
                        <Route path="/changeaddress" element={<ChangeAddress/>}/>
                        <Route path="/checkout" element={<Checkout/>}/>
                    </Route>
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;
