import React, { useState, useEffect } from 'react';
import '../css/Products.css';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PRODUCTS_BY_CATEGORY,
  GET_CART_TABLE,
  CREATE_OR_UPDATE_CART,
  UPDATE_CART_ITEM,
} from '../Apollo/queries'; // Adjust the import path if necessary
import { Toaster, toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { ShoppingCart } from 'lucide-react';
const Categories = () => {
  const location = useLocation();
  const { category } = location.state || {};
  const categoryId = category.categoryId;
  const [likedProducts, setLikedProducts] = useState([]);
  const Navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const userId = parseInt(localStorage.getItem('userData'), 10);
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    //skip: !selectedProduct,
    variables: { categoryId },
  });
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_TABLE, {
    skip: !selectedProduct,
    variables: { userId },
  });

  const [createOrUpdateCart] = useMutation(CREATE_OR_UPDATE_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5120/api/WishlistItems/${userId}`
        );
        const likedProductIds = response.data.map((item) => item.productId);
        setLikedProducts(likedProductIds);
      } catch (error) {
        console.error('Failed to fetch liked products:', error);
      }
    };
    fetchLikedProducts();
  }, [userId]);
  // Update products and filter liked products when productsData changes
  // Update products and filter liked products when productsData changes
  useEffect(() => {
    if (productsData && productsData.productsByCategory) {
      setProducts(productsData.productsByCategory);
    }
  }, [productsData]); // Only run when productsData changes

  // Separate useEffect for filtering liked products
  useEffect(() => {
    if (products.length > 0) {
      const validLikedProductIds = likedProducts.filter((id) =>
        products.some((product) => product.productId === id)
      );
      setLikedProducts(validLikedProductIds);
    }
  }, [products]);

  const handleCartSubmit = async (productId, productName) => {
    setSelectedProduct(productId);
    console.log(productId);
    console.log(productName);
    let cartId;

    if (!cartData?.getCartByUserId) {
      // If cart does not exist, create it
      const response = await createOrUpdateCart({ variables: { userId } });
      console.log(response);
      cartId = response.data.createOrUpdateCart.cartId;
      refetchCart();
    } else {
      cartId = cartData.getCartByUserId.cartId;
    }

    // Once you have the cartId, update the cart item
    const res = await updateCartItem({ variables: { cartId, productId } });
    console.log('CartItem Details:', res.data.updateCartItem);
    toast.success(`${productName} has been added to Cart`);
    setSelectedProduct(null);
  };
  const handleLikeClick = async (productId) => {
    try {
      if (likedProducts.includes(productId)) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5120/api/WishlistItems?wishlistid=${userId}&productid=${productId}`
        );
        setLikedProducts((prev) => prev.filter((id) => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(`http://localhost:5120/api/WishlistItems`, {
          wishlistId: userId,
          productId,
        });
        setLikedProducts((prev) => [...prev, productId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Like/Unlike Error:', error); // Log error for debugging
    }
  };
  const handleBuyNow = (productId, productName, productPrice, photoURL) => {
    const data = {
      productId: productId,
      productName: productName,
      productPrice: productPrice,
      photoURL: photoURL,
    };
    Navigate('/OrderItem', { state: data });
  };

  if (productsLoading) return <p>Loading...</p>;
  if (productsError) return <p>Error: {productsError.message}</p>;

  return (
    <div className="h-full">
      <Toaster />
      <div className="text-center text-3xl font-bold pt-8 pb-12">Products</div>
      {/* <div>
                <button class="fixed-button" onClick={()=>navigate('/Cart')}>Go To Cart</button>
            </div> */}
      <div className="grid grid-cols-3 gap-4 px-3">
        {productsData.productsByCategory.map((product) => (
          <>
            <Link to={`/product`} state={{ product, userId }}>
              <Card className="rounded-none text-primary shadow-md hover:shadow-primary ">
                <CardHeader>
                  <CardTitle className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>{product.name}</div>
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLikeClick(product.productId);
                        }}
                      >
                        {likedProducts.includes(product.productId) ? (
                          <AiFillHeart size={24} className="text-red-500" />
                        ) : (
                          <AiOutlineHeart size={24} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2 relative">
                      <img
                        src={product.photoUrl}
                        alt={product.name}
                        style={{
                          width: '200px',
                          height: '250px',
                          borderRadius: '8px',
                          alignContent: 'center',
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-6 justify-center">
                      <div>
                        <span className="font-bold text-xl">Price: </span>
                        <span className="text-black font-semibold pl-1">
                          Rs.{product.price.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-xl">Category:</span>
                        <span className="text-black font-semibold pl-1">
                          {' '}
                          {product.category.categoryName}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-xl">Quantity:</span>{' '}
                        <span className="text-black font-semibold pl-1">
                          {product.inventory.stockQuantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <div>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent link navigation
                        handleCartSubmit(product.productId, product.name);
                      }}
                      className="transition ease-in-out delay-150 hover:-translate-y-1 flex items-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </Button>
                  </div>
                  <div className="w-full">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent link navigation
                        handleBuyNow(
                          product.productId,
                          product.name,
                          product.price,
                          product.photoUrl
                        );
                      }}
                      className="bg-gradient-to-r from-primary to-blue-400 animated-background w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 hover:bg-indigo-500 duration-300    "
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
};

export default Categories;
