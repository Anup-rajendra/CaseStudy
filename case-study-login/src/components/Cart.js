import React, { useEffect, useState } from 'react';
import "../css/Cart.css";
import { useQuery, useMutation } from '@apollo/client';
import { GET_CARTDETAILS, UPDATE_CART_ITEM_QUANTITY } from '../Apollo/queries';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [user, setUser] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [updateCartItemByCartId] = useMutation(UPDATE_CART_ITEM_QUANTITY);

  useEffect(() => {
    const userId = localStorage.getItem("userData");
    setUser(parseInt(userId, 10));
  }, []);

  const { loading, error, data } = useQuery(GET_CARTDETAILS, {
    variables: { userId: user },
    onCompleted: (data) => {
      const initialCartItems = data.userById.carts[0].cartItems.map(item => ({
        cartItemId: item.cartItemId,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        photoUrl: item.product.photoUrl
      }));
      setCartItems(initialCartItems);
    }
  });

  useEffect(() => {
    console.log('Updated Cart Items:', cartItems);
  }, [cartItems]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleQuantityChange = async (cartItemId, change) => {
    // Optimistically update the UI
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );
    });

    try {
      // Perform the mutation
      const { data } = await updateCartItemByCartId({
        variables: { cartItemId, change }
      });

      // Optionally handle the result or update state based on mutation response
      console.log('Mutation Result:', data);
      console.log(data.updateCartItemQuantity.quantity);
      //This is done to load the accurate data fom the table
      if(data.updateCartItemQuantity.quantity<=1)
        navigate(0);
    } catch (error) {
      console.error('Error updating cart item:', error);

      // Revert the optimistic update on error
      setCartItems(prevItems => {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(1, item.quantity - change) }
            : item
        );
      });
    }
  };

  const handleOrder = () => {
    navigate('/order');
    console.log('Hello World');
  };

  return (
    <div className='card-component'>
      <div>
        <h2 style={{ paddingBottom: 60, paddingTop: 20 }}>Cart Items</h2>
        <div className='cart-card'>
          {cartItems.map((item, index) => (
            <div key={item.cartItemId} className='cart-item'>
              <h3 className='cart-heading'>Cart Item - {index + 1}</h3>
              <div className='cart-heading'>
                <img
                  src={item.photoUrl}
                  alt={item.productName}
                  style={{ width: '50%', height: 'auto', borderRadius: '8px', display: 'block', margin: '0 auto' }}
                />
              </div>
              <p>Name: {item.productName}</p>
              <p>Price: ${item.productPrice}</p>
              <div className='quantity-container'>
                <button onClick={() => handleQuantityChange(item.cartItemId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.cartItemId, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='order-button'>
        <button onClick={handleOrder} className='order-button'>Order Now</button>
      </div>
    </div>
  );
};

export default Cart;