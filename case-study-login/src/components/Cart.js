import React, { useEffect, useState } from 'react';
import '../css/Cart.css';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CARTDETAILS,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from '../Apollo/queries';
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
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

const Cart = () => {
  const [user, setUser] = useState(null);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [updateCartItemByCartId] = useMutation(UPDATE_CART_ITEM_QUANTITY);
  const [removeCartItem] = useMutation(REMOVE_CART_ITEM);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userData');
    if (userId) {
      setUser(parseInt(userId, 10));
    }
  }, []);

  const { loading, error, refetch } = useQuery(GET_CARTDETAILS, {
    variables: { userId: user },
    skip: !user, // Skip query until user is set
    onCompleted: (data) => {
      // Check if carts and cartItemsArray exist in the response
      const carts = data?.userById?.carts;
      if (carts && carts.length > 0 && carts[0].cartItems) {
        const initialCartItems = carts[0].cartItems.map((item) => ({
          cartItemId: item.cartItemId,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
          photoUrl: item.product.photoUrl,
          totalPrice: (item.quantity * item.product.price).toFixed(2),
        }));
        setCartItemsArray(initialCartItems);
      } else {
        // Handle case where carts or cartItemsArray is empty
        setCartItemsArray([]);
      }
    },
  });

  useEffect(() => {
    const totalCartPrice = cartItemsArray
      .reduce((acc, item) => acc + parseFloat(item.totalPrice), 0)
      .toFixed(2);
    setTotalPrice(totalCartPrice);
  }, [cartItemsArray]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleQuantityChange = async (cartItemId, change) => {
    setCartItemsArray((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
              totalPrice: (
                (item.quantity + change) *
                item.productPrice
              ).toFixed(2),
            }
          : item
      )
    );

    try {
      const { data } = await updateCartItemByCartId({
        variables: { cartItemId, change },
      });
      if (data.updateCartItemQuantity.quantity <= 1) {
        navigate(0);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      setCartItemsArray((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? {
                ...item,
                quantity: Math.max(1, item.quantity - change),
                totalPrice: (
                  (item.quantity - change) *
                  item.productPrice
                ).toFixed(2),
              }
            : item
        )
      );
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setCartItemsArray((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );

    try {
      await removeCartItem({
        variables: { cartItemId },
      });
      refetch();
    } catch (error) {
      console.error('Failed to remove cart item:', error.message);
      refetch();
    }
  };

  const handleOrder = () => {
    navigate('/orders');
  };

  return (
    <div className="flex items-center gap-10 justify-evenly ">
      <div className="flex flex-col gap-10 flex-grow pl-20">
        <div className="text-left font-bold text-2xl pt-10">Cart Items</div>
        <div className="flex gap-6 w-[1000px] bg-white flex-grow">
          <Table>
            <TableHeader>
              <TableRow className="font-extrabold bg-gradient-to-r from-primary to-blue-400 animated-background transition">
                <TableHead className="w-[200px] font-extrabold text-white">
                  Item
                </TableHead>
                <TableHead className="font-extrabold text-white">
                  Price
                </TableHead>
                <TableHead
                  colSpan={2}
                  className="font-extrabold pl-7 text-white"
                >
                  Quantity
                </TableHead>
                <TableHead className="font-extrabold text-white">
                  Amount
                </TableHead>
                <TableHead className="font-extrabold text-white">
                  Remove
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItemsArray.map((cartItem) => {
                return (
                  <TableRow key={cartItem.cartItemId}>
                    <TableCell className="flex gap-5 font-medium w-[200px] items-center">
                      <img
                        src={cartItem.photoUrl}
                        alt={cartItem.productName}
                        style={{ width: '60px', height: '60px' }}
                      />
                      <div>{cartItem.productName}</div>
                    </TableCell>
                    <TableCell>{cartItem.productPrice}</TableCell>
                    <TableCell colSpan={2}>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(cartItem.cartItemId, -1)
                          }
                        >
                          <Minus className="text-primary" />
                        </button>
                        {cartItem.quantity}
                        <button
                          onClick={() =>
                            handleQuantityChange(cartItem.cartItemId, 1)
                          }
                        >
                          <Plus className="text-primary" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{cartItem.totalPrice}</TableCell>
                    <TableCell className="pl-8 text-primary">
                      <button
                        onClick={() => handleRemoveItem(cartItem.cartItemId)}
                      >
                        <Trash2 />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-primary font-bold">
                  Total
                </TableCell>
                <TableCell className="text-primary">{totalPrice}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="flex justify-end pr-3 fixed right-10 bottom-10">
          <Button
            onClick={handleOrder}
            className="bg-gradient-to-r from-primary to-blue-400 animated-background transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300 px-6"
          >
            Order Now
          </Button>
        </div>
      </div>
      <div className="w-[300px]"></div>
      <div className="fixed right-12 top-[210px]">
        <Card className="w-[300px]">
          <CardHeader className="border-b bg-gradient-to-r from-primary to-blue-400 animated-background">
            <CardTitle className="text-white">Summary</CardTitle>
            <CardDescription className="text-white">
              Price Details
            </CardDescription>
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

export default Cart;
