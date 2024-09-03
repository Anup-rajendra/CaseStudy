import React, { useState } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, GET_CART_TABLE, CREATE_OR_UPDATE_CART, UPDATE_CART_ITEM } from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster,toast } from 'sonner';
const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const userId = parseInt(localStorage.getItem("userData"), 10);

    const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);

    const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
        skip: !selectedProduct,
        variables: { userId },
    });

    const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

    const handleCartSubmit = async (productId,productName) => {
        setSelectedProduct(productId);

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
            <Toaster/>
            <h2  style={{paddingBottom:60,paddingTop:20}}>Products</h2>
            <div className='product-card'>
                {productsData.products.map((product) => (
                    <div className='product-item' key={product.productId}>
                        <div className='product-heading'>{product.name}</div>
                        <div className='product-details'>Price: ${product.price}</div>
                        <div className='product-details'>Category: {product.category.categoryName}</div>
                        <div className='product-details'>Quantity: {product.inventory.stockQuantity}</div>
                        <div className='button'>
                            <button onClick={() => handleCartSubmit(product.productId,product.name)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
