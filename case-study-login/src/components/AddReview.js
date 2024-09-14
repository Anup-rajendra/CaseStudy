import * as React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddReview = ({ product, open, onClose, onReviewAdded }) => {
  const userId = parseInt(localStorage.getItem('userData'), 10);
  const currentDate = new Date();
  const [comment, setComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const reviewDate = currentDate.toISOString().split('T')[0];
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5064/api/Reviews', {
        productId: product.productId,
        userId: userId,
        rating: newRating,
        comment: comment,
        reviewDate: reviewDate,
      });
      console.log(response);
      setNewRating(5);
      setComment('');
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review', error);
      alert('Failed to submit review. Please try again later.');
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about the product
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                placeholder="Enter your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select onValueChange={(value) => setNewRating(parseInt(value))}>
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => navigate(`/product/`)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddReview;
