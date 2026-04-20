import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Shop.css";

const API = "https://shop-ease-front-8tkg.vercel.app";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    addToCart,
    removeFromCart,
    isInCart, // now SAFE
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading products...</h2>;
  if (error) return <h2 style={{ padding: "20px" }}>{error}</h2>;

  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <section id="shop" className="shop">
      <div className="shop-container">

        <div className="shop-header">
          <h2>Popular Products</h2>

          <button
            className="view-all"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>

        <div className="shop-grid">
          {visibleProducts.map((product) => {
            const size = product.sizes?.[0] || "Free";

            const inCart = isInCart(product._id, size);

            return (
              <div className="shop-card" key={product._id}>

                <img
                  src={product.image || "https://via.placeholder.com/200"}
                  alt={product.name}
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                  style={{ cursor: "pointer" }}
                />

                <div className="shop-info">
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>

                  <button
                    onClick={() =>
                      inCart
                        ? removeFromCart(product._id, size)
                        : addToCart({ ...product, size })
                    }
                    className={inCart ? "remove-btn" : ""}
                  >
                    {inCart ? "Remove from Cart" : "Add to Cart"}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Shop;