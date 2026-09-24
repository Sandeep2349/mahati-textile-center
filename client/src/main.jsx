import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
