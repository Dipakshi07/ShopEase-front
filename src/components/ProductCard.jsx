import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(`/product/${product.id}`)}>
      <img src={product.image} alt="" />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
    </div>
  );
};

export default ProductCard;