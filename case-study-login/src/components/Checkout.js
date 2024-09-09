import React, { useEffect, useState } from 'react';
import "../css/Checkout.css";
import { useMutation, useQuery } from '@apollo/client';
import { ADD_NEW_ORDER, DELETE_CART_ITEM_BY_CART_ID, UPDATE_INVENTORY, ADD_SHIPMENT, ADD_ORDER_ITEM, GET_PRODUCTS_BY_IDS } from '../Apollo/queries';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderId, setOrderId] = useState(""); // State for order ID
  const [productIds, setProductIds] = useState([]); // State for product IDs
  const [quantities, setQuantities] = useState([]); // State for product quantities
  const [deliveryDate, setDeliveryDate] = useState(""); // State for delivery date
  const[orderDate,setOrderDate]=useState("");

  const [addNewOrder] = useMutation(ADD_NEW_ORDER);
  const [deleteCartItemByCartId] = useMutation(DELETE_CART_ITEM_BY_CART_ID);
  const [updateInventory] = useMutation(UPDATE_INVENTORY);
  const [addShipment] = useMutation(ADD_SHIPMENT);
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM);
  const navigate = useNavigate();
  
  //Non state variable
  var productids=[]
  var quantityarray=[]
  var orderid=0;

  // Fetch products based on product IDs
  const { loading: productsLoading, error: productsError, data: productslist } = useQuery(GET_PRODUCTS_BY_IDS, {
    variables: { productIds },
    skip: productIds.length === 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdFromStorage = parseInt(localStorage.getItem('userData'), 10);
        const totalPriceFromStorage = parseInt(localStorage.getItem('TotalPurchasePrice')) || 0;

        setUserId(userIdFromStorage);
        setTotalPrice(totalPriceFromStorage);

        if (userIdFromStorage && totalPriceFromStorage) {
          // Adding a new order
          const { data: orderData } = await addNewOrder({
            variables: { userId: userIdFromStorage, totalPrice: totalPriceFromStorage },
          });
          console.log('Order data:', orderData);
          setOrderId(orderData.addNewOrder.orderId); // Set orderId in state
          setOrderDate(orderData.addNewOrder.orderDate);

          orderid=orderData.addNewOrder.orderId;

          // Deleting cart items
          const { data: cartData } = await deleteCartItemByCartId({
            variables: { cartId: userIdFromStorage },
          });
          console.log('Cart item data:', cartData);

          const productIdsArray = [];
          const quantitiesArray = [];
          cartData.deleteCartItemByCartId.forEach((element) => {
            productIdsArray.push(element.productId);
            quantitiesArray.push(element.productQuantity);
          });

          setProductIds(productIdsArray); // Set product IDs in state
          setQuantities(quantitiesArray); // Set quantities in state
          productids=productIdsArray;
          quantityarray=quantitiesArray;
          console.log(productIdsArray);
          console.log(quantitiesArray);

          // Updating the Inventory (Stock Quantity)
          for (let i = 0; i < productIdsArray.length; i++) {
            const { data: UpdatedInventory } = await updateInventory({
              variables: { inventoryId: productIdsArray[i], quantity: quantitiesArray[i] },
            });
            console.log(UpdatedInventory);
          }

          // Adding Shipment to the order
          const { data: Shipmentdetails } = await addShipment({
            variables: { orderId: orderData.addNewOrder.orderId },
          });
          console.log(Shipmentdetails);
          setDeliveryDate(Shipmentdetails.addShipment.deliveryDate);
          
          // Adding OrderItems details
          for (let i = 0; i < productIdsArray.length; i++) {
            try {
              const { data: OrderItem } = await addOrderItem({
                variables: { orderId: orderData.addNewOrder.orderId, productId: productIdsArray[i], quantity: quantitiesArray[i] },
              });
              console.log(OrderItem);
            } catch (error) {
              console.error('Error adding order item:', error);
            }
          }
        }
        // Define the order summary with the correct types
        const orderSummary = {
        userId: userIdFromStorage,
        addressNumber: parseInt(localStorage.getItem('addressnumber') || '0', 10),
        orderId: orderid,
        orderDate: new Date().toISOString(), // Ensure this is in ISO 8601 format
        ProductsIds: productids, // Match the backend property name
        Quantity: quantityarray // Match the backend property name
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
  }, [addNewOrder, deleteCartItemByCartId, updateInventory, addShipment, addOrderItem]);

  if (productsLoading) return <p>Loading products...</p>;
  if (productsError) return <p>Error loading products: {productsError.message}</p>;

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
                <p>{orderId}</p>
              </div>
            </div>

            <div className="details">
              {productslist?.productByIdList?.map((product, index) => (
                <div className="detail-item" key={index}>
                  <img src={product.photoUrl} alt={product.name} className="checkout-product-image" />
                  <span>{product.name}</span>
                  <p>{quantities[index]}</p>
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
              <button className="continue-shopping" onClick={() => navigate('/products')}>
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
