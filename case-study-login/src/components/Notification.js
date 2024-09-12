import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const userid = parseInt(localStorage.getItem('userData')); // Retrieve userid from localStorage

            if (!userid) {
                setError('User ID not found in localStorage');
                setIsLoading(false);
                return;
            }

            try {
                // Updated to use GET method
                const response = await axios.get(`http://localhost:5071/api/Notifications/${userid}`);
                console.log(response.data);
                setNotifications(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('Error fetching notifications');
                setIsLoading(false);
            }
        };

        fetchNotifications();

        const ws = new WebSocket('ws://localhost:8081');

        ws.onmessage = (event) => {
            const product = JSON.parse(event.data);
            console.log(product);
            setNotifications(prev => [...prev, product]);
        };

        return () => ws.close();
    }, []);

    if (isLoading) {
        return <div>Loading notifications...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {notifications.map((notification, index) => (
                <div key={index} className="notification">
                    <h1>HEYY! You Can Buy the Latest Product Now!!</h1>
                    <h3>{notification.name}</h3>
                    <img src={notification.photoUrl} alt={notification.Name} width={100} height={100} />
                    <p>Price: ${notification.price}</p>
                </div>
            ))}
        </div>
    );
};

export default NotificationComponent;
