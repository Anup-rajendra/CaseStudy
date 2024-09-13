import React, { useState } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import {  GET_CART_TABLE, CREATE_OR_UPDATE_CART, UPDATE_CART_ITEM } from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster, toast } from 'sonner';
import { useNavigate, Link , useLocation } from 'react-router-dom';
//import { CloudCog } from 'lucide-react';
const SearchedProducts = ( ) => {
    const location = useLocation();
    const {suggestions} = location.state||{};
    const [selectedProduct, setSelectedProduct] = useState(null);
    //const [selectedCategory, setSelectedCategory] = useState(null);
    const userId = parseInt(localStorage.getItem("userData"), 10);
    const navigate = useNavigate();

    const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
        skip: !selectedProduct,
        variables: { userId },
    });
    
    const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

    const handleCartSubmit = async (productId, productName) => {
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

    
    return (
        <div>
            <Toaster />
            <h2 style={{ paddingBottom: 60, paddingTop: 20 }}>Products</h2>
            <div>
                <button class="fixed-button" onClick={() => navigate('/Cart')}>Go To Cart</button>
            </div>
            <div className='product-card'>
                {suggestions.map((product) => (
                    <div className='product-item' key={product.productId}>
                        <div className='product-heading'>{product.name}</div>
                        <div className='product-heading'>
                            <Link
                                to={`/product/${userId}`}
                                state={{ product, userId }}>
                                <img
                                    src={product.photoUrl}
                                    alt={product.name}
                                    style={{ width: '50%', height: 'auto', borderRadius: '8px', alignContent: 'center' }}
                                />
                            </Link>
                        </div>
                        <div className='product-details'>Price: ${product.price.toFixed(2)}</div>
                        {/* <div className='product-details'>Category: {product.category.categoryName}</div> */}
                        {/* <div className='product-details'>Quantity: {product.inventory.stockQuantity}</div> */}
                        <div className='button'>
                            <button onClick={() => handleCartSubmit(product.productId, product.name)}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default SearchedProducts;
