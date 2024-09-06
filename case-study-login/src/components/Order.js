import React, { useEffect, useState } from 'react';
import "../css/Orders.css";
import { useQuery } from '@apollo/client';
import { GET_ADDRESS_BY_USERID, GET_CARTDETAILS } from '../Apollo/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [userId, setUserId] = useState(null);
  const [currentAddressNumber, setCurrentAddressNumber] = useState(0);
  const navigate = useNavigate();

  // Retrieve user ID and address number from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userData");
    const storedAddressNumber = localStorage.getItem('addressnumber');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
    setCurrentAddressNumber(storedAddressNumber ? parseInt(storedAddressNumber, 10) : 0);
  }, []);

  const { loading: addressLoading, error: addressError, data: addressData, refetch: refetchAddress } = useQuery(GET_ADDRESS_BY_USERID, {
    variables: { userId: userId },
    skip: !userId  // Skip if userId is not set
  });

  const { loading: cartLoading, error: cartError, data: cartData, refetch: refetchCart } = useQuery(GET_CARTDETAILS, {
    variables: { userId: userId },
    skip: !userId  // Skip if userId is not set
  });

  // Optionally refetch data when userId or currentAddressNumber changes
  useEffect(() => {
    if (userId !== null) {
      refetchAddress();
      refetchCart();
    }
  }, [userId, currentAddressNumber, refetchAddress, refetchCart]);

  if (addressLoading || cartLoading) return <p>Loading...</p>;
  if (addressError) return <p>Error fetching addresses: {addressError.message}</p>;
  if (cartError) return <p>Error fetching cart details: {cartError.message}</p>;

  const displayAddress = addressData?.addressesByUserId[currentAddressNumber] || {};

  const cartItemsArray = cartData?.userById.carts[0]?.cartItems.map(item => ({
    productName: item.product.name,
    productPrice: item.product.price,
    quantity: item.quantity,
    photoUrl: item.product.photoUrl
  })) || [];

  const totalQuantity = cartItemsArray.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItemsArray.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  localStorage.setItem('TotalPurchasePrice', totalPrice);

  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51PvFPH1adOqTPZqxtt6RZyDNusEZez3sNi8rv3Lb1PXVXf0vQrEjxK4TiAgh12fOmIVGy5f0eLQygl96ldRRrBap00op42RAX4");
    
    const body = {
      products: cartItemsArray
    };
    const headers = {
      "Content-Type": "application/json"
    };
    const response = await fetch("http://localhost:7000/api/create-checkout-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
    navigate('/checkout');
    if (result.error) {
      console.log(result.error);
    }
  };

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
      <div className='order-button'>
        <button onClick={makePayment} className='order-button'>Checkout</button> 
     </div>
    </div>
  );
};

export default Order;
