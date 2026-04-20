import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const API = "https://shop-ease-front-8tkg.vercel.app"; // ✅ backend

const categories = [
  { id: 1, name: "electronics", image: "https://img.freepik.com/premium-photo/illustration-ultra-realistic-4k-image-modern-electronic-device_756405-53536.jpg" },
  { id: 2, name: "fashion", image: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
  { id: 3, name: "shoes", image: "https://addicfashion.com/wp-content/uploads/2019/06/cool-shoes-summer-ideas-for-men-that-looks-cool18.jpg" },
  { id: 4, name: "men", image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" },
  { id: 5, name: "women", image: "https://cdn-icons-png.flaticon.com/512/4140/4140047.png" },
  { id: 6, name: "boys", image: "https://cdn-icons-png.flaticon.com/512/4140/4140061.png" },
  { id: 7, name: "girls", image: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png" },
];

const Categories = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();

        // ⚠️ because backend returns { products: [...] }
        setAllProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <section className="categories-section">
      <div className="categories-container">

        <h2 className="categories-title">Shop by Categories</h2>
        <p className="categories-subtitle">
          Explore products based on your interests
        </p>

        <div className="categories-grid">
          {categories.map((cat) => {

            // ✅ FILTER FROM BACKEND DATA
            const categoryProducts = allProducts
              .filter(
                (item) =>
                  item.category?.toLowerCase().trim() ===
                  cat.name.toLowerCase().trim()
              )
              .slice(0, 2);

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
                  {categoryProducts.length > 0 ? (
                    categoryProducts.map((p) => (
                      <img
                        key={p._id}
                        src={p.image}
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