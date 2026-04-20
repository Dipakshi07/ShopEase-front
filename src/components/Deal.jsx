import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Deal.css";

const API = "https://e-commerce-backend-3-ot7q.onrender.com";
const USER_ID = "demoUser";

const Deal = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH DEALS
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch deals");
        }

        const data = await res.json();
        console.log("API DATA:", data);

        // ✅ HANDLE BOTH CASES (array OR object)
        const products = Array.isArray(data) ? data : data.products || [];

        // ✅ FLEXIBLE FILTER (fix main issue)
        const dealItems = products.filter((p) =>
          p.category?.toLowerCase().includes("deal")
        );

        // ✅ FALLBACK (if no deals found)
        setDeals(dealItems.length > 0 ? dealItems : products.slice(0, 4));

      } catch (err) {
        console.error(err);
        setError("Unable to load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // 🛒 ADD TO CART
  const handleAddToCart = async (deal) => {
    try {
      await fetch(`${API}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: deal._ID,
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
  if (loading) return <h2 style={{ padding: "20px" }}>Loading deals...</h2>;

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
              <div className="deal-card" key={deal._ID}>

                {/* IMAGE CLICK */}
                <img
                  src={deal.image || "https://via.placeholder.com/200"}
                  alt={deal.name}
                  onClick={() => navigate(`/product/${deal._ID}`)}
                  style={{ cursor: "pointer" }}
                />

                <div className="deal-content">
                  <span className="deal-badge">
                    {deal.discountText || "Hot Deal"}
                  </span>

                  <h3>{deal.name}</h3>
                  <p>{deal.description}</p>
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