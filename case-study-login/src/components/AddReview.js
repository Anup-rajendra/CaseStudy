import React, { useState } from 'react';
import '../css/AddReview.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddReview = ({ product }) => {
  const userId = parseInt(localStorage.getItem('userData'), 10);
  const currentDate = new Date();
  const [comment, setComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const reviewDate = currentDate.toISOString().split('T')[0];
  const navigate = useNavigate(); // Hook to navigate programmatically
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    try {
      const response = await axios.post('http://localhost:5064/api/Reviews', {
        productId: product.productId,
        userId: userId,
        rating: newRating,
        comment: comment,
        reviewDate: reviewDate,
      });
      console.log(response);
      // Reset form values
      setNewRating(5);
      setComment('');
      // Navigate to another route (e.g., product details page)
    } catch (error) {
      console.error('Error submitting review', error);
      alert('Failed to submit review. Please try again later.');
    } finally {
      navigate(`/product/`, { state: { product } });
    }
  };
  return (
    <div className="formContainer">
      <h2 className="heading">Add new Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label className="label">
            Comment:
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter Comment"
              className="input"
            />
          </label>
        </div>
        <div className="inputGroup">
          <label className="label">
            Rating:
            <select
              value={newRating}
              onChange={(e) => setNewRating(parseInt(e.target.value))}
              className="select"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="submitButton">
          Submit Review
        </button>
      </form>
    </div>
  );
};
export default AddReview;
