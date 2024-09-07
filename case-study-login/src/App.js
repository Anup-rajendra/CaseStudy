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
import ProductDetails from './components/ProductDetails';
import Categories from './components/Categories';
import Searched from './components/Searchedproducts';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/signing" element={<Signing />} />
                    <Route path="*" element={<Login />}/>
                    {/* Wrap protected routes with ProtectedRoute */}
                    <Route element={<Layout />}>
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/Searches" element={<Searched />} />
                        <Route path="/product/:userId" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/order" element={<Order/>}/>
                        <Route path="/add-address" element={<AddAddress />} />
                        <Route path="/changeaddress" element={<ChangeAddress/>}/>
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
