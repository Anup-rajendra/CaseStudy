import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link to="/products" style={styles.navLink}>Products</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/cart" style={styles.navLink}>Cart</Link>
                </li>
                <li style={styles.navItem}>
                    <button onClick={handleLogout} style={styles.navLinkButton}>Logout</button>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#333',
        padding: '10px',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'space-around',
        margin: 0,
        padding: 0,
    },
    navItem: {
        display: 'inline',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
    },
    navLinkButton: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
      // Optional: makes it look like a link
    },
};

export default NavBar;
