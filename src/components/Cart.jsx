import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const API = "https://shop-ease-front-8tkg.vercel.app";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const USER_ID = localStorage.getItem("userId");

  // ✅ FETCH CART
  const fetchCart = async () => {
    if (!USER_ID) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/cart/${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [USER_ID]);

  // ❌ REMOVE FIXED
  const handleRemove = async (productId) => {
    try {
      await fetch(`${API}/api/cart/${productId}`, {
        method: "DELETE",
      });

      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ INCREASE
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  // ➖ DECREASE
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 💰 TOTAL
  const totalPrice = cartItems.reduce((total, item) => {
    const discount = item.discount || 0;
    const qty = item.quantity || 1;

    const discountAmount = (item.price * discount) / 100;
    return total + (item.price - discountAmount) * qty;
  }, 0);

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

              const discountAmount = (item.price * discount) / 100;
              const finalPrice = item.price - discountAmount;

              return (
                <div className="cart-item" key={item.productId}>
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
                      <button onClick={() => decreaseQty(item.productId)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => increaseQty(item.productId)}>+</button>
                    </div>

                    <p>Total: ₹{finalPrice * qty}</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.productId)}
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