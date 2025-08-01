import { useState, useContext, createContext, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();

// CartProvider Component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const existingCartItem = localStorage.getItem('cart');
    if (existingCartItem) {
      setCart(JSON.parse(existingCartItem));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to Access CartContext
const useCart = () => {
  const cartContext = useContext(CartContext);
  return cartContext; // Return the context value (cart, setCart)
}

export { useCart, CartProvider };
