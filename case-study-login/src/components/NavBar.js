import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import DropdownAvatar from './DropdownAvatar';
import { ShoppingCart, Heart } from 'lucide-react';
import CategoryNavigation from './CategoryNavigation';
const NavBar = () => {
  return (
    // animated-background bg-gradient-to-r from-primary via-teal-600 to-blue-400
    <div>
      <div className="flex flex-col fixed w-full z-40">
        <nav className=" z-40 bg-gradient-to-r from-primary to-blue-400 animated-background py-1 border-b ">
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
              <Link to="/order-history" className="text-white text-lg">
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex gap-1 text-white text-lg items-center"
              >
                <ShoppingCart />
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="flex gap-1 text-white text-lg items-center"
              >
                <Heart />
                Wishlist
              </Link>
            </li>
            <li>
              <DropdownAvatar />
            </li>
          </ul>
        </nav>
        <div className="pl-16 border-b-2 z-30 bg-white">
          <CategoryNavigation />
        </div>
      </div>
      <div className="pt-[100px]"></div>
    </div>
  );
};

export default NavBar;
