import React, { useState, useEffect } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, GET_CART_TABLE, CREATE_OR_UPDATE_CART, UPDATE_CART_ITEM } from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster, toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from './ui/button';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from 'axios'; // Import axios

const Products = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const userId = parseInt(localStorage.getItem("userData"), 10);
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
    const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
        skip: !userId,
        variables: { userId },
    });
    const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

    // Fetch liked products on component mount
    useEffect(() => {
        const fetchLikedProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5120/api/WishlistItems/${userId}`);
                const likedProductIds = response.data.map(item => item.productId);
                setLikedProducts(likedProductIds);
            } catch (error) {
                console.error('Failed to fetch liked products:', error);
            }
        };

        fetchLikedProducts();
    }, [userId,likedProducts]);

    // Update products and filter liked products when productsData changes
    useEffect(() => {
        if (productsData) {
            setProducts(productsData.products);

            // Filter liked products to only include those in the current products data
            const validLikedProductIds = likedProducts.filter(id => 
                productsData.products.some(product => product.productId === id)
            );
            setLikedProducts(validLikedProductIds);
        }
    }, [productsData]);

    const handleCartSubmit = async (productId, productName) => {
        let cartId;

        if (!cartData?.getCartByUserId) {
            // If cart does not exist, create it
            const response = await createOrUpdateCart({ variables: { userId } });
            cartId = response.data.createOrUpdateCart.cartId;
            refetchCart();
        } else {
            cartId = cartData.getCartByUserId.cartId;
        }

        // Once you have the cartId, update the cart item
        await updateCartItem({ variables: { cartId, productId } });
        toast.success(`${productName} has been added to Cart`);
    };

    const handleLikeClick = async (productId) => {
        try {
            if (likedProducts.includes(productId)) {
                // Remove from wishlist
                await axios.delete(`http://localhost:5120/api/WishlistItems?wishlistid=${userId}&productid=${productId}`);
                setLikedProducts(prev => prev.filter(id => id !== productId));
                toast.success('Removed from wishlist');
            } else {
                // Add to wishlist
                await axios.post(`http://localhost:5120/api/WishlistItems`, {
                    wishlistId: userId,
                    productId,
                });
                setLikedProducts(prev => [...prev, productId]);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error('Like/Unlike Error:', error); // Log error for debugging
        }
    };

    if (productsLoading) return <p>Loading...</p>;
    if (productsError) return <p>Error: {productsError.message}</p>;

    return (
        <div>
            <Toaster />
            <div className='text-center text-3xl font-bold pt-8 pb-12'>Products</div>
            <div className='grid grid-cols-3 gap-4 px-3'>
                {products.map((product) => (
                    <Card className="rounded-none text-primary shadow-md hover:shadow-primary" key={product.productId}>
                        <CardHeader>
                            <CardTitle className="border-b pb-4">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex gap-6'>
                                <div className='flex flex-col gap-2 relative '>
                                    <Link
                                        to={`/product`}
                                        state={{ product, userId }}>
                                        <img src={product.photoUrl} alt={product.name} className="product-image " />
                                    </Link>
                                    <div
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={() => handleLikeClick(product.productId)}
                                    >
                                        {likedProducts.includes(product.productId) ? (
                                            <AiFillHeart size={24} className="text-red-500" />
                                        ) : (
                                            <AiOutlineHeart size={24} className="text-gray-500" />
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-col gap-6 justify-center'>
                                    <div><span className='font-bold text-xl'>Price: </span><span className='text-black font-semibold pl-1'>Rs.{product.price.toFixed(2)}</span></div>
                                    <div><span className='font-bold text-xl'>Category:</span><span className='text-black font-semibold pl-1'> {product.category.categoryName}</span></div>
                                    <div><span className='font-bold text-xl'>Quantity:</span> <span className='text-black font-semibold pl-1'>{product.inventory.stockQuantity}</span></div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-4">
                            <div>
                                <Button variant='outline' onClick={() => handleCartSubmit(product.productId, product.name)} className="transition ease-in-out delay-150 hover:-translate-y-1">
                                    Add to Cart
                                </Button>
                            </div>
                            <div className='w-full'>
                                <Button onClick={() => handleCartSubmit(product.productId, product.name)} className="bg-gradient-to-r from-primary to-blue-400 animated-background w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300">
                                    Buy Now
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Products;
