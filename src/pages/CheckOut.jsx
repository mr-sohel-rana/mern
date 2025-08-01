import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout/Layout';

const CheckoutPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth(); // Get authenticated user
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '', // Added address field
  });
  const [paymentMethod, setPaymentMethod] = useState(''); // Renamed to 'paymentMethod'
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state to prevent multiple submissions

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth?.user) {
      navigate('/login');
      toast.error('Please log in to proceed with checkout');
    }
  }, [auth?.user, navigate]);

  // Redirect to success page when order is placed
  useEffect(() => {
    if (orderSuccess) {
      navigate('/products');
    }
  }, [orderSuccess, navigate]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.email || !shippingAddress.city || !shippingAddress.address || !paymentMethod) {
      toast.error('Please fill out all fields and select a payment method');
      return;
    }
  
    setLoading(true); // Set loading to true before the API request
  
    const orderData = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      email: shippingAddress.email, // Ensure email is here
      city: shippingAddress.city,
      address: shippingAddress.address,
      paymentMethod,
      buyer: auth?.user?._id,
      status: 'not processing',
      cart: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: totalPrice,
      totalItems: cart.length,
    };
    console.log('Order Data:', orderData);
    try {
      const response = await fetch('http://localhost:5000/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || 'Order placement failed');
  
      toast.success('Order placed successfully!');
      setCart([]); // Clear cart
      setOrderSuccess(true); // Redirect to success page
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after request is completed
    }
  };
  

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Checkout</h2>
        <div className="row">
          {/* Order Summary */}
          <div className="col-md-7 mb-4">
            <h4 className="mb-4">Your Order</h4>
            <div className="card">
              <div className="card-body">
                {cart.map((product) => (
                  <div key={product._id} className="d-flex justify-content-between mb-3">
                    <div className="d-flex">
                      <img
                        src={`http://localhost:5000/uploads/${product.photos[0]}`}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                      />
                      <div>
                        <p className="mb-1">{product.name}</p>
                        <p className="text-muted">Quantity: {product.quantity}</p>
                      </div>
                    </div>
                    <p><strong>${(product.price * product.quantity).toFixed(2)}</strong></p>
                  </div>
                ))}
                <div className="d-flex justify-content-between">
                  <h5>Total:</h5>
                  <p><strong>${totalPrice.toFixed(2)}</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="col-md-5">
            <h4 className="mb-4">Shipping Information</h4>
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control" name="phone" value={shippingAddress.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" name="email" value={shippingAddress.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" name="city" value={shippingAddress.city} onChange={handleInputChange} required />
                  </div>

                  {/* Address Field */}
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="address" 
                      value={shippingAddress.address} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Payment Method</label><br />
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="paymentMethod" value="rocket" checked={paymentMethod === 'rocket'} onChange={handlePaymentMethodChange} />
                      <label className="form-check-label">Rocket</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="paymentMethod" value="nogod" checked={paymentMethod === 'nogod'} onChange={handlePaymentMethodChange} />
                      <label className="form-check-label">Nogod</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="paymentMethod" value="cashon" checked={paymentMethod === 'cashon'} onChange={handlePaymentMethodChange} />
                      <label className="form-check-label">Cash on Delivery</label>
                    </div>
                  </div>
                </form>
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={handlePlaceOrder}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default CheckoutPage;
