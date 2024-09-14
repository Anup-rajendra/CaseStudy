// ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { email, otp } = location.state || {};

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match.');
            return;
        }
    
        // Log the data being sent
        console.log({
            Email: email,
            Otp: otp,
            NewPassword: newPassword
        });
    
        try {
            const response = await axios.post('http://localhost:5297/api/SignInApi/reset-password', {
                Email: email,
                Otp: otp,
                NewPassword: newPassword
            },{
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                setMessage('Password reset successfully.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Redirect to login after 2 seconds
            } else {
                setMessage('Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error.response?.data || error.message);
            setMessage(`Failed to reset password. ${error.response?.data?.message || error.message}`);
        }
    };
    

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
