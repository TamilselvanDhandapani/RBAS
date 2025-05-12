import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/DressDetail.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const { dispatch } = useContext(CartContext);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setSelectedSize(res.data?.size?.[0] || "");
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error("Unable to load product. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    if (!selectedSize) {
      toast.warning("Please select a size before adding to the cart.");
      return;
    }

    // ✅ Fix: Convert color array to single string
    const color = Array.isArray(product.color) ? product.color[0] : product.color || "";

    const payload = {
      id: product._id,
      title: product.title,
      price: product.discountedPrice,
      selectedSize,
      color,
      thumbnail: `http://localhost:5000${product.thumbnail}`,
      quantity: 1,
    };

    try {
      dispatch({ type: "ADD_ITEM", payload });

      await axios.post("http://localhost:5000/api/cart", {
        userId: user._id,
        productId: product._id,
        selectedSize,
        quantity: 1,
        color, // ✅ Send as string
        thumbnail: payload.thumbnail,
      });

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!product) {
    return <div className="loading-message">Loading product details...</div>;
  }

  const {
    title,
    images,
    description,
    originalPrice,
    discountedPrice,
    rating,
    ratingCount,
    fabric,
    dressCode,
    occasion,
    returnPolicy,
    shippingCharges,
    brand,
    category,
    color,
    size,
    stock,
  } = product;

  return (
    <div className="product-details-container">
      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="thumbnails">
          {images?.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000${image}`}
              alt={`Product ${index + 1}`}
              className={`thumbnail ${selectedImageIndex === index ? "active" : ""}`}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>
        <div className="main-image">
          <img
            src={`http://localhost:5000${images?.[selectedImageIndex]}`}
            alt="Selected Product"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="details">
        <h1>{title}</h1>
        <p className="description">{description}</p>

        <div className="pricing">
          <p><strong>Original Price:</strong> ₹{originalPrice}</p>
          <p><strong>Discounted Price:</strong> ₹{discountedPrice}</p>
        </div>

        <div className="meta">
          <p><strong>Rating:</strong> {rating} ⭐ ({ratingCount} reviews)</p>
          <p><strong>Fabric:</strong> {fabric}</p>         
          <p><strong>Occasion:</strong> {occasion}</p>
          <p><strong>Return Policy:</strong> {returnPolicy}</p>         
          <p><strong>Brand:</strong> {brand}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Colors:</strong> {Array.isArray(color) ? color.join(", ") : color}</p>
          <p><strong>Sizes Available:</strong> {size?.join(", ") || "N/A"}</p>
          <p><strong>Stock Left:</strong> {stock}</p>
        </div>

        {/* Size Selection */}
        {size?.length > 0 && (
          <>
            <h4>Select Size</h4>
            <div className="size-options">
              {size.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${selectedSize === s ? "selected" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="selected-size">
              Selected Size: <strong>{selectedSize}</strong>
            </p>
          </>
        )}

        {/* Add to Cart Button */}
        <button
          className="add-to-cart-btn"
          disabled={!selectedSize || stock === 0}
          onClick={handleAddToCart}
        >
          {stock === 0 ? "Out of Stock" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
