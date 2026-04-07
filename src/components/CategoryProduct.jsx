import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CategoryProduct.css";


const API = "https://e-commerce-backend-3-ot7q.onrender.com"; 

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    if (!categoryName) return;

    setLoading(true);

    fetch(`${API}/api/products?category=${categoryName}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

  }, [categoryName]);

  // ✅ HANDLE INVALID CATEGORY
  if (!categoryName) {
    return <h2 style={{ padding: "20px" }}>Category not found</h2>;
  }

  return (
    <div className="category-products">

      {/* ✅ TITLE */}
      <h2 className="category-title">
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Products
      </h2>

      {/* ✅ LOADING */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No products found in "{categoryName}"
        </p>
      ) : (

        <div className="products-grid">
          {products.map((item) => {

            const size = item.sizes?.[0] || "Free";
            const inCart = isInCart(item._id || item.id, size);

            return (
              <div className="product-card" key={item._id || item.id}>

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                  onClick={() => navigate(`/product/${item._id || item.id}`)}
                  style={{ cursor: "pointer" }}
                />

                <div className="product-info">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-price">₹{item.price}</p>

                  {/* CART BUTTON */}
                  <button
                    className={`product-btn ${inCart ? "remove" : ""}`}
                    onClick={() =>
                      inCart
                        ? removeFromCart(item._id || item.id, size)
                        : addToCart({ ...item, size })
                    }
                  >
                    {inCart ? "Remove from Cart" : "Add to Cart"}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      )}

    </div>
  );
};

export default CategoryProducts;