import React, { useEffect, useState } from 'react';
import '../css/Cart.css';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/client'; // Import Apollo mutation hook
import {
  CREATE_OR_UPDATE_CART,
  UPDATE_CART_ITEM,
  GET_CART_TABLE,
} from '../Apollo/queries'; // Adjust the import paths if necessary
import { Toaster, toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button'; // Assuming you're using a button from the UI library
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ShoppingCart } from 'lucide-react';
const Wishlist = () => {
  const [user, setUser] = useState(null);
  const [wishlistItemsArray, setWishlistItemsArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId: user },
  });

  useEffect(() => {
    const userId = localStorage.getItem('userData');
    if (userId) {
      setUser(parseInt(userId, 10));
      const fetchItem = async () => {
        let retries = 3;
        while (retries > 0) {
          try {
            setError('');
            setLoading(true);
            const response = await axios.get(
              `http://localhost:5120/api/WishlistItems/${userId}`
            );
            setWishlistItemsArray(response.data);
            break; // Exit loop if successful
          } catch (err) {
            retries -= 1;
            if (retries === 0) {
              setError(
                'Failed to fetch wishlist items after multiple attempts'
              );
              toast.error(
                'Failed to fetch wishlist items after multiple attempts'
              );
            }
          } finally {
            setLoading(false);
          }
        }
      };
      fetchItem();
    }
  }, []);

  const handleCartSubmit = async (productId, productName) => {
    setSelectedProduct(productId);
    let cartId;

    if (!cartData?.getCartByUserId) {
      // If cart does not exist, create it
      const response = await createOrUpdateCart({
        variables: { userId: user },
      });
      cartId = response.data.createOrUpdateCart.cartId;
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
    }

    // Once you have the cartId, update the cart item
    const res = await updateCartItem({ variables: { cartId, productId } });
    console.log(res);
    toast.success(`${productName} has been added to Cart`);
    setSelectedProduct(null);
  };

  const handleRemoveItem = async (productId) => {
    if (!user) return; // Ensure user is defined
    try {
      await axios.delete(
        `http://localhost:5120/api/WishlistItems?wishlistid=${user}&productid=${productId}`
      );
      setWishlistItemsArray(
        wishlistItemsArray.filter((item) => item.productId !== productId)
      );
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Error removing item');
    }
  };

  if (loading) return <p> </p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center gap-10 justify-center ">
      <Toaster />
      {wishlistItemsArray ? (
        <div className="flex flex-col gap-10 ">
          <div className="text-left font-bold text-2xl pt-10">
            Wishlist Items
          </div>
          <div className="flex gap-6 w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="font-extrabold bg-gradient-to-r from-primary to-blue-400 animated-background transition">
                  <TableHead className="w-[200px] font-extrabold text-white">
                    Item
                  </TableHead>
                  <TableHead className="font-extrabold text-white">
                    Price
                  </TableHead>
                  <TableHead className="font-extrabold text-white">
                    Remove
                  </TableHead>
                  <TableHead className="font-extrabold text-white">
                    Cart
                  </TableHead>
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
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveItem(wishlistItem.productId);
                        }}
                      >
                        <Trash2 />
                      </button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCartSubmit(
                            wishlistItem.productId,
                            wishlistItem.name
                          );
                        }}
                        className="transition ease-in-out delay-150 hover:-translate-y-1 flex items-center gap-2 text-primary"
                      >
                        <ShoppingCart size={20} />
                        Add to Cart
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-36 gap-16">
          <div className="font-bold text-6xl">Empty Wishlist</div>
          <img src="/NoData.svg" alt="Empty WebPage" width={600} />
        </div>
      )}
    </div>
  );
};

export default Wishlist;
