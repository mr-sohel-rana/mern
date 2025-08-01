import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/authContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CartProvider } from './context/cartContext.jsx';

createRoot(document.getElementById('root')).render(
 
  <AuthProvider>
    <CartProvider>
    <BrowserRouter>
    <App />
  </BrowserRouter>
    </CartProvider>
    
  </AuthProvider>
 
);
