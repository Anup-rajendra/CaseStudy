import React, { useEffect, useState } from 'react';
import "../css/Orders.css";
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ADDRESS_BY_USERID, GET_CARTDETAILS } from '../Apollo/queries';

const Order = () => {
  const [user, setUser] = useState(1);
  const [currentAddressNumber, setAddressNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userData");
    if (userId) {
      setUser(parseInt(userId, 10));
    }
    const addNum = localStorage.getItem('addressnumber');
    setAddressNumber(addNum ? parseInt(addNum, 10) : 0);
  }, []);

  const { loading: addressLoading, error: addressError, data: addressData } = useQuery(GET_ADDRESS_BY_USERID, {
    variables: { userId: user }
  });

  const { loading: cartLoading, error: cartError, data: cartData } = useQuery(GET_CARTDETAILS, {
    variables: { userId: user }
  });

  if (addressLoading || cartLoading) return <p>Loading...</p>;
  if (addressError) return <p>Error fetching addresses: {addressError.message}</p>;
  if (cartError) return <p>Error fetching cart details: {cartError.message}</p>;

  const displayAddress = addressData.addressesByUserId[currentAddressNumber];

  const cartItemsArray = cartData.userById.carts[0].cartItems.map(item => ({
    productName: item.product.name,
    productPrice: item.product.price,
    quantity: item.quantity,
    photoUrl: item.product.photoUrl
  }));

  // Calculate total price and quantity
  const totalQuantity = cartItemsArray.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItemsArray.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

  return (
    <div className="order-container">
      <div className="address-container">
        <h2>Order Details</h2>
        <div className="address-item">
          <p>Street: {displayAddress.street}</p>
          <p>City: {displayAddress.city}, State: {displayAddress.state}, ZipCode: {displayAddress.zipCode}</p>
          <button
            className="change-address-button"
            onClick={() => navigate('/changeaddress')}
          >
            Change Address
          </button>
        </div>
      </div>
      
      <div className="cart-items-container">
        {cartItemsArray.length > 0 ? (
          <div className="cart-items">
            {cartItemsArray.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.photoUrl} alt={item.productName} className="cart-item-image" />
                <div className="cart-item-description">
                  <h3>Name: {item.productName}</h3>
                  <p>Price: ${item.productPrice}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>Total Quantity: {totalQuantity}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
      </div>
      
    </div>
  );
};

export default Order;
