import React, { useState, useEffect } from 'react';
import "../css/AddAddress.css"; // Import the CSS for styling
import { useMutation } from '@apollo/client';
import { ADD_TO_ADDRESS } from '../Apollo/queries';
import { useNavigate } from 'react-router-dom';
const AddAddress = () => {
  const [user, setUser] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const navigate=useNavigate();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [addAddress] = useMutation(ADD_TO_ADDRESS); // Updated variable name

  useEffect(() => {
    const userId = localStorage.getItem("userData");
    if (userId) {
      setUser(parseInt(userId, 10));
    }
  }, []);

  // Function to get user's location and reverse geocode
  const fetchLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true); // Set fetching state to true
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          const { address } = data;
          
          // Update the state with the obtained address details
          setAddress({
            street: address.road || '',
            city: address.city || address.town || '',
            state: address.state || '',
            zipCode: address.postcode || ''
          });
        } catch (error) {
          console.error('Error fetching location:', error);
        } finally {
          setIsFetchingLocation(false); // Reset fetching state
        }
      }, (error) => {
        console.error('Error getting location:', error);
        setIsFetchingLocation(false); // Reset fetching state in case of error
      },
      {
        enableHighAccuracy: false, // Request high accuracy
        timeout: 50000,            // Set a timeout (in milliseconds)
        maximumAge: 0             // Disable cached location
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addAddress({
        variables: {
          userId: user, // Match variable name from the GraphQL mutation
          city: address.city,
          state: address.state,
          street: address.street,
          zipcode: address.zipCode // Match variable name from the GraphQL mutation
        }
      });
      console.log('Address added:', response.data.addToAddress);
    } catch (error) {
      console.error('Error adding address:', error);
    }
    navigate('/ChangeAddress');
  };

  return (
    <div className="add-address-container">
      <h2>Add a New Address</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Street:
            <input 
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
            <input 
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
            <input 
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
            <input 
              type="text" 
              name="zipCode" 
              value={address.zipCode}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button 
          type="button" 
          onClick={fetchLocation}
          disabled={isFetchingLocation} // Disable button while fetching
        >
          {isFetchingLocation ? 'Fetching Location...' : 'Use Location'}
        </button>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AddAddress;
