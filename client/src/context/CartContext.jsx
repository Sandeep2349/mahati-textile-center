import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'mtc_shopping_cart_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [items]);

  /**
   * Add a product variant to cart
   */
  const addToCart = (product, variant, quantity = 1) => {
    if (!product || !variant) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.sku === variant.sku);
      const effectivePrice = variant.discountPrice || variant.price;

      // Extract variant attributes as readable object
      const attributes = variant.attributes instanceof Map
        ? Object.fromEntries(variant.attributes)
        : variant.attributes || {};

      const image = (variant.images && variant.images[0]) || (product.images && product.images[0]) || '';

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        // Cap at variant stock if available
        const cappedQty = variant.stock > 0 ? Math.min(newQty, variant.stock) : newQty;

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: cappedQty,
          subtotal: cappedQty * effectivePrice,
        };
        return updated;
      } else {
        const initialQty = variant.stock > 0 ? Math.min(quantity, variant.stock) : quantity;
        const newItem = {
          productId: product._id,
          productName: product.name,
          category: product.category,
          sku: variant.sku,
          variantAttributes: attributes,
          unitPrice: effectivePrice,
          regularPrice: variant.price,
          stock: variant.stock,
          image,
          quantity: initialQty,
          subtotal: initialQty * effectivePrice,
        };
        return [...prevItems, newItem];
      }
    });

    setIsDrawerOpen(true);
  };

  /**
   * Remove item by SKU
   */
  const removeFromCart = (sku) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  /**
   * Update quantity of an item
   */
  const updateQuantity = (sku, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(sku);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const qty = item.stock > 0 ? Math.min(newQuantity, item.stock) : newQuantity;
          return {
            ...item,
            quantity: qty,
            subtotal: qty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  /**
   * Clear all cart contents
   */
  const clearCart = () => {
    setItems([]);
  };

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Computed values
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  // Free delivery above ₹999; otherwise standard ₹49
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        toggleDrawer,
        openDrawer,
        closeDrawer,
        subtotal,
        totalItemsCount,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
