import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Deal.css";

const API = "http://localhost:5001";
const USER_ID = "demoUser"; // ⚠️ replace after login

const Deal = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH DEALS FROM BACKEND
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch deals");
        }

        const data = await res.json();

        // 🔥 FILTER DEAL PRODUCTS
        const dealItems = data.filter(
          (p) => p.category?.toLowerCase() === "deal"
        );

        setDeals(dealItems);
      } catch (err) {
        console.error(err);
        setError("Unable to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // 🛒 ADD TO CART (BACKEND)
  const handleAddToCart = async (deal) => {
    try {
      await fetch(`${API}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: deal._id,
          name: deal.name,
          price: deal.price,
          image: deal.image,
          size: deal.sizes?.[0] || "Free",
          quantity: 1,
          userId: USER_ID
        })
      });

      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  // 💳 BUY NOW
  const handleBuyNow = (deal) => {
    navigate("/payment", {
      state: { product: { ...deal, size: deal.sizes?.[0] || "Free" } }
    });
  };

  // 🔄 LOADING
  if (loading) return <h2>Loading deals...</h2>;

  // ❌ ERROR
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

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

                {/* CLICK → PRODUCT DETAILS */}
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
                  <p>{deal.description}</p>
                  <p className="price">₹{deal.price}</p>

                  {/* ADD TO CART */}
                  <button
                    className="add-btn"
                    onClick={() => handleAddToCart(deal)}
                  >
                    Add to Cart
                  </button>

                  {/* BUY NOW */}
                  <button
                    className="buy-btn"
                    onClick={() => handleBuyNow(deal)}
                  >
                    Buy Now
                  </button>

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