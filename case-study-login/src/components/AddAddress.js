import React, { useState, useEffect } from 'react';
import '../css/AddAddress.css';
import { useMutation } from '@apollo/client';
import { ADD_TO_ADDRESS } from '../Apollo/queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
const AddAddress = ({ isOpen, onClose, refetchAddresses }) => {
  const [user, setUser] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [addAddress] = useMutation(ADD_TO_ADDRESS);

  useEffect(() => {
    const userId = localStorage.getItem('userData');
    if (userId) {
      setUser(parseInt(userId, 10));
    }
  }, []);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const { address } = data;

            setAddress({
              street: address.road || '',
              city: address.city || address.town || '',
              state: address.state || '',
              zipCode: address.postcode || '',
            });
          } catch (error) {
            console.error('Error fetching location:', error);
          } finally {
            setIsFetchingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsFetchingLocation(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 50000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('userId', user, 'Address', address);
    try {
      const response = await addAddress({
        variables: {
          userId: user,
          city: address.city,
          state: address.state,
          street: address.street,
          zipcode: address.zipCode,
        },
      });

      console.log('Address added:', response.data.addToAddress);
      refetchAddresses();
      onClose(); // Close the dialog after successful submission
      // navigate('/ChangeAddress');
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]  ">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold pb-2 text-xl">
            Add a New Address
          </DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group ">
              <label>
                Street:
                <Input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                City:
                <Input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                State:
                <Input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Zip Code:
                <Input
                  type="text"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={fetchLocation}
                disabled={isFetchingLocation}
                className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300"
              >
                {isFetchingLocation ? 'Fetching Location...' : 'Use Location'}
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300"
              >
                Add Address
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddress;
