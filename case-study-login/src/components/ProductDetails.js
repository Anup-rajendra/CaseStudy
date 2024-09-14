import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CART_TABLE,
  CREATE_OR_UPDATE_CART,
  UPDATE_CART_ITEM,
} from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster, toast } from 'sonner';
import AddReview from './AddReview';
import axios from 'axios';
import '../css/ProductDetails.css';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
const ReviewWord = {
  1: 'Bad',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};
const ProductDetails = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const userId = parseInt(localStorage.getItem('userData'), 10);
  const [open, setOpen] = useState(false);

  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId },
  });

  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5064/api/Reviews/${product.productId}`
      );
      const fetchedReviews = response.data.$values;

      setReviews(fetchedReviews);

      if (fetchedReviews.length > 0) {
        const len = fetchedReviews.length;
        const totalRating = fetchedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating = totalRating / fetchedReviews.length;
        setTotalReviews(len);
        setAverageRating(avgRating);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews', error);
      alert('Failed to fetch reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.productId]);
  const handleAddToCart = async (productId, productName) => {
    setSelectedProduct(productId);
    let cartId;
    if (!cartData?.getCartByUserId) {
      const response = await createOrUpdateCart({ variables: { userId } });
      cartId = response.data.createOrUpdateCart.cartId;
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
    }
    await updateCartItem({ variables: { cartId, productId } });
    toast.success(`${productName} has been added to Cart`);
    setSelectedProduct(null);
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

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, index) => (
          <Star
            key={`full-${index}`}
            className="text-primary"
            fill="currentColor"
            size={24}
          />
        ))}
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="text-gray-300" size={24} />
            <Star
              className="text-primary absolute top-0 left-0 fill-primary"
              style={{ clipPath: 'inset(0 50% 0 0)' }} // Clip the yellow star to show half
              size={24}
            />
          </div>
        )}
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <Star key={`empty-${index}`} className="text-gray-300" size={24} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-end pr-20 pt-10 ">
      <div className="fixed left-24 top-[140px] bg-transparent bg-white border rounded-lg  ">
        <div className="border-b p-3">
          <img
            src={product.photoUrl}
            alt="Product"
            className="w-[416px] h-[416px]"
          />
        </div>
        <div className="flex gap-2 p-4">
          <Button
            onClick={() => handleAddToCart(product.productId, product.name)}
            className="flex-1  flex items-center gap-2 h-14 text-primary transition ease-in-out delay-150 hover:-translate-y-1"
            variant="outline"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </Button>
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
            className=" flex-1 h-14 bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300"
          >
            Buy Now
          </Button>
        </div>
      </div>
      <div className="bg-white w-[800px] flex-1"></div>
      <div className="flex flex-col w-[800px] p-5 rounded-sm bg-white gap-4">
        <Toaster />
        <div className="flex flex-col gap-2 border p-4 rounded-md">
          <div className="font-bold text-3xl border-b pb-4">
            <div className="flex">{product.name}</div>
            <Badge className="bg-primary">
              <div className="pr-1">{averageRating.toFixed(1)}</div>
              <Star size={14} />
            </Badge>
          </div>
          <div className="font-extrabold text-2xl pb-2">${product.price}</div>
          <div className="flex gap-2">
            <div className="font-semibold">Category: </div>
            <div>{product.category.categoryName}</div>
          </div>
          <div className="flex gap-2 flex-wrap pb-8">
            <div className="font-semibold">Description: </div>
            <div>{product.description}</div>
          </div>
        </div>
        {isLoading ? (
          <p className="loading">Loading reviews...</p>
        ) : (
          <div className="border rounded-sm p-4">
            <div className="font-bold text-3xl border-b pb-3">
              Ratings and Reviews
            </div>
            <div className="pt-3 font-medium border-b pb-4 flex items-left gap-2 flex-col">
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <div>{renderStars(averageRating)}</div>
                  <div className="font-semibold text-3xl ">
                    {averageRating.toFixed(1)} out of 5
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add Review
                </Button>

                <AddReview
                  product={product}
                  open={open}
                  onClose={() => {
                    setOpen(false);
                  }}
                  onReviewAdded={fetchReviews}
                />
              </div>
              {totalReviews == 0 ? (
                <></>
              ) : (
                <div>{totalReviews} Ratings & Reviews</div>
              )}
            </div>
            <div className="flex flex-col">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="border-b flex flex-col pb-2">
                    <div className="font-medium pt-3">{review.username}</div>
                    <div className="flex items-center gap-3 pt-3">
                      <Badge className="bg-primary text-white">
                        <div className="pr-1">{review.rating}</div>
                        <Star size={14} />
                      </Badge>
                      <div className="font-semibold ">
                        {ReviewWord[review.rating]}
                      </div>
                    </div>
                    <div className="pt-3">{review.comment}</div>
                    <div className="text-gray-400 text-xs pt-2">
                      <div>
                        Reviewed on :
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center">
                  <div className="font-semibold text-xl">No reviews found</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
