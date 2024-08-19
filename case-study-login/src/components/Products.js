import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Products = () => {
const [products, setProducts] = useState([]);
useEffect(() => {
const fetchProducts = async () => {
try {
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:5185/api/RetailAPI/products', {
headers: {
Authorization: `Bearer ${token}`
}
});
setProducts(response.data);
} catch (error) {
console.error('Error fetching products', error);
}
};
fetchProducts();
}, []);
return (
<div>
<h2>Products</h2>
<ul>
{products.map((product) => (
<li key={product.productId}>{product.name} - ${product.price}</li>
))}
</ul>
</div>
);
};
export default Products;