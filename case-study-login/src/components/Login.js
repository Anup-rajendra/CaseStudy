import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
 

const Login = () => {
    const { user,login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending request:', {
                Username: username,
                Password: password
            });
            const response = await axios.post('http://localhost:5185/api/RetailAPI/authenticate', 
                { Username: username, Password: password }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            const token = response.data.token;
            console.log(response);

            // Store the JWT token in local storage
            localStorage.setItem('token', token);
 
           // http://localhost:5185/api/RetailAPI/john_doe/Password123
            const getUserDetails= await axios.get(`http://localhost:5185/api/RetailAPI/${username}/${password}`)
            console.log(getUserDetails);
            const userData = {
                UserId: getUserDetails.data,  // Adjust the property name as per your API response
             
                // Add more properties if needed
            };
            console.log(userData,userData.UserId)
            login(userData.UserId);
           console.log("Context:",user);

            // Redirect to the Products page
            navigate('/products');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid username or password');
        }
    };

    const handleSignUpRedirect = () => {
        navigate('/signing');
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                <button type="button" onClick={handleSignUpRedirect}>
                    Don't Have An Account?
                </button>
            </div>
        </div>
    );
};

export default Login;
