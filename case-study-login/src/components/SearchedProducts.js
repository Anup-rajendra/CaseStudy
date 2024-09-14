import React, { useState } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CART_TABLE,
  CREATE_OR_UPDATE_CART,
  UPDATE_CART_ITEM,
} from '../Apollo/queries';
import { Toaster, toast } from 'sonner';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const SearchedProducts = () => {
  const location = useLocation();
  const { suggestions, product } = location.state || {};
  const [selectedProduct, setSelectedProduct] = useState(null);
  const userId = parseInt(localStorage.getItem('userData'), 10);
  const navigate = useNavigate();

  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId },
  });

  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);

  const handleCartSubmit = async (productId, productName) => {
    setSelectedProduct(productId);
    let cartId;

    if (!cartData?.getCartByUserId) {
      const response = await createOrUpdateCart({ variables: { userId } });
      cartId = response.data.createOrUpdateCart.cartId;
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
    }

    const res = await updateCartItem({ variables: { cartId, productId } });
    toast.success(`${productName} has been added to Cart`);
    console.log(res);
    setSelectedProduct(null);
  };

  return (
    <div>
      <Toaster />
      <h2 style={{ paddingBottom: 60, paddingTop: 20 }}>Products</h2>
      <div>
        <button className="fixed-button" onClick={() => navigate('/Cart')}>
          Go To Cart
        </button>
      </div>
      <div className="product-card">
        {(suggestions || [product]).map((prod) => (
          <div className="product-item" key={prod.id}>
            <div className="product-heading">{prod.name}</div>
            <div className="product-heading">
              <Link to={`/product/${userId}`} state={{ product: prod, userId }}>
                <img
                  src={prod.photoUrl}
                  alt={prod.name}
                  style={{
                    width: '50%',
                    height: 'auto',
                    borderRadius: '8px',
                    alignContent: 'center',
                  }}
                />
              </Link>
            </div>
            <div className="product-details">
              Price: ${prod.price.toFixed(2)}
            </div>
            <div className="button">
              <button onClick={() => handleCartSubmit(prod.id, prod.name)}>
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
