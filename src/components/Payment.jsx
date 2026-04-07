import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "https://e-commerce-backend-3-ot7q.onrender.com";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { product, products, totalPrice } = location.state || {};

  const items = products || (product ? [product] : []);

  // ✅ GET USER
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (items.length === 0) {
    return <h2>No product selected</h2>;
  }

  // 💰 CALCULATE TOTAL
  const finalTotal =
    totalPrice ||
    items.reduce((total, item) => {
      const discount = item.discount || 0;
      const discountAmount = (item.price * discount) / 100;
      return total + (item.price - discountAmount);
    }, 0);

  // 🔗 SAVE ORDER TO BACKEND
  const handlePayment = async () => {
    try {
      if (!userId) {
        alert("Please login first");
        return navigate("/login");
      }

      setLoading(true);

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          products: items,
          totalPrice: finalTotal
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      console.log("Order saved:", data);

      // ✅ MOVE TO PAYMENT PAGE
      navigate("/upi-payment", {
        state: { items, finalTotal }
      });

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {items.map((item) => {
        const discount = item.discount || 0;
        const discountAmount = (item.price * discount) / 100;
        const finalPrice = item.price - discountAmount;

        return (
          <div
            key={item._id}
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

              {item.discountText && (
                <p style={{ color: "green" }}>{item.discountText}</p>
              )}

              <p>Discount: ₹{discountAmount}</p>
              <p>Final: ₹{finalPrice}</p>
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