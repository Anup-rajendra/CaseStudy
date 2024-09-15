import React, { useState, useEffect } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PRODUCTS,
  GET_CART_TABLE,
  CREATE_OR_UPDATE_CART,
  UPDATE_CART_ITEM,
  GET_REVIEWS,
} from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster, toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { ShoppingCart } from 'lucide-react';
import { Star } from 'lucide-react';
const Products = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const Navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const userId = parseInt(localStorage.getItem('userData'), 10);
  const [reviews, setReviews] = useState([]);
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCTS);

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
  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5120/api/WishlistItems/${userId}`
        );
        const likedProductIds = response.data.map((item) => item.productId);
        setLikedProducts(likedProductIds);
      } catch (error) {
        console.error('Failed to fetch liked products:', error);
      }
    };
    fetchLikedProducts();
  }, [userId, likedProducts]);
  // Update products and filter liked products when productsData changes
  useEffect(() => {
    if (productsData) {
      setProducts(productsData.products);
      // Filter liked products to only include those in the current products data
      const validLikedProductIds = likedProducts.filter((id) =>
        productsData.products.some((product) => product.productId === id)
      );
      setLikedProducts(validLikedProductIds);
    }
  }, [productsData]);
  const handleCartSubmit = async (productId, productName) => {
    setSelectedProduct(productId);
    console.log(productId);
    console.log(productName);
    let cartId;

    if (!cartData?.getCartByUserId) {
      // If cart does not exist, create it
      const response = await createOrUpdateCart({ variables: { userId } });
      console.log(response);
      cartId = response.data.createOrUpdateCart.cartId;
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
    }

    // Once you have the cartId, update the cart item
    const res = await updateCartItem({ variables: { cartId, productId } });
    console.log('CartItem Details:', res.data.updateCartItem);
    toast.success(`${productName} has been added to Cart`);
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
  if (productsLoading || reviewLoading) return <p></p>;
  if (productsError || reviewError)
    return <p>Error: {productsError.message}</p>;

  return (
    <div className="h-full">
      <Toaster />
      <div className="text-center text-3xl font-bold pt-8 pb-12">Products</div>
      <div className="grid grid-cols-3 gap-4 px-3">
        {products.map((product, index) => (
          <div key={index}>
            <Link to={`/product`} state={{ product, userId }}>
              <Card className="rounded-none text-primary shadow-md hover:shadow-primary">
                <CardHeader>
                  <CardTitle className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>{product.name}</div>
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLikeClick(product.productId);
                        }}
                      >
                        {likedProducts.includes(product.productId) ? (
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
                        src={product.photoUrl}
                        alt={product.name}
                        style={{
                          width: '200px',
                          height: '250px',
                          borderRadius: '8px',
                          alignContent: 'center',
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-6 ">
                      {
                        <div>
                          {renderStars(getAverageRating(product.productId))}
                        </div>
                      }
                      <div className="pt-4 flex flex-col gap-7">
                        <div className="flex gap-2">
                          <span className="font-bold text-xl">Price: </span>
                          <span className="text-black font-semibold pl-1">
                            Rs.{product.price.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-xl">Category:</span>
                          <span className="text-black font-semibold pl-1">
                            {' '}
                            {product.category.categoryName}
                          </span>
                        </div>
                      </div>
                      {/* <div>
                        <span className="font-bold text-xl">Quantity:</span>{' '}
                        <span className="text-black font-semibold pl-1">
                          {product.inventory.stockQuantity}
                        </span>
                      </div> */}
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
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
