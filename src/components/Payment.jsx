import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "https://e-commerce-backend-3-ot7q.onrender.com";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const { product, products, totalPrice } = location.state || {};
  const items = products || (product ? [product] : []);

  // ✅ REDIRECT IF NO DATA
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  if (!items || items.length === 0) return null;

  // 💰 TOTAL (🔥 FIXED WITH QUANTITY)
  const finalTotal =
    totalPrice ||
    items.reduce((total, item) => {
      const discount = item.discount || 0;
      const qty = item.quantity || 1;

      const discountAmount = (item.price * discount) / 100;
      const finalPrice = item.price - discountAmount;

      return total + finalPrice * qty; // ✅ FIX
    }, 0);

  // 💳 PAYMENT
  const handlePayment = async () => {
    try {
      if (!user || !user._id) {
        alert("Please login first");
        return navigate("/login");
      }

      setLoading(true);

      // ✅ CLEAN PRODUCTS (SAFE)
      const cleanProducts = items
        .map((item) => ({
          productId: item._id || item.id,
          name: item.name || "Product",
          price: item.price || 0,
          image: item.image || "",
          size: item.size || "Free",
          quantity: item.quantity || 1,
        }))
        .filter((item) => item.productId);

      if (cleanProducts.length === 0) {
        throw new Error("No valid products to order");
      }

      const orderData = {
        userId: user._id,
        products: cleanProducts,
        totalPrice: finalTotal,
      };

      console.log("📦 Sending Order:", orderData);

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Backend Error:", data);
        throw new Error(data.message || "Order failed");
      }

      console.log("✅ Order saved:", data);

      navigate("/upi-payment", {
        state: { items, finalTotal },
      });

    } catch (err) {
      console.error("❌ Payment Error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {items.map((item, index) => {
        const discount = item.discount || 0;
        const qty = item.quantity || 1;

        const discountAmount = (item.price * discount) / 100;
        const finalPrice = item.price - discountAmount;

        return (
          <div
            key={item._id || index} // ✅ FIXED
            style={{
              display: "flex",
              gap: "20px",
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <img
              src={item.image || "https://via.placeholder.com/120"}
              alt={item.name}
              width="120"
            />

            <div>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {qty}</p>

              {item.discountText && (
                <p style={{ color: "green" }}>{item.discountText}</p>
              )}

              <p>Discount: ₹{discountAmount}</p>
              <p>Final (1 item): ₹{finalPrice}</p>

              {/* 🔥 TOTAL PER PRODUCT */}
              <p style={{ fontWeight: "bold" }}>
                Total: ₹{finalPrice * qty}
              </p>
            </div>
          </div>
        );
      })}

      <h2>Total Payable: ₹{finalTotal}</h2>

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Proceed to Pay"}
      </button>
    </div>
  );
};

export default Payment;