import React, { useState } from 'react';
import '../css/Products.css'; // Ensure this file contains styles for the card and button
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CART_TABLE,
  CREATE_OR_UPDATE_CART,
  UPDATE_CART_ITEM,
} from '../Apollo/queries';
import { Toaster, toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'; // Ensure these components are correctly imported
import { Button } from './ui/button'; // Ensure this is correctly imported
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
const SearchedProducts = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [likedProducts, setLikedProducts] = useState([]);
  const { suggestions, product } = location.state || {};
  const [selectedProduct, setSelectedProduct] = useState(null);
  const userId = parseInt(localStorage.getItem('userData'), 10);
  // const navigate = useNavigate();

  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId },
  });

  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

  const handleCartSubmit = async (productId, productName) => {
    setSelectedProduct(productId);
    let cartId;

    if (!cartData?.getCartByUserId) {
      const response = await createOrUpdateCart({ variables: { userId } });
      cartId = response.data.createOrUpdateCart.cartId;
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
    }

    const res = await updateCartItem({ variables: { cartId, productId } });
    toast.success(`${productName} has been added to Cart`);
    console.log(res);
    setSelectedProduct(null);
  };
  const handleLikeClick = async (productId) => {
    try {
      if (likedProducts.includes(productId)) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5120/api/WishlistItems?wishlistid=${userId}&productid=${productId}`
        );
        setLikedProducts((prev) => prev.filter((id) => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(`http://localhost:5120/api/WishlistItems`, {
          wishlistId: userId,
          productId,
        });
        setLikedProducts((prev) => [...prev, productId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Like/Unlike Error:', error); // Log error for debugging
    }
  };
  const handleBuyNow = (productId, productName, productPrice, photoURL) => {
    const data = {
      productId: productId,
      productName: productName,
      productPrice: productPrice,
      photoURL: photoURL,
    };
    Navigate('/OrderItem', { state: data });
  };
  return (
    <div className="h-full">
      <Toaster />
      <div className="text-center text-3xl font-bold pt-8 pb-12">Products</div>
      <div className="grid grid-cols-3 gap-4 px-3">
        {(suggestions || [product]).map((prod) => (
          <div key={prod.id}>
            <Card className="rounded-none text-primary shadow-md hover:shadow-primary">
              <CardHeader>
                <CardTitle className="border-b pb-4">
                  <div className="flex justify-between">
                    <div>{prod.name}</div>
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLikeClick(prod.productId);
                      }}
                    >
                      {likedProducts.includes(prod.productId) ? (
                        <AiFillHeart size={24} className="text-red-500" />
                      ) : (
                        <AiOutlineHeart size={24} className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="flex flex-col gap-2 relative">
                    <img
                      src={prod.photoUrl}
                      alt={prod.name}
                      style={{
                        width: '200px',
                        height: '250px',
                        borderRadius: '8px',
                        alignContent: 'center',
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-6 justify-center">
                    <div>
                      <span className="font-bold text-xl">Price: </span>
                      <span className="text-black font-semibold pl-1">
                        Rs.{prod.price.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-xl">Category:</span>
                      <span className="text-black font-semibold pl-1">
                        {' '}
                        {prod.category.categoryName}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-xl">Quantity:</span>{' '}
                      <span className="text-black font-semibold pl-1">
                        {prod.inventory.stockQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent link navigation
                      handleCartSubmit(product.productId, product.name);
                    }}
                    className="transition ease-in-out delay-150 hover:-translate-y-1 flex items-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </Button>
                </div>
                <div className="w-full">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent link navigation
                      handleBuyNow(
                        product.productId,
                        product.name,
                        product.price,
                        product.photoUrl
                      );
                    }}
                    className="bg-gradient-to-r from-primary to-blue-400 animated-background w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300"
                  >
                    Buy Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchedProducts;
