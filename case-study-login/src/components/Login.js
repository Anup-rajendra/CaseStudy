import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
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
const response = await axios.post('http://localhost:5185/api/RetailAPI/authenticate', { Username:username, Password:password },{
    headers: {
        'Content-Type': 'application/json'
    }
});
const token = response.data.token;
console.log(response);
// Store the JWT token in local storage or a context
localStorage.setItem('token', token);
// Redirect to the Products page
navigate('/products');
} catch (error) {
setError('Invalid username or password');
}
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
</div>
);
};
export default Login;