import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ORDER_DETAILS } from '../Apollo/queries';

const OrderDetailsPage = () => {
  const { orderId } = useParams(); // Retrieve orderId from URL parameters

  // Fetch order details using the orderId
  const { data, loading, error } = useQuery(GET_ORDER_DETAILS, {
    variables: { orderId: parseInt(orderId, 10) }, // Convert orderId to an integer
  });

  if (loading) return <p className="text-center text-lg text-gray-600"> </p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const { getOrderById: order } = data;

  console.log(order);

  return (
    <div className=" py-10 px-4">
      <div className="max-w-5xl mx-auto   shadow-xl rounded-3xl p-8 bg-blue-100">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Order Details
        </h2>

        {/* Order Summary */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Order Summary
          </h3>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <p className="mb-3">
              <span className="font-semibold">Order Date:</span>{' '}
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p className="mb-3">
              <span className="font-semibold">Total Amount:</span> Rs.
              {order.totalAmount}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">Products</h3>
        <div className="space-y-6">
          {order.orderItems.map((item) => (
            <div
              key={item.product.productId}
              className="bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 "
            >
              <img
                src={item.product.photoUrl}
                alt={item.product.name}
                className="w-full md:w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold text-xl text-gray-800">
                  {item.product.name}
                </p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: Rs.{item.price}</p>
                <p className="font-semibold text-gray-800">
                  Subtotal: Rs.{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Shipment Tracking */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Shipment Tracking
          </h3>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <p>Tracking Number: {order.shipment.trackingNumber}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Shipping Address
          </h3>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            {order.shippingAddress ? (
              <>
                <p>
                  Street:{' '}
                  {order.shippingAddress.street || 'Street not available'}
                </p>
                <p>
                  City: {order.shippingAddress.city || 'City not available'}
                </p>
                <p>
                  State: {order.shippingAddress.state || 'State not available'}
                </p>
                <p>
                  Zip Code:{' '}
                  {order.shippingAddress.zipCode || 'Zip Code not available'}
                </p>
              </>
            ) : (
              <p>
                Adarsh Palm Retreat Internal Road, Bengaluru Karnataka - 560103
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
