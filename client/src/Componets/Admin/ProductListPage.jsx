import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Product.css";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const viewProduct = (id) => {
    navigate(`/products/${id}`);
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Our Products</h2>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          <button className="refresh-btn">Refresh</button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="card-image-container">
                <img
                  src={`http://localhost:5000${product.thumbnail}`}
                  alt={product.title}
                  className="product-thumbnail"
                />
          
              </div>
              <div className="card-body">
                <h4 className="product-title">{product.title} <br/> {product.dressCode}</h4>
                <div className="price-section">
                  <span className="current-price">₹{product.discountedPrice}</span>
                  
                    <span className="original-price">₹{product.originalPrice}</span>
                 
                </div>
                
                <div className="card-actions">
                  <button
                    className="view-product-btn"
                    onClick={() => viewProduct(product._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;