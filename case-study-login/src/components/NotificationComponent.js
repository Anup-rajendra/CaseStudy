import React from 'react';
import '../css/NotificationComponent.css'; // Assuming you will add styles in a separate CSS file

const NotificationComponent = ({ notification }) => {
    // Directly use the passed-in prop `notification` instead of setting local state
    if (notification.length !== 0) {
        return (
            <div className="notification-container">
                <h1 className="notification-title">Check Out the Latest Products!</h1>
                {notification.map((notification, index) => (
                    <div key={index} className="notification-card">
                        <h3 className="notification-name">{notification.name}</h3>
                        <img 
                            className="notification-image" 
                            src={notification.photoUrl} 
                            alt={notification.name} 
                            width={150} 
                            height={150} 
                        />
                        <p className="notification-price">Price: ${notification.price}</p>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div>No new notifications</div>
        );
    }
};

export default NotificationComponent;
