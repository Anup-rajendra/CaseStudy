import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, UPDATE_PROFILE } from '../Apollo/queries'; // Ensure this path is correct
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const userId = 1; // Set user ID dynamically based on login

  // Fetch the user profile using the GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (data) {
      const user = data.userById;
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching profile data.</p>;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateProfile({
        variables: {
          userId,
          firstName: formData.firstname,
          lastName: formData.lastname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        },
      });
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-field">
        <label>Username:</label>
        <span>{data?.userById?.username}</span>
      </div>
      <div className="profile-field">
        <label>First Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
          />
        ) : (
          <span>{formData.firstname}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Last Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
          />
        ) : (
          <span>{formData.lastname}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        ) : (
          <span>{formData.email}</span>
        )}
      </div>
      <div className="profile-field">
        <label>Phone Number:</label>
        {isEditing ? (
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        ) : (
          <span>{formData.phoneNumber}</span>
        )}
      </div>
      
      {isEditing ? (
        <button onClick={handleSaveClick}>Save</button>
      ) : (
        <button onClick={handleEditClick}>Edit Profile</button>
      )}
    </div>
  );
};

export default ProfilePage;
