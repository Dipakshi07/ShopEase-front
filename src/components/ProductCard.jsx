import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // ✅ fix: use _id
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img
        src={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
    </div>
  );
};

export default ProductCard;