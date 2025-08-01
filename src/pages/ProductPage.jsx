import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useCart();

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/v1/allproduct');
      if (data.status === 'success') {
        setProducts(data.data || []);
        toast.success('Products Fetched Successfully');
      } else {
        toast.error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Something went wrong while fetching products!');
    }
    setIsLoading(false);
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    
    if (existingProduct) {
      // If the product is already in the cart, show a message
      toast.info(`${product.name} is already in the cart`);
    } else {
      // If not, add the product to the cart and show success message
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      toast.success(`${product.name} added to cart`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">All Products</h2>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm border-light rounded">
                    <img
                      src={`http://localhost:5000/uploads/${product.photos[0]}`} // Display the first image
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-truncate">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">
                        <strong>Price:</strong> ${product.price}
                      </p>
                      <p className="card-text">
                        <strong>Quantity:</strong> {product.quantity}
                      </p>
                      <p className="card-text">
                        <strong>Category:</strong> {product.category.categoryName}
                      </p>
                      <Link
                        to={`/products/details/${product._id}`}
                        className="btn btn-primary btn-block mt-3"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn btn-success btn-block mt-3"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p>No products found.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default ProductPage;
