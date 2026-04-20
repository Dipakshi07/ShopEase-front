import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetails.css";

const API = "https://shop-ease-front-8tkg.vercel.app";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getCartItem,
    removeFromCart, // ✅ ADD THIS IN CONTEXT
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [size, setSize] = useState("Free");
  const [rating, setRating] = useState(0);

  // 🔗 FETCH PRODUCT
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        setProduct(data);

        if (data.sizes?.length > 0) {
          setSize(data.sizes[0]);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  if (error) return <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>;
  if (!product) return <h2 style={{ padding: "20px" }}>Product not found</h2>;

  // ✅ CART ITEM CHECK
  const cartItem = getCartItem(product._id, size);
  const isInCart = !!cartItem;

  // 🛒 ADD / REMOVE TOGGLE
  const handleCart = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (isInCart) {
      removeFromCart(product._id, size);
    } else {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
      });
    }
  };

  // 💳 BUY NOW FIXED
  const handleBuy = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        products: [
          {
            ...product,
            size,
            quantity: 1,
          },
        ],
        totalPrice: product.price,
      },
    });
  };

  return (
    <div className="details-container">

      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
      />

      <div className="info">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>

        <p>⭐ {product.rating || 4}</p>

        {product.material && (
          <p><b>Material:</b> {product.material}</p>
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
        <div style={{ marginTop: "15px" }}>

          <button onClick={handleCart} className={isInCart ? "remove" : "cart"}>
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>

          <button onClick={handleBuy} className="buy">
            Buy Now
          </button>

          {/* QUANTITY */}
          {isInCart && (
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={() => decreaseQuantity(product._id, size)}>-</button>
              <span>{cartItem.quantity}</span>
              <button onClick={() => increaseQuantity(product._id, size)}>+</button>
            </div>
          )}
        </div>

        {/* RATING */}
        <div>
          <h4>Rate Product:</h4>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className="star"
            >
              {star <= rating ? "⭐" : "☆"}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}