import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./UpiPayment.css";

const UpiPayment = () => {
  const location = useLocation();

  // ✅ FIX: correct data
  const { items, finalTotal } = location.state || {};

  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    if (!upiId || !selectedApp) {
      alert("Please select UPI app and enter UPI ID");
      return;
    }

    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  };

  // ✅ FIX: prevent crash
  if (!items || items.length === 0) {
    return <h2>No product found</h2>;
  }

  return (
    <div className="upi-container">
      <div className="upi-card">

        <h2 className="upi-title">UPI Payment</h2>

        {/* Products */}
        <div className="product-box">
          {items.map((item) => (
            <div key={item.id}>
              <h4>{item.title}</h4>
              <p>₹{item.price}</p>
            </div>
          ))}

          <div className="amount">Total: ₹{finalTotal}</div>
        </div>

        {/* UPI Apps */}
        <h3>Select UPI App</h3>
        <div className="upi-apps">
          {["Google Pay", "PhonePe", "Paytm"].map((app) => (
            <button
              key={app}
              className={`upi-app ${selectedApp === app ? "active" : ""}`}
              onClick={() => setSelectedApp(app)}
            >
              {app}
            </button>
          ))}
        </div>

        {/* UPI Input */}
        <input
          type="text"
          placeholder="Enter UPI ID"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="upi-input"
        />

        {/* Pay Button */}
        <button className="pay-btn" onClick={handlePayment}>
          Pay ₹{finalTotal}
        </button>

        {/* Success */}
        {success && (
          <div className="success-msg">
            ✅ Payment Successful via {selectedApp}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpiPayment;