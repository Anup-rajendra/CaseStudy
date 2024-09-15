import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Login from './components/Login';
import Products from './components/Products';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Order from './components/Order';
import Signing from './components/signing';
import ChangeAddress from './components/ChangeAddress';
import AddAddress from './components/AddAddress';
import Checkout from './components/Checkout';
import OrderItem from './components/OrderItem';
import ProductDetails from './components/ProductDetails';
import Wishlist from './components/Wishlist';
import Profile from './components/ProfilePage';
import OrderHistoryPage from './components/OrderHistoryPage';
import OrderDetailsPage from './components/OrderDetailsPage';
import CustomerSupportPage from './components/CustomerSupportPage';
import SearchedProducts from './components/SearchedProducts';
import Categories from './components/Categories';
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import CheckoutItem from './components/CheckoutItem';
import ChangePassword from './components/ChangePassword';
function App() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

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
        <Route path="*" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/changeaddress" element={<ChangeAddress />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orderitem" element={<OrderItem />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route
            path="/order-details/:orderId"
            element={<OrderDetailsPage />}
          />
          <Route path="/checkout-item" element={<CheckoutItem />} />
          <Route path="/customer-support" element={<CustomerSupportPage />} />
          <Route path="/Searches" element={<SearchedProducts />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
