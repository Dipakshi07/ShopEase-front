import React from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
import { products } from "../data/products"; // ✅ IMPORT PRODUCTS

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

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
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

            // ✅ Filter products for this category (max 2 preview)
            const categoryProducts = products
              .filter((item) => item.category === cat.name)
              .slice(0, 2);

            return (
              <div
                className="category-card"
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <img src={cat.image} alt={cat.name} className="category-icon" />

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


                {/* ✅ SAFE PRODUCT PREVIEW */}
                <div className="product-preview">
                  {categoryProducts.length > 0 ? (
                    categoryProducts.map((p) => (
                      <img key={p.id} src={p.image} alt={p.name} />
                    ))
                  ) : (
                    <p>No products</p> // fallback
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(cat.name);
                  }}
                >
                  View Products
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Categories;