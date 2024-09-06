import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import DropdownAvatar from './DropdownAvatar';
import { ShoppingCart } from 'lucide-react';
import CategoryNavigation from './CategoryNavigation';
const NavBar = () => {

    return (
        // animated-background bg-gradient-to-r from-primary via-teal-600 to-blue-400
        <div className='flex flex-col'>
        <nav className='bg-gradient-to-r from-primary to-blue-400 animated-background py-1 border-b'>
            <ul className='flex items-center place-content-around p-0 m-0 list-none'>
                 <li>
                 <Link to="/products"><img alt="logo" src="/impact.png" width={50} height={50}/></Link>
                 </li>
                 <li><SearchBar/></li>
                   
                <li>
                    <Link to="/orders" className='text-white text-lg'>Orders</Link>
                </li>   
                <li>
                    <Link to="/cart" className='flex gap-1 text-white text-lg items-center'><ShoppingCart/>Cart</Link>
                </li>
                <li><DropdownAvatar/></li>
            </ul>
        </nav>
        <div className='pl-16 border-b'>
        <CategoryNavigation/>
        </div>
        </div>
    );
};

 
 

export default NavBar;
