import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import "../../styles/ProductDetail.css"; // Your CSS file

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const product = res.data;
        setProduct(product);
        setUpdatedProduct(product);
        setExistingImages(product.images);
        setExistingThumbnail(product.thumbnail);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Product deleted successfully!");
        setTimeout(() => navigate("/products"), 1000);
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("❌ Failed to delete product.");
      }
    }
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, name) => {
    const array = e.target.value.split(",").map((item) => item.trim());
    setUpdatedProduct((prev) => ({ ...prev, [name]: array }));
  };

  const handleThumbnailChange = (e) => {
    setNewThumbnail(e.target.files[0]);
    setExistingThumbnail(null);
  };

  const handleImagesChange = (e) => {
    const files = [...e.target.files];
    const total = existingImages.length + newImages.length + files.length;
    if (total > 5) {
      toast.error("❌ You can only upload up to 5 images total.");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = async (index) => {
    const imageToDelete = existingImages[index];
    try {
      await axios.post(
        `http://localhost:5000/api/products/delete-image`,
        { image: imageToDelete },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Image deleted successfully.");
      const updated = existingImages.filter((_, i) => i !== index);
      setExistingImages(updated);
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error("❌ Failed to delete image.");
    }
  };

  const removeNewImage = (index) => {
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
  };

  const removeThumbnail = async () => {
    if (!existingThumbnail) return;
    try {
      await axios.post(
        `http://localhost:5000/api/products/delete-thumbnail`,
        { thumbnail: existingThumbnail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Thumbnail deleted successfully.");
      setExistingThumbnail(null);
    } catch (err) {
      console.error("Error deleting thumbnail:", err);
      toast.error("❌ Failed to delete thumbnail.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.entries(updatedProduct).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      formData.append("existingImages", JSON.stringify(existingImages));
      formData.append("existingThumbnail", existingThumbnail || "");

      newImages.forEach((file) => formData.append("images", file));
      if (newThumbnail) formData.append("thumbnail", newThumbnail);

      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Product updated successfully!");
      setEditing(false);

      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
      setUpdatedProduct(res.data);
      setExistingImages(res.data.images);
      setExistingThumbnail(res.data.thumbnail);
      setNewImages([]);
      setNewThumbnail(null);
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("❌ Failed to update product.");
    }
  };

  if (!product) return <div className="loading-text">Loading...</div>;

  return (
    <div className="product-detail-container">
      <div className="back-link">
        <Link to="/products">
          <button className="back-link-btn">← Back to Products</button>
        </Link>
      </div>

      {!editing ? (
        <>
          {/* VIEW PRODUCT MODE */}
          <div className="product-detail-grid">
            <h2 className="product-info-header">Product Information</h2>

            <div className="product-info-section">
              <div className="product-thumbnail-section">
                <img
                  src={`http://localhost:5000${product.thumbnail}`}
                  alt={product.title}
                  className="productdetail-thumbnail"
                />
              </div>

              <div>
                <h3 className="product-title">{product.title}</h3>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Fabric:</strong> {product.fabric}</p>
                <p><strong>Pattern:</strong> {product.pattern}</p>
                <p><strong>Occasion:</strong> {product.occasion}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <div className="product-details-section">
                  <div>
                    <p><strong>Original Price:</strong> ₹{product.originalPrice}</p>
                    <p><strong>Discounted Price:</strong> ₹{product.discountedPrice}</p>
                    <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
                    <p><strong>Shipping Charges:</strong> ₹{product.shippingCharges}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                  </div>
                  <div>
                    <p><strong>Dress Code:</strong> {product.dressCode}</p>
                    <p><strong>Colors:</strong> {product.color.join(", ")}</p>
                    <p><strong>Sizes:</strong> {product.size.join(", ")}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Rating:</strong> {product.rating} ⭐ ({product.ratingCount} reviews)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="product-images-section">
              <h2>Product Images:</h2>
              <div className="product-images">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${img}`}
                    alt={`Product Image ${index + 1}`}
                    className="product-image"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleEditToggle} className="edit-btn">Edit</button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="edit-form">
          {/* EDIT MODE */}
          <h2 className="edit-form-header">Edit Product</h2>

          <div className="edit-form-grid">
            <div className="edit-form-left">
              <input type="text" name="title" value={updatedProduct.title} onChange={handleInputChange} placeholder="Title" required />
              <textarea name="description" value={updatedProduct.description} onChange={handleInputChange} placeholder="Description" required />
              <input type="number" name="originalPrice" value={updatedProduct.originalPrice} onChange={handleInputChange} placeholder="Original Price" required />
              <input type="number" name="discountedPrice" value={updatedProduct.discountedPrice} onChange={handleInputChange} placeholder="Discounted Price" required />
              <input type="text" name="returnPolicy" value={updatedProduct.returnPolicy} onChange={handleInputChange} placeholder="Return Policy" required />
              <input type="number" name="shippingCharges" value={updatedProduct.shippingCharges} onChange={handleInputChange} placeholder="Shipping Charges" required />
              <input type="text" name="brand" value={updatedProduct.brand} onChange={handleInputChange} placeholder="Brand" required />
              <input type="text" name="category" value={updatedProduct.category} onChange={handleInputChange} placeholder="Category" required />

              {/* Upload new images */}
              {existingImages.length + newImages.length < 5 && (
                <div className="image-upload">
                  <label>Upload New Images:</label>
                  <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
                </div>
              )}

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="image-preview-box">
                  <h2>Current Images</h2>
                  <div className="product-edit-images">
                    {existingImages.map((img, index) => (
                      <div className="image-wrapper" key={index}>
                        <img src={`http://localhost:5000${img}`} alt={`img-${index}`} />
                        <FaTimes className="remove-icon" onClick={() => removeExistingImage(index)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="edit-form-right">
              <input type="text" name="fabric" value={updatedProduct.fabric} onChange={handleInputChange} placeholder="Fabric" required />
              <input type="text" name="pattern" value={updatedProduct.pattern} onChange={handleInputChange} placeholder="Pattern" required />
              <input type="text" name="dressCode" value={updatedProduct.dressCode} onChange={handleInputChange} placeholder="Dress Code" required />
              <input type="text" name="occasion" value={updatedProduct.occasion} onChange={handleInputChange} placeholder="Occasion" required />
              <input type="text" name="color" value={updatedProduct.color.join(", ")} onChange={(e) => handleArrayChange(e, "color")} placeholder="Colors (comma separated)" required />
              <input type="text" name="size" value={updatedProduct.size.join(", ")} onChange={(e) => handleArrayChange(e, "size")} placeholder="Sizes (comma separated)" required />
              <input type="number" name="stock" value={updatedProduct.stock} onChange={handleInputChange} placeholder="Stock" required />
              <input type="number" name="rating" step="0.1" value={updatedProduct.rating} onChange={handleInputChange} placeholder="Rating" required />
              <input type="number" name="ratingCount" value={updatedProduct.ratingCount} onChange={handleInputChange} placeholder="Rating Count" required />

              {/* Thumbnail upload */}
              {!existingThumbnail && (
                <div className="image-upload">
                  <label>Upload New Thumbnail:</label>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                </div>
              )}

              {existingThumbnail && (
                <div className="image-preview-box">
                  <h2>Current Thumbnail</h2>
                  <div className="image-wrapper">
                    <img src={`http://localhost:5000${existingThumbnail}`} alt="thumb" />
                    <FaTimes className="remove-icon" onClick={removeThumbnail} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={handleEditToggle} className="cancel-btn">Cancel</button>
          </div>
        </form>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default ProductDetailsPage;
