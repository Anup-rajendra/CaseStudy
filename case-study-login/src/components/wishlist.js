import React, { useEffect, useState } from 'react';
import '../css/Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [user, setUser] = useState(null);
  const [wishlistItemsArray, setWishlistItemsArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userData');
    if (userId) {
      setUser(parseInt(userId, 10));
      const fetchItem = async () => {
        let retries = 3;
        while (retries > 0) {
          try {
            setError("");
            setLoading(true);
            const response = await axios.get(`http://localhost:5120/api/WishlistItems/${userId}`);
            setWishlistItemsArray(response.data);
            const total = response.data.reduce((acc, item) => acc + item.price, 0);
            setTotalPrice(total);
            break; // Exit loop if successful
          } catch (err) {
            retries -= 1;
            if (retries === 0) {
              setError('Failed to fetch wishlist items after multiple attempts');
              toast.error('Failed to fetch wishlist items after multiple attempts');
            }
          } finally {
            setLoading(false);
          }
        }
      };
      fetchItem();
    }
  }, []);

  const handleRemoveItem = async (productId) => {
    if (!user) return; // Ensure user is defined
    try {
      await axios.delete(`http://localhost:5120/api/WishlistItems?wishlistid=${user}&productid=${productId}`);
      setWishlistItemsArray(wishlistItemsArray.filter(item => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Error removing item');
    }
  };

  const handleOrder = () => {
    navigate('/orders');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex items-center gap-10 justify-evenly">
      <div className="flex flex-col gap-10">
        <div className="text-left font-bold text-2xl pt-10">Wishlist Items</div>
        <div className="flex gap-6 w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="font-extrabold bg-gradient-to-r from-primary to-blue-400 animated-background transition">
                <TableHead className="w-[200px] font-extrabold text-white">Item</TableHead>
                <TableHead className="font-extrabold text-white">Price</TableHead>
                <TableHead className="font-extrabold text-white">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wishlistItemsArray.map((wishlistItem) => (
                <TableRow key={wishlistItem.productId}>
                  <TableCell className="flex gap-5 font-medium w-[200px] items-center">
                    <img
                      src={wishlistItem.photoUrl}
                      alt={wishlistItem.productName}
                      style={{ width: '60px', height: '60px' }}
                    />
                    <div>{wishlistItem.name}</div>
                  </TableCell>
                  <TableCell>{wishlistItem.price}</TableCell>
                  <TableCell className="pl-8 text-primary">
                    <button onClick={() => handleRemoveItem(wishlistItem.productId)}>
                      <Trash2 />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* <TableCell colSpan={2} className="text-primary font-bold">Total</TableCell>
                <TableCell className="text-primary">{totalPrice}</TableCell> */}
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="flex justify-end pr-3">
          <Button
            onClick={handleOrder}
            className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300"
          >
            Order Now
          </Button>
        </div>
      </div>

      <div className="pl-5">
        <Card className="w-[300px]">
          <CardHeader className="border-b bg-gradient-to-r from-primary to-blue-400 animated-background">
            <CardTitle className="text-white">Summary</CardTitle>
            <CardDescription className="text-white">Price Details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-4 border-b">
            <div className="flex gap-4">
              <div className="text-primary font-semibold">Subtotal:</div>
              <div className="text-black font-normal">{totalPrice}</div>
            </div>
            <div className="flex gap-4">
              <div className="text-primary font-semibold">Delivery fee:</div>
              <div className="text-black font-normal">Free</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row gap-4 pt-4">
            <div className="text-primary font-semibold">Total Price:</div>
            <div className="text-black font-normal">{totalPrice}</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Wishlist;
