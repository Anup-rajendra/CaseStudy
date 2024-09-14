import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  GET_PRODUCT_BY_ID,
  ADD_NEW_ORDER,
  UPDATE_INVENTORY,
  ADD_SHIPMENT,
  ADD_ORDER_ITEM,
} from '../Apollo/queries';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
const CheckoutItem = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderId, setOrderId] = useState(''); // State for order ID
  const [productIds, setProductIds] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [addNewOrder] = useMutation(ADD_NEW_ORDER);
  const [updateInventory] = useMutation(UPDATE_INVENTORY);
  const [addShipment] = useMutation(ADD_SHIPMENT);
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM);
  const navigate = useNavigate();
  var orderid = 0;
  const {
    loading: productsLoading,
    error: productsError,
    data: productslist,
  } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId: productIds },
    skip: !productIds,
  });
  useEffect(() => {
    console.log(userId, orderDate);
    const fetchData = async () => {
      try {
        const userIdFromStorage = parseInt(
          localStorage.getItem('userData'),
          10
        );
        const totalPriceFromStorage =
          parseInt(localStorage.getItem('TotalPurchasePrice'), 10) || 0;
        const productIdFromStorage =
          parseInt(localStorage.getItem('ProductId'), 10) || null;
        setProductIds(productIdFromStorage);
        setUserId(userIdFromStorage);
        setTotalPrice(totalPriceFromStorage);

        if (
          userIdFromStorage &&
          totalPriceFromStorage &&
          productIdFromStorage
        ) {
          // Adding a new order
          const { data: orderData } = await addNewOrder({
            variables: {
              userId: userIdFromStorage,
              totalPrice: totalPriceFromStorage,
              skip: !userId,
            },
          });
          console.log('Order data:', orderData);
          setOrderId(orderData.addNewOrder.orderId); // Set orderId in state
          setOrderDate(new Date(orderData.addNewOrder.orderDate).toISOString());

          orderid = orderData.addNewOrder.orderId;
          const { data: UpdatedInventory } = await updateInventory({
            variables: {
              inventoryId: productIdFromStorage,
              quantity: 1,
            },
            skip: !productIds,
          });
          console.log(UpdatedInventory);
          // Adding Shipment to the order
          const { data: Shipmentdetails } = await addShipment({
            variables: { orderId: orderData.addNewOrder.orderId },
          });
          console.log(Shipmentdetails);
          setDeliveryDate(Shipmentdetails.addShipment.deliveryDate);

          try {
            const { data: OrderItem } = await addOrderItem({
              variables: {
                orderId: orderData.addNewOrder.orderId,
                productId: productIdFromStorage,
                quantity: 1,
                skip: !productIds,
              },
            });
            console.log(OrderItem);
          } catch (error) {
            console.error('Error adding order item:', error);
          }
        }
        // Define the order summary with the correct types
        const orderSummary = {
          userId: userIdFromStorage,
          addressNumber: parseInt(
            localStorage.getItem('addressnumber') || '0',
            10
          ),
          orderId: orderid,
          orderDate: new Date().toISOString(), // Ensure this is in ISO 8601 format
          ProductsIds: productIds, // Match the backend property name
          Quantity: 1, // Match the backend property name
        };

        console.log('Order Summary:', orderSummary);

        try {
          const response = await axios.post(
            'http://localhost:5071/api/Notifications',
            orderSummary,
            { headers: { 'Content-Type': 'application/json' } }
          );

          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      } catch (error) {
        console.error('An error occurred during checkout:', error);
      }
    };

    fetchData();
  }, []);
  if (productsLoading) return <p>Loading products...</p>;
  if (productsError)
    return <p>Error loading products: {productsError.message}</p>;
  return (
    <section className="checkout">
      <div className="container py-5">
        <div className="card">
          <div className="card-body">
            <h2 className="title">Purchase Receipt</h2>

            <div className="info">
              <div className="info-item">
                <span>Date</span>
                <p>{new Date().toLocaleString()}</p>
              </div>
              <div className="info-item">
                <span>Order No.</span>
                <p>{orderId}</p>
              </div>
            </div>

            <div className="details">
              {productslist?.productByIdList?.map((product, index) => (
                <div className="detail-item" key={index}>
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="checkout-product-image"
                  />
                  <span>{product.name}</span>
                  <p>1</p>
                  <p>£{product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="total">
              <p>£{totalPrice.toFixed(2)}</p>
            </div>

            <h3 className="tracking-title">Tracking Order</h3>

            <ul className="timeline">
              <li className="ordered">Ordered</li>
              <li className="shipped">Shipped</li>
              <li className="on-the-way">On the way</li>
              <li className="delivered text-end">Delivered</li>
            </ul>

            <div>
              <p>Delivery Date: {deliveryDate}</p>
            </div>

            <div className="button-container">
              <button
                className="continue-shopping"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>

            <p className="contact">
              Want any help?{' '}
              <a href="#!" className="contact-link">
                Please contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutItem;
