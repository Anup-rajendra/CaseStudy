import React, { useEffect, useState } from 'react';
import '../css/Checkout.css';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_NEW_ORDER,
  DELETE_CART_ITEM_BY_CART_ID,
  UPDATE_INVENTORY,
  ADD_SHIPMENT,
  ADD_ORDER_ITEM,
  GET_PRODUCTS_BY_IDS,
} from '../Apollo/queries';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderId, setOrderId] = useState(''); // State for order ID
  const [productIds, setProductIds] = useState([]); // State for product IDs
  const [quantities, setQuantities] = useState([]); // State for product quantities
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderDate, setOrderDate] = useState('');

  const [addNewOrder] = useMutation(ADD_NEW_ORDER);
  const [deleteCartItemByCartId] = useMutation(DELETE_CART_ITEM_BY_CART_ID);
  const [updateInventory] = useMutation(UPDATE_INVENTORY);
  const [addShipment] = useMutation(ADD_SHIPMENT);
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM);
  const navigate = useNavigate();

  //Non state variable
  var productids = [];
  var quantityarray = [];
  var orderid = 0;

  // Fetch products based on product IDs
  const {
    loading: productsLoading,
    error: productsError,
    data: productslist,
  } = useQuery(GET_PRODUCTS_BY_IDS, {
    variables: { productIds },
    skip: productIds.length === 0,
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
          parseInt(localStorage.getItem('TotalPurchasePrice')) || 0;

        setUserId(userIdFromStorage);
        setTotalPrice(totalPriceFromStorage);

        if (userIdFromStorage && totalPriceFromStorage) {
          // Adding a new order
          const { data: orderData } = await addNewOrder({
            variables: {
              userId: userIdFromStorage,
              totalPrice: totalPriceFromStorage,
            },
          });
          console.log('Order data:', orderData);
          setOrderId(orderData.addNewOrder.orderId); // Set orderId in state
          setOrderDate(orderData.addNewOrder.orderDate);

          orderid = orderData.addNewOrder.orderId;

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
          productids = productIdsArray;
          quantityarray = quantitiesArray;
          console.log(productIdsArray);
          console.log(quantitiesArray);

          // Updating the Inventory (Stock Quantity)
          for (let i = 0; i < productIdsArray.length; i++) {
            const { data: UpdatedInventory } = await updateInventory({
              variables: {
                inventoryId: productIdsArray[i],
                quantity: quantitiesArray[i],
              },
            });
            console.log(UpdatedInventory);
          }

          // Adding Shipment to the order
          const { data: Shipmentdetails } = await addShipment({
            variables: { orderId: orderData.addNewOrder.orderId },
          });
          console.log(Shipmentdetails);

          // Adding OrderItems details
          for (let i = 0; i < productIdsArray.length; i++) {
            try {
              const { data: OrderItem } = await addOrderItem({
                variables: {
                  orderId: orderData.addNewOrder.orderId,
                  productId: productIdsArray[i],
                  quantity: quantitiesArray[i],
                },
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
          addressNumber: parseInt(
            localStorage.getItem('addressnumber') || '0',
            10
          ),
          orderId: orderid,
          orderDate: new Date().toISOString(), // Ensure this is in ISO 8601 format
          ProductsIds: productids, // Match the backend property name
          Quantity: quantityarray, // Match the backend property name
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
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 5);
    const futureDateStr = futureDate.toLocaleDateString();

    // Update the state with the future date string
    setDeliveryDate(futureDateStr);
  }, [
    addNewOrder,
    deleteCartItemByCartId,
    updateInventory,
    addShipment,
    addOrderItem,
  ]);

  if (productsLoading) return <p>Loading products...</p>;
  if (productsError)
    return <p>Error loading products: {productsError.message}</p>;

  return (
    <section className="flex items-center justify-center ">
      <div className=" w-full mx-auto px-4 pt-16">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Purchase Receipt
            </h2>

            <div className="mb-6 ">
              <div className="pb-2 border-b">
                <span className="block text-gray-600 font-semibold">Date</span>
                <p className="text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="border-b pt-2 pb-2">
                <span className="block text-gray-600 font-semibold">
                  Order No.
                </span>
                <p className="text-gray-800">{orderId}</p>
              </div>
            </div>

            <div className="mb-6">
              {productslist?.productByIdList?.map((product, index) => (
                <div
                  className="flex items-center mb-4 border-b pb-4"
                  key={index}
                >
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md border border-gray-300 mr-4"
                  />
                  <div className="flex-1 pl-8">
                    <span className="block text-lg font-semibold text-green-700">
                      {product.name}
                    </span>
                    <p className="text-green-700">
                      Quantity: {quantities[index]}
                    </p>
                    <p className="text-green-700">
                      Rs.{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-xl font-bold text-green-700">
                Total: Rs.{totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-gray-800">Delivery Date: {deliveryDate}</p>
            </div>

            <div className="mt-6 text-center">
              <button
                className="bg-gradient-to-r from-primary to-blue-400 animated-background text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
