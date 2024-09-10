import React, { useEffect, useState, useCallback } from 'react';
import '../css/Orders.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ADDRESS_BY_USERID, REMOVE_ADDRESS } from '../Apollo/queries';
import AddAddress from './AddAddress';
const ChangeAddress = ({ onChangeAddress, onAddressSelect }) => {
  const [user, setUser] = useState(null);
  const [removeAddress] = useMutation(REMOVE_ADDRESS);
  const [dialog, setDialog] = useState(false);

  // Fetch user data from localStorage when component mounts
  useEffect(() => {
    const userId = localStorage.getItem('userData');
    if (userId) setUser(parseInt(userId, 10));
  }, [dialog]); // Only run once on component mount

  const { refetch } = useQuery(GET_ADDRESS_BY_USERID, {
    variables: { userId: user },
  });
  // Callback for adding a new address
  const handleAddNewAddress = useCallback(() => {
    refetch();
    setDialog(true); // Navigate to the add new address page
  }, []);

  // Callback for selecting an address
  const handleAddressSelect = useCallback(
    (addressIndex) => {
      localStorage.setItem('addressnumber', addressIndex);
      onAddressSelect(addressIndex);
      onChangeAddress(false); // Navigate to the orders page after selecting address
    },
    [onChangeAddress, onAddressSelect]
  );

  // Function to remove an address
  const handleRemoveAddress = async (addressId) => {
    try {
      await removeAddress({ variables: { addressId } });
      refetch();
      alert('Address removed successfully');
    } catch (error) {
      alert('Error removing address');
    }
  };

  return (
    <div className="order-container">
      {user ? (
        <>
          <AddressList
            userId={user}
            onAddNewAddress={handleAddNewAddress}
            onAddressSelect={handleAddressSelect}
            onRemoveAddress={handleRemoveAddress}
          />
          <AddAddress
            isOpen={dialog}
            onClose={() => setDialog(false)}
            refetchAddresses={refetch} // Pass refetch to AddAddress
          />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

// Extracted AddressList component to make it more reusable
const AddressList = ({
  userId,
  onAddNewAddress,
  onAddressSelect,
  onRemoveAddress,
}) => {
  const { loading, error, data, refetch } = useQuery(GET_ADDRESS_BY_USERID, {
    variables: { userId },
  });

  useEffect(() => {
    refetch();
  }, [onAddNewAddress]); // Refetch addresses when a new one is added

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const addresses = data?.addressesByUserId || [];
  return (
    <div className="address-container">
      <h2>Shipping Addresses</h2>
      {addresses.length === 0 ? (
        <button className="add-new-address-button" onClick={onAddNewAddress}>
          Add New Address
        </button>
      ) : (
        addresses.map((address, index) => (
          <div key={address.addressId} className="address-item">
            <p>Street: {address.street}</p>
            <p>
              City: {address.city}, State: {address.state}, ZipCode:{' '}
              {address.zipCode}
            </p>
            <button
              className="select-address-button"
              onClick={() => onAddressSelect(index)}
            >
              Select Address
            </button>
            <button
              className="remove-address-button"
              onClick={() => onRemoveAddress(address.addressId)}
            >
              Remove Address
            </button>
          </div>
        ))
      )}
      <button className="add-new-address-button" onClick={onAddNewAddress}>
        Add New Address
      </button>
    </div>
  );
};

export default ChangeAddress;
