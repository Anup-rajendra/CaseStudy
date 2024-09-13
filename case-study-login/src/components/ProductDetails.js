import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
const ProductDetails = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [reviews, setReviews] = useState([]);
  console.log(product);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  //const productImageUrl = product.photoUrl;
  //for cart
  const [selectedProduct, setSelectedProduct] = useState(null);
  const userId = parseInt(localStorage.getItem('userData'), 10); //parseInt(localStorage.getItem("userData"), 10);

  //const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId },
  });
  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  //for cart
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        console.log('productid', product.productId);
        const response = await axios.get(
          `http://localhost:5064/api/Reviews/${product.productId}`
        );
        const fetchedReviews = response.data.$values;
        setReviews(fetchedReviews);

        // Calculate average rating
        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );

          const avgRating = totalRating / fetchedReviews.length;
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
    fetchReviews();
  }, [product.productId]);
  const handleAddToCart = async (productId, productName) => {
    setSelectedProduct(productId);
    console.log('This is product id', productId);
    console.log('this is product name', productName);
    console.log('this is userid', userId);
    let cartId;
    if (!cartData?.getCartByUserId) {
      // If cart does not exist, create it
      const response = await createOrUpdateCart({ variables: { userId } });
      cartId = response.data.createOrUpdateCart.cartId;
      console.log('cartid by rohith', cartId);
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
      console.log('by rohith cartid', cartId);
    }
    // Once you have the cartId, update the cart item
    const res = await updateCartItem({ variables: { cartId, productId } });
    console.log('CartItem Details by rohith:', res.data.updateCartItem);
    toast.success(`${productName} has been added to Cart`);
    setSelectedProduct(null);
  };
  const handleBuyNow = () => {
    console.log('Proceeding to checkout');
  };
  // const handleAddReview = () => {
  //     console.log('Add review button clicked');
  //     // Add your logic for adding a new review here
  // };
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} className="star full">
            &#9733;
          </span>
        ))}
        {halfStar && <span className="star half">&#9733;</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="star empty">
            &#9733;
          </span>
        ))}
      </>
    );
  };
  console.log('this is product', product);
  console.log('reviews', reviews);
  return (
    <div className="flex items-center justify-end pr-20 pt-6 bg-white">
      <div className="fixed left-36 top-40 bg-transparent bg-white border rounded-lg hover:shadow-primary shadow-md">
        <div className="border-b p-3 ">
          <img
            src={product.photoUrl}
            alt="Product"
            className=" w-[416px] h-[416px]"
          />
        </div>
        <div className="flex gap-2 p-4">
          <Button
            onClick={() => handleAddToCart(product.productId, product.name)}
            className="flex-1 h-14 text-primary transition ease-in-out delay-150 hover:-translate-y-1"
            variant="outline"
          >
            Add to Cart
          </Button>
          <Button
            onClick={() => handleBuyNow}
            className="flex-1 h-14 bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:-translate-y-1"
          >
            Buy Now
          </Button>
        </div>
      </div>
      <div className="bg-white w-[800px] flex-1"></div>
      <div className="flex flex-col w-[800px] p-5 rounded-sm bg-white gap-4 ">
        <Toaster />
        <div className="flex flex-col gap-2 border p-4 rounded-md">
          <div className="font-bold text-3xl border-b pb-4 ">
            {product.name}
          </div>
          <div className="font-extrabold text-2xl pb-2">${product.price}</div>
          <div className="flex gap-2">
            <div className="font-semibold ">Category: </div>
            <div>{product.category.categoryName}</div>
          </div>
          <div className="flex gap-2 flex-wrap pb-8">
            <div className="font-semibold ">Description: </div>
            <div>{product.description}</div>
          </div>
        </div>
        {isLoading ? (
          <p className="loading">Loading reviews...</p>
        ) : (
          <div className="border rounded-sm p-4">
            <div className="overall-rating">
              <div className="font-bold text-3xl border-b pb-3">
                User Reviews
              </div>
              <div className="pt-3 font-medium border-b pb-4">
                Overall Rating
              </div>
              <div className="rating-stars">{renderStars(averageRating)}</div>
              <p className="average-rating">
                {averageRating.toFixed(1)} out of 5
              </p>
            </div>
            <ul className="reviewList">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <li key={review.reviewId} className="reviewItem">
                    <p>
                      <strong>User:</strong>
                      {review.username}
                    </p>
                    <p>
                      <div className="font-semibold">Rating:</div>{' '}
                      {renderStars(review.rating)}
                    </p>
                    <p>
                      <strong>Comment:</strong> {review.comment}
                    </p>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </li>
                ))
              ) : (
                <li className="noReviews">No reviews found</li>
              )}
            </ul>
          </div>
        )}
        <div className="add-review-container">
          <AddReview product={product} />
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
