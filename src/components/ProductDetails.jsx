import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// ✅ Base API URL (BEST PRACTICE)
const API = "https://e-commerce-backend-3-ot7q.onrender.com/";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [size, setSize] = useState(null);
  const [rating, setRating] = useState(0);

  // 🔗 CONNECT TO BACKEND
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        console.log("Fetched Product:", data);

        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🧠 STATES
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>;
  }

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Product not found</h2>;
  }

  // 🛒 ADD TO CART (LOCAL CONTEXT)
  const handleCart = () => {
    addToCart({
      ...product,
      size: size || "Free"
    });
    alert("Added to cart");
  };

  // 💳 BUY NOW
  const handleBuy = () => {
    navigate("/payment", {
      state: { product: { ...product, size: size || "Free" } }
    });
  };

  return (
    <div className="details-container">
      {/* IMAGE */}
      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
      />

      <div className="info">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>

        <p>⭐ {product.rating || 4}</p>

        {/* OPTIONAL DATA */}
        {product.material && (
          <p><b>Material:</b> {product.material}</p>
        )}

        {product.features?.length > 0 && (
          <ul>
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}

        {/* SIZE */}
        {product.sizes?.length > 0 ? (
          <div>
            <h4>Select Size:</h4>
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={size === s ? "active" : ""}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <p><b>Size:</b> Free Size</p>
        )}

        {/* BUTTONS */}
        <button onClick={handleCart} className="cart">
          Add to Cart
        </button>

        <button onClick={handleBuy} className="buy">
          Buy Now
        </button>

        {/* RATING */}
        <div>
          <h4>Rate Product:</h4>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer", fontSize: "20px" }}
            >
              {star <= rating ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .details-container {
          display: flex;
          gap: 30px;
          padding: 20px;
          flex-wrap: wrap;
        }
        img {
          width: 350px;
          border-radius: 10px;
          object-fit: cover;
        }
        .info { max-width: 400px; }
        .price { color: green; font-size: 22px; }
        button { margin: 5px; padding: 10px; cursor: pointer; }
        .active { background: black; color: white; }
        .cart { background: orange; }
        .buy { background: green; color: white; }

        @media(max-width:768px){
          .details-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}