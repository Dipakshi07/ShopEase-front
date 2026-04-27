import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const API = "https://e-commerce-backend-3-ot7q.onrender.com";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const USER_ID = localStorage.getItem("userId");

  // ✅ FETCH CART (optimized)
  const fetchCart = useCallback(async () => {
    if (!USER_ID) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/cart/${USER_ID}`);

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid cart data");
      }

      setCartItems(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load cart");
    } finally {
      setLoading(false);
    }
  }, [USER_ID]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ REMOVE (safe + consistent)
  const handleRemove = async (cartItemId) => {
    try {
      const res = await fetch(`${API}/api/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setCartItems((prev) =>
        prev.filter((item) => item._id !== cartItemId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  // ✅ UPDATE QTY (Optimistic UI)
  const updateQty = async (cartItemId, newQty) => {
    // optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === cartItemId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    try {
      const res = await fetch(`${API}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          userId: USER_ID,
          quantity: newQty,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");

      // rollback
      fetchCart();
    }
  };

  const increaseQty = (item) => {
    updateQty(item._id, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity <= 1) return;
    updateQty(item._id, item.quantity - 1);
  };

  // 💰 TOTAL
  const totalPrice = cartItems.reduce((total, item) => {
    const discount = item.discount || 0;
    const qty = item.quantity || 1;

    const finalPrice =
      item.price - (item.price * discount) / 100;

    return total + finalPrice * qty;
  }, 0);

  // 🔄 STATES
  if (loading) return <h2 style={{ padding: "20px" }}>Loading cart...</h2>;
  if (error) return <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>;

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => {
              const discount = item.discount || 0;
              const qty = item.quantity || 1;

              const finalPrice =
                item.price - (item.price * discount) / 100;

              return (
                <div className="cart-item" key={item._id}>
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                  />

                  <div className="cart-details">
                    <h4>{item.name}</h4>
                    <p>Price: ₹{item.price}</p>
                    <p>Size: {item.size || "Free"}</p>

                    {item.discountText && (
                      <p className="discount">{item.discountText}</p>
                    )}

                    <p>Final: ₹{finalPrice}</p>

                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => increaseQty(item)}>+</button>
                    </div>

                    <p>Total: ₹{finalPrice * qty}</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Total Payable: ₹{totalPrice}</h3>

            <button
              className="buy-btn"
              onClick={() =>
                navigate("/payment", {
                  state: { products: cartItems, totalPrice },
                })
              }
            >
              Proceed to Pay
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;