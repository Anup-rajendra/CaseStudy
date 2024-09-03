import React  from 'react';
import '../css/Orders.css'
import { useQuery } from '@apollo/client';
import { GET_DETAILS_FOR_ORDERS } from '../Apollo/queries';
import Address from './Address';
const Order = () => {
 
  const userId=parseInt(localStorage.getItem("userData"),10);
   
    const { loading, error, data } = useQuery(GET_DETAILS_FOR_ORDERS, {
      variables: { "userId": 1},
    });
    console.log(userId);
    console.log(data);
    if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;
if (!data || !data.userById || !data.userById.carts.length) return <p>No data available</p>;
     
    const orderItemsArray = data.userById.carts[0].cartItems.map(item => ({
      productName: item.product.name,
      productPrice: item.product.price,
      quantity: item.quantity,
      price: item.product.price*item.quantity
    }));
    const AddressArray=data.userById.addresses.map(address=>({
      Address:`${address.street +' '+ address.city +' '+ address.state +' '+ address.zipCode}`
    }));
    console.log(AddressArray.Address)
  return (
    <div>
         <div className='cart-card'>
          {AddressArray &&
        <Address addressArray={AddressArray}/>}
          {orderItemsArray.map((item, index) => (
          <div className='cart-item'>
              <h3 className='cart-heading'>Cart Item - {index+1}</h3>
              <p>Name: {item.productName}</p>
              <p>Price: ${item.productPrice}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price}</p>
              
            </div>
          ))}
      </div>
      <section className="h-100 h-custom" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-8 col-xl-6">
            <div
              className="card border-top border-bottom border-3"
              style={{ borderColor: '#f37a27 !important' }}
            >
              <div className="card-body p-5">
                <p className="lead fw-bold mb-5" style={{ color: '#f37a27' }}>
                  Purchase Receipt
                </p>

                <div className="row">
                  <div className="col mb-3">
                    <p className="small text-muted mb-1">Date</p>
                    <p>10 April 2021</p>
                  </div>
                  <div className="col mb-3">
                    <p className="small text-muted mb-1">Order No.</p>
                    <p>012j1gvs356c</p>
                  </div>
                </div>

                <div
                  className="mx-n5 px-5 py-4"
                  style={{ backgroundColor: '#f2f2f2' }}
                >
                  <div className="row">
                    <div className="col-md-8 col-lg-9">
                      <p>BEATS Solo 3 Wireless Headphones</p>
                    </div>
                    <div className="col-md-4 col-lg-3">
                      <p>£299.99</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8 col-lg-9">
                      <p className="mb-0">Shipping</p>
                    </div>
                    <div className="col-md-4 col-lg-3">
                      <p className="mb-0">£33.00</p>
                    </div>
                  </div>
                </div>

                <div className="row my-4">
                  <div className="col-md-4 offset-md-8 col-lg-3 offset-lg-9">
                    <p
                      className="lead fw-bold mb-0"
                      style={{ color: '#f37a27' }}
                    >
                      £262.99
                    </p>
                  </div>
                </div>

                <p className="lead fw-bold mb-4 pb-2" style={{ color: '#f37a27' }}>
                  Tracking Order
                </p>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="horizontal-timeline">
                      <ul className="list-inline items d-flex justify-content-between">
                        <li className="list-inline-item items-list">
                          <p
                            className="py-1 px-2 rounded text-white"
                            style={{ backgroundColor: '#f37a27' }}
                          >
                            Ordered
                          </p>
                        </li>
                        <li className="list-inline-item items-list">
                          <p
                            className="py-1 px-2 rounded text-white"
                            style={{ backgroundColor: '#f37a27' }}
                          >
                            Shipped
                          </p>
                        </li>
                        <li className="list-inline-item items-list">
                          <p
                            className="py-1 px-2 rounded text-white"
                            style={{ backgroundColor: '#f37a27' }}
                          >
                            On the way
                          </p>
                        </li>
                        <li
                          className="list-inline-item items-list text-end"
                          style={{ marginRight: '8px' }}
                        >
                          <p style={{ marginRight: '-8px' }}>Delivered</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-4 pt-2 mb-0">
                  Want any help?{' '}
                  <a href="#!" style={{ color: '#f37a27' }}>
                    Please contact us
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Order;
