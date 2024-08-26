import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
        }
    }, []);

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

            localStorage.removeItem('username');
            localStorage.removeItem('password');
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
