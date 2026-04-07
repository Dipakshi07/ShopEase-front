import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

// ✅ BASE API URL
const API = "https://e-commerce-backend-3-ot7q.onrender.com/";

// ⚠️ TEMP USER (replace after login)
const USER_ID = "demoUser";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH CART FROM BACKEND
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API}/api/cart/${USER_ID}`);

        if (!res.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await res.json();
        console.log("Cart Data:", data);

        setCartItems(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ❌ REMOVE ITEM (BACKEND)
  const handleRemove = async (cartId) => {
    try {
      await fetch(`${API}/api/cart/${cartId}`, {
        method: "DELETE",
      });

      // update UI
      setCartItems((prev) =>
        prev.filter((item) => item._id !== cartId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 💰 TOTAL PRICE
  const totalPrice = cartItems.reduce((total, item) => {
    const discount = item.discount || 0;
    const quantity = item.quantity || 1;

    const discountAmount = (item.price * discount) / 100;
    return total + (item.price - discountAmount) * quantity;
  }, 0);

  // 🔄 LOADING
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading cart...</h2>;
  }

  // ❌ ERROR
  if (error) {
    return <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>;
  }

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
              const quantity = item.quantity || 1;

              const discountAmount = (item.price * discount) / 100;
              const finalPrice = item.price - discountAmount;

              return (
                <div className="cart-item" key={item._id}>
                  {/* ✅ SAFE IMAGE */}
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                  />

                  <div className="cart-details">
                    <h4>{item.name}</h4>
                    <p>Price: ₹{item.price}</p>

                    <p>Size: {item.size || "Free"}</p>

                    {item.discountText && (
                      <p className="discount">
                        {item.discountText}
                      </p>
                    )}

                    <p>Final: ₹{finalPrice}</p>
                    <p>Qty: {quantity}</p>
                  </div>

                  {/* ❌ REMOVE */}
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

          {/* 💰 SUMMARY */}
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
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;