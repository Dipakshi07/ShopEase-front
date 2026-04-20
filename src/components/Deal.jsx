import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Deal.css";

const API = "https://e-commerce-backend-3-ot7q.onrender.com";

const Deal = () => {
  const navigate = useNavigate();

  const { addToCart } = useCart(); // ✅ use context

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH DEALS
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        if (!res.ok) throw new Error("Failed to fetch deals");

        const data = await res.json();

        const products = Array.isArray(data)
          ? data
          : data.products || [];

        // ✅ safer filter
        const dealItems = products.filter((p) =>
          p.category?.toLowerCase().includes("deal")
        );

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

  // 🛒 ADD TO CART (FIXED)
  const handleAddToCart = (deal) => {
    addToCart({
      _id: deal._id, // ✅ FIX
      name: deal.name,
      price: deal.price,
      image: deal.image,
      size: deal.sizes?.[0] || "Free",
    });

    alert("Added to cart");
  };

  // 💳 BUY NOW
  const handleBuyNow = (deal) => {
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