import React, { useEffect, useState } from 'react';
import "../css/Checkout.css";
import { useMutation } from '@apollo/client';
import { ADD_NEW_ORDER, DELETE_CART_ITEM_BY_CART_ID ,UPDATE_INVENTORY,ADD_SHIPMENT,ADD_ORDER_ITEM} from '../Apollo/queries';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addNewOrder] = useMutation(ADD_NEW_ORDER);
  const [deleteCartItemByCartId] = useMutation(DELETE_CART_ITEM_BY_CART_ID);
  const [updateInventory]=useMutation(UPDATE_INVENTORY);
  const [addShipment]=useMutation(ADD_SHIPMENT);
  const [addOrderItem]=useMutation(ADD_ORDER_ITEM);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdFromStorage = parseInt(localStorage.getItem('userData'), 10);
        const totalPriceFromStorage = parseInt(localStorage.getItem('TotalPurchasePrice')) || 0;
  
        // Update state
        setUserId(userIdFromStorage);
        setTotalPrice(totalPriceFromStorage);
  
        if (userIdFromStorage && totalPriceFromStorage) {
          // Adding a new order
          const { data: orderData } = await addNewOrder({
            variables: { userId: userIdFromStorage, totalPrice: totalPriceFromStorage },
          });
          console.log('Order data:', orderData);
  
          // Deleting cart items
          const { data: cartData } = await deleteCartItemByCartId({
            variables: { cartId: userIdFromStorage },
          });
          console.log('Cart item data:', cartData);
  
          var productids = [];
          var quantities = [];
          cartData.deleteCartItemByCartId.forEach((element) => {
            productids.push(element.productId);
            quantities.push(element.productQuantity);
          });
  
          console.log(productids);
          console.log(quantities);
  
          // Updating the Inventory (Stock Quantity)
          for (let i = 0; i < productids.length; i++) {
            const { data: UpdatedInventory } = await updateInventory({
              variables: { inventoryId: productids[i], quantity: quantities[i] },
            });
            console.log(UpdatedInventory);
          }
  
          // Adding Shipment to the order
          const { data: Shipmentdetails } = await addShipment({
            variables: { orderId: orderData.addNewOrder.orderId },
          });
          console.log(Shipmentdetails);
  
          // Adding OrderItems details
          for (let i = 0; i < productids.length; i++) {
            try {
              const { data: OrderItem } = await addOrderItem({
                variables: { orderId: orderData.addNewOrder.orderId, productId: productids[i], quantity: quantities[i] },
              });
              console.log(OrderItem);
            } catch (error) {
              // Catching and logging the error
              console.error('Error adding order item:', error);
              // Optionally, you can log this error or ignore it completely based on your needs
            }
          }
        }
      } catch (error) {
        console.error('An error occurred during checkout:', error);
        // Handle the error gracefully
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <section className="checkout">
      <div className="container py-5">
        <div className="card">
          <div className="card-body">
            <h2 className="title">Purchase Receipt</h2>

            <div className="info">
              <div className="info-item">
                <span>Date</span>
                <p>10 April 2021</p>
              </div>
              <div className="info-item">
                <span>Order No.</span>
                <p>012j1gvs356c</p>
              </div>
            </div>

            <div className="details">
              <div className="detail-item">
                <span>BEATS Solo 3 Wireless Headphones</span>
                <p>£299.99</p>
              </div>
              <div className="detail-item">
                <span>Shipping</span>
                <p>£33.00</p>
              </div>
            </div>

            <div className="total">
              <p>£{totalPrice.toFixed(2)}</p>
            </div>

            <h3 className="tracking-title">Tracking Order</h3>

            <ul className="timeline">
              <li>Ordered</li>
              <li>Shipped</li>
              <li>On the way</li>
              <li className="text-end">Delivered</li>
            </ul>

            <div className="button-container">
                <button className="continue-shopping" onClick={() => { navigate('/products'); }}>
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

export default Checkout;