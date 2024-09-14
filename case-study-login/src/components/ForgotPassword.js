// ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    console.log('ForgotPassword Component Rendered');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5297/api/SignInApi/forgot-password', { Email: email });
            console.log(response.data); // Debug response
            alert('OTP sent to your email');
            navigate('/verify-otp', { state: { email } }); // Ensure this path is correct
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage('Failed to send OTP. Please try again.');
        }
    };
    

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit">Send OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
