import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

const API = "https://e-commerce-backend-3-ot7q.onrender.com/api/cart";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔥 LOAD CART
  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 FETCH CART
  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`${API}/${userId}`);
      const data = await res.json();

      setCartItems(data || []);
    } catch (err) {
      console.error("Fetch cart error:", err.message);
    }
  };

  // 🔥 ADD TO CART
  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please login first");
        return;
      }

      await fetch(API, {
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
          size: product.size || "Free",
          quantity: 1,
        }),
      });

      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err.message);
    }
  };

  // ✅ 🔥 FIXED REMOVE
  const removeFromCart = async (productId, size) => {
    try {
      // 👉 find correct cart item
      const item = cartItems.find(
        (i) =>
          (i.productId || i._id) === productId &&
          i.size === size
      );

      if (!item) return;

      // 👉 use REAL cart item id
      await fetch(`${API}/${item._id}`, {
        method: "DELETE",
      });

      fetchCart();
    } catch (err) {
      console.error("Remove error:", err.message);
    }
  };

  // 🔥 INCREASE
  const increaseQuantity = async (id, size) => {
    const item = cartItems.find(
      (i) =>
        (i.productId || i._id) === id &&
        i.size === size
    );

    if (!item) return;

    await updateQty(item._id, item.quantity + 1);
  };

  // 🔥 DECREASE
  const decreaseQuantity = async (id, size) => {
    const item = cartItems.find(
      (i) =>
        (i.productId || i._id) === id &&
        i.size === size
    );

    if (!item || item.quantity <= 1) return;

    await updateQty(item._id, item.quantity - 1);
  };

  // 🔥 UPDATE QTY
  const updateQty = async (cartItemId, quantity) => {
    try {
      const userId = localStorage.getItem("userId");

      await fetch(`${API}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          userId,
          quantity,
        }),
      });

      fetchCart();
    } catch (err) {
      console.error("Update qty error:", err.message);
    }
  };

  // ✅ FIXED isInCart
  const isInCart = (id, size) => {
    return cartItems.some(
      (item) =>
        (item.productId || item._id) === id &&
        item.size === size
    );
  };

  // ✅ FIXED getCartItem
  const getCartItem = (id, size) => {
    return cartItems.find(
      (item) =>
        (item.productId || item._id) === id &&
        item.size === size
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartItem,
        isInCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};