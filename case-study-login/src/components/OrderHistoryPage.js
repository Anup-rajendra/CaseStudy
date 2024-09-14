import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS } from '../Apollo/queries';
import '../css/OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_USER_ORDERS, {
    variables: { userId },
    skip: !userId, // Skip query if userId is null or undefined
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem('userData');
    console.log('Stored userData in localStorage:', storedUserId);
    const parsedUserId = parseInt(storedUserId, 10);
    console.log('Parsed userId:', parsedUserId); // Check if userId is parsed properl

    if (parsedUserId) {
      setUserId(parsedUserId);
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching orders.</p>;

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {data?.userOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        data?.userOrders.map((order) => (
          <div key={order.orderId} className="order-summary">
            <div>Order ID: {order.orderId}</div>
            <div>
              Order Date: {new Date(order.orderDate).toLocaleDateString()}
            </div>
            <div>Total Amount: ${order.totalAmount}</div>
            <button onClick={() => navigate(`/order-details/${order.orderId}`)}>
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;
