import React from "react";
import { useNavigate } from "react-router-dom";
import { products } from "./App";

export default function Home() {
  const navigate = useNavigate();

  const renderSection = (title, type) => (
    <div>
      <h2>{title}</h2>
      <div className="grid">
        {products
          .filter((p) => p.category === type)
          .map((p) => (
            <div key={p.id} className="card" onClick={() => navigate(`/product/${p.id}`)}>
              <img src={p.image} alt="" />
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="container">
      {renderSection("Categories", "category")}
      {renderSection("Shop", "shop")}
      {renderSection("Deals", "deal")}

      <style>{`
        .container { padding: 20px; }
        .grid { display: flex; gap: 20px; flex-wrap: wrap; }
        .card {
          width: 200px;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: 0.3s;
        }
        .card:hover { transform: scale(1.05); } 
        img { width: 100%; }
      `}</style>
    </div>
  );
}
