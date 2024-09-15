import React from 'react';
import { CreditCard, LogOut, User, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';

const DropdownAvatar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleProfile = () => {
    navigate('/profile');
  };
  const handleCustomer = () => {
    navigate('/customer-support');
  };
  const handleOrder = () => {
    navigate('/order-history');
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button size="avatar">
          <UserAvatar />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOrder}>
            <button className="flex">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCustomer}>
            <button className="flex">
              <LifeBuoy className="mr-2 h-4 w-4" />
              <div>Customer Support</div>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <button className="flex">
            <LogOut className="mr-2 h-4 w-4" />
            <div>Log out</div>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownAvatar;
