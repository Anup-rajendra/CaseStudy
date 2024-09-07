import React, { useState } from "react";
import '../css/AddReview.css';
import axios from 'axios';
import { Link , useNavigate} from "react-router-dom";

const AddReview = ({ productId, userId }) => {
    //const [reviewId, setReviewId] = useState("");
    const navigate= useNavigate();
    
    const [comment, setComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [reviewDate, setReviewDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
       
        setIsSubmitting(true);
        try {
            //const reviewid=11;
            const response = await axios.post('http://localhost:5064/api/Reviews', {
                
                productId: productId,
                userId: userId,
                rating: newRating,
                comment: comment,
                reviewDate: reviewDate
            });
            console.log("Rohith")
            
            setNewRating(5);
           
            setReviewDate('');
        } catch (error) {
            console.error("Error submitting review", error);
            alert("Failed to submit review. Please try again later.");
        } finally {
            setIsSubmitting(false);
            window.location.reload();
            //navigate(`/product/${userid}`, { state: { product , userid } })
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
                <div className="inputGroup">
                    <label className="label">
                        Review Date:
                        <input
                            type="date"
                            value={reviewDate}
                            onChange={(e) => setReviewDate(e.target.value)}
                            className="input"
                        />
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
