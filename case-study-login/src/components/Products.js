import React, { useState } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, GET_CART_TABLE, CREATE_OR_UPDATE_CART, UPDATE_CART_ITEM } from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster,toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "./ui/card"
import { Button } from './ui/button';
const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const userId = parseInt(localStorage.getItem("userData"), 10);
    const navigate = useNavigate();
    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);

    const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
        skip: !selectedProduct,
        variables: { userId },
    });

    const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

    const handleCartSubmit = async (productId,productName) => {
        setSelectedProduct(productId);
        console.log(productId);
        console.log(productName);
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
        const res = await updateCartItem({ variables: { cartId, productId } });
        console.log("CartItem Details:", res.data.updateCartItem);
        toast.success(`${productName} has been added to Cart`);
        setSelectedProduct(null);
    };

    if (productsLoading) return <p>Loading...</p>;
    if (productsError) return <p>Error: {productsError.message}</p>;

    return (
        <div>
            <Toaster />
            <div className='text-center text-3xl font-bold pt-8 pb-12'>Products</div>
            {/* <div>
                <button class="fixed-button" onClick={()=>navigate('/Cart')}>Go To Cart</button>
            </div> */}
          <div className='grid grid-cols-3 gap-4 px-3'>
                {productsData.products.map((product) => (
                    <>
                    <Card className="rounded-none text-primary shadow-md hover:shadow-primary">
                    <CardHeader>
                      <CardTitle className="border-b pb-4">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                    <img src={product.photoUrl} alt={product.name} style={{ width: '200px', height: '250px', borderRadius: '8px', alignContent:'center' }} />
                    </div>
                    <div className='flex flex-col gap-6 justify-center'>
                    <div><span className='font-bold text-xl'>Price: </span><span className='text-black font-semibold pl-1'>Rs.{product.price.toFixed(2)}</span></div>
                        <div><span className='font-bold text-xl'>Category:</span><span className='text-black font-semibold pl-1'> {product.category.categoryName}</span></div>
                        <div><span className='font-bold text-xl'>Quantity:</span> <span className='text-black font-semibold pl-1'>{product.inventory.stockQuantity}</span></div>
                    </div>
                    </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                        <div >
                            <Button variant='outline' onClick={() => handleCartSubmit(product.productId, product.name)} className="transition ease-in-out delay-150 hover:-translate-y-1">
                            Add to Cart
                            </Button>
                        </div>
                    <div className='w-full'>
                            <Button onClick={() => handleCartSubmit(product.productId, product.name)} className="bg-gradient-to-r from-primary to-blue-400 animated-background w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300    ">
                                Buy Now
                            </Button>
                     </div>
                    </CardFooter>
                   
                  
                  </Card>
                   
                    </>
                ))}
            </div>
            </div>
    );
    
};

export default Products;
