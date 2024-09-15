import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS } from '../Apollo/queries';
import { Button } from './ui/button';
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
    const parsedUserId = parseInt(storedUserId, 10);
    if (parsedUserId) {
      setUserId(parsedUserId);
    }
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error fetching orders.</p>;

  return (
    <div className=" py-10">
      <div className="flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold mb-10">Order History</h1>
        <div className="  rounded-xl w-full max-w-4xl">
          {data?.userOrders.length === 0 ? (
            <p className="text-center py-6 text-gray-600">No orders found.</p>
          ) : (
            data?.userOrders.map((order) => (
              <div
                key={order.orderId}
                className="shadow-lg border-b rounded-xl last:border-none p-6 bg-blue-100 mb-6"
              >
                <div className="flex justify-between">
                  <div className="mb-2">
                    <span className="font-semibold text-primary">
                      Order ID:
                    </span>{' '}
                    {order.orderId}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-primary">
                      Order Date:
                    </span>{' '}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-primary">
                      Total Amount:
                    </span>{' '}
                    Rs.
                    {order.totalAmount}
                  </div>
                  <Button
                    onClick={() => navigate(`/order-details/${order.orderId}`)}
                    className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
