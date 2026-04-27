import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const API = "http://localhost:5001";

const categories = [
  { id: 1, name: "electronics", image: "https://img.freepik.com/premium-photo/illustration-ultra-realistic-4k-image-modern-electronic-device_756405-53536.jpg" },
  { id: 2, name: "fashion", image: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
  { id: 3, name: "shoes", image: "https://addicfashion.com/wp-content/uploads/2019/06/cool-shoes-summer-ideas-for-men-that-looks-cool18.jpg" },
  { id: 4, name: "men", image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" },
  { id: 5, name: "women", image: "https://cdn-icons-png.flaticon.com/512/4140/4140047.png" },
  { id: 6, name: "boys", image: "https://cdn-icons-png.flaticon.com/512/4140/4140061.png" },
  { id: 7, name: "girls", image: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png" },
];

const normalize = (str) => str?.toLowerCase().trim();

const Categories = () => {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        if (!data || !Array.isArray(data.products)) {
          throw new Error("Invalid API response");
        }

        setAllProducts(data.products);
      } catch (err) {
        console.error(err);
        setError("Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ PREPROCESS PRODUCTS (performance)
  const categorizedProducts = useMemo(() => {
    const map = {};

    categories.forEach((cat) => {
      map[cat.name] = [];
    });

    allProducts.forEach((item) => {
      const cat = normalize(item.category);
      if (map[cat]) {
        map[cat].push(item);
      }
    });

    return map;
  }, [allProducts]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  // 🔄 STATES
  if (loading) return <h2 className="center">Loading...</h2>;
  if (error) return <h2 className="center error">{error}</h2>;

  return (
    <section className="categories-section">
      <div className="categories-container">

        <h2 className="categories-title">Shop by Categories</h2>
        <p className="categories-subtitle">
          Explore products based on your interests
        </p>

        <div className="categories-grid">
          {categories.map((cat) => {
            const previewProducts =
              categorizedProducts[cat.name]?.slice(0, 2) || [];

            return (
              <div
                className="category-card"
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-icon"
                />

                <div className="category-overlay">
                  <h3>{cat.name}</h3>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(cat.name);
                    }}
                  >
                    View Products
                  </button>
                </div>

                {/* ✅ PRODUCT PREVIEW */}
                <div className="product-preview">
                  {previewProducts.length > 0 ? (
                    previewProducts.map((p) => (
                      <img
                        key={p._id}
                        src={p.image || "https://via.placeholder.com/80"}
                        alt={p.name}
                      />
                    ))
                  ) : (
                    <p>No products</p>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Categories;