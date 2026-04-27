import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const API = "https://e-commerce-backend-3-ot7q.onrender.com";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const userId = localStorage.getItem("userId");

  // ✅ FETCH CART FROM BACKEND
  const fetchCart = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API}/api/cart/${userId}`);
      const data = await res.json();
      setCart(data || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    try {
      const res = await fetch(`${API}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: product.size,
          quantity: product.quantity || 1,
        }),
      });

      if (!res.ok) throw new Error("Add failed");

      await fetchCart(); // 🔥 refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ REMOVE
  const removeFromCart = async (cartItemId) => {
    try {
      const res = await fetch(`${API}/api/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Remove failed");

      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CHECK
  const isInCart = (productId, size) => {
    return cart.some(
      (item) =>
        item.productId === productId && item.size === size
    );
  };

  // ✅ GET ITEM
  const getCartItem = (productId, size) => {
    return cart.find(
      (item) =>
        item.productId === productId && item.size === size
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isInCart,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);