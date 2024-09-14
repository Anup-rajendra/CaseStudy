import React, { useEffect, useState, useCallback } from 'react';
import '../css/Orders.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ADDRESS_BY_USERID, REMOVE_ADDRESS } from '../Apollo/queries';
import AddAddress from './AddAddress';
import { Button } from './ui/button';
import { Toaster, toast } from 'sonner';
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
      toast.info('Address removed successfully. Please select an address');
    } catch (error) {
      alert('Error removing address');
    }
  };

  return (
    <div className="order-container">
      <Toaster />
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
    <>
      <div className="font-bold text-xl pb-3">Shipping Addresses</div>
      {addresses.length === 0 ? (
        <Button
          className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300"
          onClick={onAddNewAddress}
        >
          Add New Address
        </Button>
      ) : (
        addresses.map((address, index) => (
          <div
            className="flex gap-4 w-full bg-white transition ease-in-out delay-150 hover:translate-y-1 hover:scale-105 duration-300"
            key={address.addressId}
          >
            <div
              key={address.addressId}
              className="border flex justify-between p-2 gap-4 cursor-pointer w-full"
              onClick={() => onAddressSelect(index)}
            >
              <div className="pl-1 ">
                <div>{index + 1}.</div>
                <p>Street: {address.street}</p>
                <p>
                  City: {address.city}, State: {address.state}, ZipCode:{' '}
                  {address.zipCode}
                </p>
              </div>
              <div className="flex items-center">
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent address selection when remove button is clicked
                    onRemoveAddress(address.addressId); // Call the remove function
                  }}
                  variant="destructive"
                  className="pr-2 pb-2"
                >
                  Remove Address
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
      <div className="pt-3">
        <Button
          className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300"
          onClick={onAddNewAddress}
        >
          Add New Address
        </Button>
      </div>
    </>
  );
};

export default ChangeAddress;
