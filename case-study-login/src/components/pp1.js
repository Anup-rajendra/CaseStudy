import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, UPDATE_PROFILE } from '../Apollo/queries';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    // Fetch user ID from local storage
    const userId = parseInt(localStorage.getItem('userData'), 10);

    const { loading, error, data } = useQuery(GET_USER_PROFILE, {
        variables: { userId },
        onCompleted: (data) => {
            setProfileData({
                username: data.user.username,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                phoneNumber: data.user.phoneNumber,
                address: data.user.address
            });
        }
    });

    const [updateProfile] = useMutation(UPDATE_PROFILE);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await updateProfile({
                variables: {
                    userId,
                    ...profileData
                }
            });
            setIsEditing(false); // Exit edit mode after successful save
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            <div className="profile-info">
                {isEditing ? (
                    <>
                        <div>
                            <label>Username:</label>
                            <input type="text" name="username" value={profileData.username} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>First Name:</label>
                            <input type="text" name="firstName" value={profileData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input type="text" name="lastName" value={profileData.lastName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={profileData.email} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Phone Number:</label>
                            <input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Address:</label>
                            <input type="text" name="address" value={profileData.address} onChange={handleInputChange} />
                        </div>
                        <button onClick={handleSaveClick}>Save</button>
                    </>
                ) : (
                    <>
                        <p>Username: {profileData.username}</p>
                        <p>First Name: {profileData.firstName}</p>
                        <p>Last Name: {profileData.lastName}</p>
                        <p>Email: {profileData.email}</p>
                        <p>Phone Number: {profileData.phoneNumber}</p>
                        <p>Address: {profileData.address}</p>
                        <button onClick={handleEditClick}>Edit Profile</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
