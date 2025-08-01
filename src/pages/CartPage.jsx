import React from 'react';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout/Layout';

const CartPage = () => {
  const [cart, setCart] = useCart();

  // Add item to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      // If product is already in the cart, show a message
      toast.info(`${product.name} is already in the cart`);
    } else {
      // If product is not in the cart, add it with quantity 1
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      toast.success(`${product.name} added to cart`);
    }
  };

  // Increase item quantity
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    toast.success('Quantity increased');
  };

  // Decrease item quantity
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    toast.success('Quantity decreased');
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    toast.info('Item removed from cart');
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row">
            {cart.map((product) => (
              <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-light">
                  <img
                    src={`http://localhost:5000/uploads/${product.photos[0]}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{product.name}</h5>
                    <p className="card-text">
                      <strong>Price:</strong> ${product.price}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <button className="btn btn-secondary btn-sm" onClick={() => decreaseQuantity(product._id)}>-</button>
                        <span className="mx-3">{product.quantity}</span>
                        <button className="btn btn-secondary btn-sm" onClick={() => increaseQuantity(product._id)}>+</button>
                      </div>
                      <p className="text-muted"><strong>Subtotal:</strong> ${product.price * product.quantity}</p>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(product._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div className="text-center mt-5">
            <h4 className="mb-4">Total: ${totalPrice.toFixed(2)}</h4>
            <Link to="/checkout" className="btn btn-success btn-lg">Proceed to Checkout</Link>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default CartPage;
