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
                <div style={styles.navLeftItems}>
                    <li style={styles.navItem}>
                        <Link to="/products" style={styles.navLink}>Products</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/cart" style={styles.navLink}>Cart</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/order" style={styles.navLink}>Orders</Link>
                    </li>
                    <li style={styles.navItem}>
                        <button onClick={handleLogout} style={styles.navLinkButton}>Logout</button>
                    </li>
                </div>
                <div style={styles.navRightItem}>
                    <li style={styles.navItem}>
                        <Link to="/profile" style={styles.navLink}>Profile</Link>
                    </li>
                </div>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        padding: 0,
    },
    navLeftItems: {
        display: 'flex',
        alignItems: 'center',
    },
    navRightItem: {
        marginLeft: 'auto',
    },
    navItem: {
        margin: '0 10px',
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
    },
};

export default NavBar;
