import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./CategoryProduct.css";

const API = "http://localhost:5001";

const normalize = (str) => str?.toLowerCase().trim();

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    addToCart,
    removeFromCart,
    isInCart,
    getCartItem,
  } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FETCH PRODUCTS (optimized)
  const fetchProducts = useCallback(async () => {
    if (!category) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API}/api/products/category/${normalize(category)}`
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.products)) {
        throw new Error("Invalid API response");
      }

      setProducts(data.products);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!category) {
    return <h2 className="center">Category not found</h2>;
  }

  // 🔐 LOGIN CHECK
  const checkLogin = () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  return (
    <div className="category-products">
      <h2 className="category-title">
        {category.charAt(0).toUpperCase() + category.slice(1)} Products
      </h2>

      {loading ? (
        <p className="center">Loading...</p>
      ) : error ? (
        <p className="center error">{error}</p>
      ) : products.length === 0 ? (
        <p className="center">No products found in "{category}"</p>
      ) : (
        <div className="products-grid">
          {products.map((item) => {
            const size = item.sizes?.length ? item.sizes[0] : "Free";
            const productId = item._id;

            const inCart = isInCart(productId, size);
            const cartItem = getCartItem(productId, size);

            return (
              <div className="product-card" key={productId}>

                {/* IMAGE */}
                <img
                  src={item.image || "https://via.placeholder.com/200"}
                  alt={item.name}
                  className="product-image"
                  onClick={() =>
                    navigate(`/product/${productId}`)
                  }
                />

                <div className="product-info">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-price">₹{item.price}</p>

                  {/* 🔥 BUTTONS */}
                  <div className="btn-group">

                    {/* ADD / REMOVE */}

                   <button
                     className="product-btn"
                     onClick={async (e) => {
                     e.stopPropagation();

                      if (!user) {
                          alert("Login first");
                          navigate("/login");
                          return;
                        }

                     if (inCart && cartItem) {
                        await removeFromCart(cartItem._id);
                    } else {
                          await addToCart({
                          _id: productId,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          size,
                          quantity: 1,
                        });
                      }
                    }}
                    >
                    {inCart ? "Remove" : "Add to Cart"}
                  </button>

                    {/* BUY NOW */}
                    <button
                      className="buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!checkLogin()) return;

                        navigate("/payment", {
                          state: {
                            products: [
                              {
                                ...item,
                                size,
                                quantity: 1,
                              },
                            ],
                            totalPrice: item.price,
                          },
                        });
                      }}
                    >
                      Buy Now
                    </button>

                  </div>
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