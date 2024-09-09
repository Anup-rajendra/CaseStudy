import React, { useEffect, useState } from 'react';
import "../css/Orders.css";
import { useQuery ,useMutation} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ADDRESS_BY_USERID,REMOVE_ADDRESS } from '../Apollo/queries';

const ChangeAddress = () => {
  const [user, setUser] = useState(1);
  const navigate = useNavigate();

  const [removeAddress] = useMutation(REMOVE_ADDRESS);
  
  useEffect(() => {
    const userId = localStorage.getItem("userData");
    if (userId) {
      setUser(parseInt(userId, 10));
    }
  }, ); // Add empty dependency array to ensure this effect runs only once on mount

  const AddressList = ({ userId }) => {
    const { loading, error, data } = useQuery(GET_ADDRESS_BY_USERID, {
      variables: { userId }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (data.addressesByUserId.length === 0) {
      return (
        <div>
          <button 
          className="add-new-address-button"
          onClick={handleAddNewAddress}
        >
          Add New Address
        </button>
        </div>
      );

    }

    return (
      <div className="address-container">
        <h2>Shipping Addresses</h2>
        {data.addressesByUserId.map((address, index) => (
          <div key={index} className="address-item">
            <p>Street: {address.street}</p>
            <p>City: {address.city}, State: {address.state}, ZipCode: {address.zipCode}</p>
            <button 
              className="select-address-button"
              onClick={() => handleAddressSelect(index)}
            >
              Select Address
            </button>
            <button onClick={()=>RemoveAddress(address.addressId)}>
              RemoveAddress
            </button>
          </div>
        ))}
        <button 
          className="add-new-address-button"
          onClick={handleAddNewAddress}
        >
          Add New Address
        </button>
      </div>
    );
  };

  const handleAddressSelect = (addressIndex) => {
    console.log('Selected Address Index:', addressIndex);
    localStorage.setItem('addressnumber', addressIndex);
    navigate('/order');
  };

  const RemoveAddress = async (addressId) => {
    try {
      await removeAddress({ variables: { addressId } });
      alert('Address removed successfully');
    } catch (error) {
      alert('Error removing address');
    }
  };
  

  const handleAddNewAddress = () => {
    navigate('/add-address'); // Navigate to the page where the user can add a new address
    
  };

  return (
    <div className="order-container">
      <AddressList userId={user} />
    </div>
  );
};

export default ChangeAddress;