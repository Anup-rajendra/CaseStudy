import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import DropdownAvatar from './DropdownAvatar';
import { ShoppingCart, Heart, Bell } from 'lucide-react';
import CategoryNavigation from './CategoryNavigation';
import SheetDemo from './SheetDemo';
import { Button } from './ui/button';
import { BellPlus } from 'lucide-react';
import axios from 'axios';

const NavBar = () => {
  const [notification, setNotifications] = useState([]);
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userid = parseInt(localStorage.getItem('userData')); // Retrieve userid from localStorage
      if (!userid) return;
      
      try {
        // Updated to use GET method
        const response = await axios.get(`http://localhost:5071/api/Notifications/${userid}`);
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error); 
      }
    };

    fetchNotifications();

    // WebSocket for notifications
    const ws = new WebSocket('ws://localhost:8081');
    ws.onmessage = (event) => {
      const product = JSON.parse(event.data);
      setNotifications((prev) => [...prev, product]);
    };
    
    // Cleanup WebSocket connection
    return () => ws.close();
  }, []);

  const handleNotificationClick = () => {
    setIsOpen(true);
  };

  const handleCloseSheet = () => {
    setIsOpen(false);
    setNotifications([]); // Clear notifications when closing the sheet
  };

  return (
    <div>
      <div className="flex flex-col fixed w-full">
        <nav className="z-40 bg-gradient-to-r from-primary to-blue-400 animated-background py-1 border-b">
          <ul className="flex items-center place-content-around p-0 m-0 list-none">
            <li>
              <Link to="/products">
                <img alt="logo" src="/impact.png" width={50} height={50} />
              </Link>
            </li>
            <li className="absolute top-[6px] z-50 left-52">
              <SearchBar />
            </li>
            <li className="w-[450px]"></li>
            <li>
              <Link to="/orders" className="text-white text-lg">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex gap-1 text-white text-lg items-center">
                <ShoppingCart />
                Cart
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="flex gap-1 text-white text-lg items-center">
                <Heart />
                Wishlist
              </Link>
            </li>
            <li>
              <Button
                onClick={handleNotificationClick}
                variant="ghost"
                className="text-white text-md hover:bg-transparent focus:outline-none !important"
              >
                {notification.length > 0 ? (
                  <BellPlus className="text-red-600" /> // Display red bell when there are notifications
                ) : (
                  <Bell className="text-white" /> // Display normal bell when there are no notifications
                )}
              </Button>
            </li>
            <SheetDemo
              isOpen={isOpen}
              onClose={handleCloseSheet}
              notification={notification}
            />
            <li>
              <DropdownAvatar />
            </li>
          </ul>
        </nav>
        <div className="pl-16 border-b-2 z-10 bg-white">
          <CategoryNavigation />
        </div>
      </div>
      <div className="pt-[100px]"></div>
    </div>
  );
};

const script = document.createElement('script');
script.src = 'https://widget.lovi.ai/lovi-widget.min.js';
script.setAttribute('lovi-id', 'WUjtGg0aasNdWeK1bswgu5xMIRC2');
script.async = true;
document.body.appendChild(script);

export default NavBar;
