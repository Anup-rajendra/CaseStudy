import React, { useState, useEffect } from 'react';
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
import { Star } from 'lucide-react';
import { GET_REVIEWS } from '../Apollo/queries';
const SearchedProducts = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [likedProducts, setLikedProducts] = useState([]);
  const { suggestions, product } = location.state || {};
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const userId = parseInt(localStorage.getItem('userData'), 10);
  // const navigate = useNavigate();
  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
  } = useQuery(GET_REVIEWS);
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId },
  });
  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  useEffect(() => {
    if (reviewData) {
      setReviews(reviewData.reviews);
    }
  }, [reviewData]);
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
          `http://localhost:5170/gateway/WishlistItems?wishlistid=${userId}&productid=${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token to headers
            },
          }
        );
        setLikedProducts((prev) => prev.filter((id) => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(`http://localhost:5170/gateway/WishlistItems`, {
          wishlistId: userId,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach JWT token to headers
          },
        }
      );
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
  const getAverageRating = (productId) => {
    const productReviews = reviews.filter(
      (review) => review.productId === productId
    );
    const totalRatings = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return productReviews.length
      ? (totalRatings / productReviews.length).toFixed(1)
      : 0;
  };
  const renderStars = (averageRating) => {
    const totalStars = 5; // Assume maximum rating is 5 stars
    const fullStars = Math.floor(averageRating); // Full stars
    const hasHalfStar = averageRating % 1 !== 0; // Check if there's a half star
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0); // Calculate empty stars
    // Ensure no negative star values
    if (fullStars < 0 || emptyStars < 0 || totalStars < 0) {
      console.error('Invalid star calculation', {
        fullStars,
        emptyStars,
        totalStars,
      });
      return null;
    }
    return (
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <Star
            key={`full-${index}`}
            className="text-primary"
            fill="currentColor"
            size={20}
          />
        ))}
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="text-gray-300" size={20} />
            <Star
              className="text-primary absolute top-0 left-0 fill-primary"
              style={{ clipPath: 'inset(0 50% 0 0)' }} // Clip the yellow star to show half
              size={20}
            />
          </div>
        )}
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <Star key={`empty-${index}`} className="text-gray-300" size={20} />
        ))}
      </div>
    );
  };
  if (reviewLoading) return <p></p>;
  if (reviewError) return <p>Error: {reviewError.message}</p>;
  console.log(suggestions, product);
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
                  <div className="flex flex-col gap-6 ">
                    {<div>{renderStars(getAverageRating(prod.productId))}</div>}
                    <div className="pt-4 flex flex-col gap-7">
                      <div className="flex gap-2">
                        <span className="font-bold text-xl">Price: </span>
                        <span className="text-black font-semibold pl-1">
                          {/* Rs.{product.price.toFixed(2)} */}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-xl">Category:</span>
                        <span className="text-black font-semibold pl-1">
                          {' '}
                          {prod.category.categoryName}
                        </span>
                      </div>
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
                      handleCartSubmit(prod.productId, prod.name);
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
                        prod.productId,
                        prod.name,
                        prod.price,
                        prod.photoUrl
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