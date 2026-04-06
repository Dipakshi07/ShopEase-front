import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import "./Home.css";

const Home = () => {
  const navigate = useNavigate(); // ✅ hook

  return (
    <section id="home" className="home">
      <div className="home-container">

        {/* Left Content */}
        <div className="home-content">
          <h1>
            Discover the Best Products for <span>Your Lifestyle</span>
          </h1>

          <p>
            Shop from a wide range of premium products with unbeatable prices,
            fast delivery, and top-notch quality.
          </p>

          <div className="home-buttons">
            {/* ✅ Navigate to Shop */}
            <button 
              className="btn primary"
              onClick={() => navigate("/shop")}
            >
              Shop Now
            </button>

            {/* ✅ Navigate to Deals */}
            <button 
              className="btn secondary"
              onClick={() => navigate("/deal")}
            >
              Explore Deals
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="home-image">
          <img
            src="https://images.herzindagi.info/image/2023/Jul/Udaipur-shopping-street.jpg"
            alt="Shopping"
          />
        </div>

      </div>
    </section>
  );
};

export default Home;