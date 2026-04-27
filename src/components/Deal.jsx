import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Deal.css";

const API = "http://localhost:5001";

const normalize = (str) => str?.toLowerCase().trim();

const Deal = () => {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FETCH DEALS (clean + safe)
  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/api/products`);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      if (!data || !Array.isArray(data.products)) {
        throw new Error("Invalid API response");
      }

      const products = data.products;

      // ✅ better logic: use discount instead of category
      const dealItems = products.filter(
        (p) => (p.discount || 0) > 0
      );

      setDeals(dealItems.length ? dealItems : products.slice(0, 4));

    } catch (err) {
      console.error(err);
      setError("Unable to load deals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // 🔐 LOGIN CHECK
  const checkLogin = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  // 🛒 ADD TO CART (safe)
  const handleAddToCart = async (deal) => {
    if (!checkLogin()) return;

    try {
      await addToCart({
        _id: deal._id,
        name: deal.name,
        price: deal.price,
        image: deal.image,
        size: deal.sizes?.[0] || "Free",
        quantity: 1,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  // 💳 BUY NOW
  const handleBuyNow = (deal) => {
    if (!checkLogin()) return;

    navigate("/payment", {
      state: {
        products: [
          {
            ...deal,
            size: deal.sizes?.[0] || "Free",
            quantity: 1,
          },
        ],
        totalPrice: deal.price,
      },
    });
  };

  // 🔄 STATES
  if (loading) return <h2 className="center">Loading deals...</h2>;
  if (error) return <h2 className="center error">{error}</h2>;

  return (
    <section id="deals" className="deals">
      <div className="deals-container">

        <div className="deals-header">
          <h2>Hot Deals</h2>
          <p>Don’t miss out on these limited-time offers</p>
        </div>

        <div className="deals-grid">
          {deals.length === 0 ? (
            <p>No deals available</p>
          ) : (
            deals.map((deal) => (
              <div className="deal-card" key={deal._id}>

                {/* IMAGE */}
                <img
                  src={deal.image || "https://via.placeholder.com/200"}
                  alt={deal.name}
                  onClick={() => navigate(`/product/${deal._id}`)}
                  style={{ cursor: "pointer" }}
                />

                <div className="deal-content">
                  <span className="deal-badge">
                    {deal.discountText || "Hot Deal"}
                  </span>

                  <h3>{deal.name}</h3>
                  <p>{deal.description || "No description available"}</p>

                  <p className="price">₹{deal.price}</p>

                  <div className="deal-buttons">
                    <button
                      className="add-btn"
                      onClick={() => handleAddToCart(deal)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="buy-btn"
                      onClick={() => handleBuyNow(deal)}
                    >
                      Buy Now
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default Deal;