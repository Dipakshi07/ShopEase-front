import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UpiPayment.css";

const UpiPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { items, finalTotal } = location.state || {};

  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ✅ redirect if no data
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  if (!items || items.length === 0) return null;

  // 💳 PAYMENT
  const handlePayment = () => {
    if (processing || success) return;

    if (!upiId || !selectedApp) {
      alert("Please select UPI app and enter UPI ID");
      return;
    }

    if (!upiId.includes("@")) {
      alert("Enter valid UPI ID (example@upi)");
      return;
    }

    setProcessing(true);

    // ⏳ fake payment delay
    setTimeout(() => {
      setSuccess(true);
      setProcessing(false);

      // 🔥 AUTO REDIRECT AFTER SUCCESS
      setTimeout(() => {
        navigate("/"); // or "/orders" if you have order page
      }, 2000);

    }, 1500);
  };

  return (
    <div className="upi-container">
      <div className="upi-card">

        <h2 className="upi-title">UPI Payment</h2>

        {/* Products */}
        <div className="product-box">
          {items.map((item) => (
            <div key={item._id}>
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity || 1}</p>
              <p>₹{item.price}</p>
            </div>
          ))}

          <div className="amount">
            Total: ₹{finalTotal}
          </div>
        </div>

        {/* UPI Apps */}
        <h3>Select UPI App</h3>
        <div className="upi-apps">
          {["Google Pay", "PhonePe", "Paytm"].map((app) => (
            <button
              key={app}
              className={`upi-app ${selectedApp === app ? "active" : ""}`}
              onClick={() => setSelectedApp(app)}
              disabled={processing || success}
            >
              {app}
            </button>
          ))}
        </div>

        {/* UPI Input */}
        <input
          type="text"
          placeholder="Enter UPI ID (example@upi)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="upi-input"
          disabled={processing || success}
        />

        {/* Pay Button */}
        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={processing || success}
        >
          {processing
            ? "Processing..."
            : success
            ? "Paid ✔"
            : `Pay ₹${finalTotal}`}
        </button>

        {/* Success */}
        {success && (
          <div className="success-msg">
            ✅ Payment Successful via {selectedApp}
            <br />
            Redirecting...
          </div>
        )}

      </div>
    </div>
  );
};

export default UpiPayment;