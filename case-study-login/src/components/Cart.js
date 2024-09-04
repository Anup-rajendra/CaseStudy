import React, {useEffect, useState }  from 'react';
import "../css/Cart.css";
import { useQuery } from '@apollo/client';
import { GET_CARTDETAILS } from '../Apollo/queries';
import { useNavigate } from 'react-router-dom';
const Cart=()=>{
    const [user,setUser]=useState(1);
    const navigate=useNavigate();
    useEffect(()=>{
        const userId=localStorage.getItem("userData")
        setUser(parseInt(userId, 10));
  },[])
    const userId=user;
    console.log(userId);
    const { loading, error, data } = useQuery(GET_CARTDETAILS, {
        variables: { "userId": userId },
      });
      console.log(userId);
      
      
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;

      const cartItemsArray = data.userById.carts[0].cartItems.map(item => ({
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        photoUrl: item.product.photoUrl
      }));
      const handleOrder=()=>{
            navigate('/order');
            console.log('Hello World');
      }
    return (
    <div className='card-component'>
        <div>
      <h2 style={{paddingBottom:60,paddingTop:20}}>Cart Items</h2>
      <div className='cart-card'>
        {cartItemsArray.map((item, index) => (
         <div className='cart-item'>
            <h3 className='cart-heading'>Cart Item - {index+1}</h3>
            <div className='cart-heading'>
            <img src={item.photoUrl} alt={item.productName} style={{ width: '50%', height: 'auto', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
            </div>
            <p>Name: {item.productName}</p>
            <p>Price: ${item.productPrice}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
    <div className='order-button'>
    <button onClick={handleOrder} className='order-button'>Order Now</button> 
    </div>
    </div>
    );
}
export default Cart;