import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ORDER_DETAILS } from '../Apollo/queries'; // Make sure this path is correct
import '../css/OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams(); // Retrieve orderId from URL parameters

  // Fetch order details using the orderId
  const { data, loading, error } = useQuery(GET_ORDER_DETAILS, {
    variables: { orderId: parseInt(orderId, 10) }, // Convert orderId to an integer
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>; // Display the actual error message

  const { getOrderById: order } = data;

  return (
    <div className="order-details-container">
      <h2>Order Details for Order ID: {order.orderId}</h2>
      
      {/* Order Summary */}
      <div className="order-summary">
        <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
        <p>Total Amount: ${order.totalAmount}</p>
      </div>

      {/* Product Details */}
      <h3>Products:</h3>
      {order.orderItems.map((item) => (
        <div key={item.product.productId} className="product-details">
          <img src={item.product.photoUrl} alt={item.product.name} className="product-image" />
          <p>Product: {item.product.name}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price}</p>
          <p>Subtotal: ${item.price * item.quantity}</p>
        </div>
      ))}

      {/* Shipment Tracking */}
      <h3>Shipment Tracking:</h3>
      <p>Tracking Number: {order.shipment.trackingNumber}</p>
    </div>
  );
};

export default OrderDetailsPage;
