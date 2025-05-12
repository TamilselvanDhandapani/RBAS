import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/ProductForm.css";
import { useAuth } from "../../context/AuthContext";

const ProductForm = () => {

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [shippingCharges, setShippingCharges] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [fabric, setFabric] = useState("");
  const [pattern, setPattern] = useState("");
  const [rating, setRating] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [occasion, setOccasion] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [ratingCount, setRatingCount] = useState("");

  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("originalPrice", originalPrice);
      formData.append("discountedPrice", discountedPrice);
      formData.append("returnPolicy", returnPolicy);
      formData.append("shippingCharges", shippingCharges);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("fabric", fabric);
      formData.append("pattern", pattern);
      formData.append("rating", rating);
      formData.append("dressCode", dressCode);
      formData.append("occasion", occasion);
      formData.append("ratingCount", ratingCount);

      color.split(",").forEach((clr) => formData.append("color", clr.trim()));
      size.split(",").forEach((sz) => formData.append("size", sz.trim()));
      images.forEach((img) => formData.append("images", img));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // replace token
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      toast.success("✅ Product created successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create product.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setOriginalPrice("");
    setDiscountedPrice("");
    setReturnPolicy("");
    setShippingCharges("");
    setBrand("");
    setCategory("");
    setStock("");
    setFabric("");
    setPattern("");
    setRating("");
    setDressCode("");
    setOccasion("");
    setColor("");
    setSize("");
    setRatingCount("");
    setImages([]);
    setThumbnail(null);
    setImagePreviews([]);
    setThumbnailPreview(null);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [imagePreviews, thumbnailPreview]);

  const token = localStorage.getItem("token");

  return (
    <div className="product-form-container">
      <h2 className="form-title">Bride Boutique Products Form</h2>
   
      <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Form Inputs */}
        <div className="input-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Original Price:</label>
          <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Discounted Price:</label>
          <input type="number" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Return Policy:</label>
          <input type="text" value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Shipping Charges:</label>
          <input type="number" value={shippingCharges} onChange={(e) => setShippingCharges(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Brand:</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Stock:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Fabric:</label>
          <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Pattern:</label>
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Colors (comma separated):</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Sizes (comma separated):</label>
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Rating:</label>
          <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Rating Count:</label>
          <input type="number" value={ratingCount} onChange={(e) => setRatingCount(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Dress Code:</label>
          <input type="text" value={dressCode} onChange={(e) => setDressCode(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Occasion:</label>
          <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} required />
        </div>

        {/* File Upload Sections */}
        <div className="upload-section">
          <label>Upload Product Images:</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {imagePreviews.length > 0 && (
            <div className="upload-preview-container">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt="Preview" className="upload-preview" />
              ))}
            </div>
          )}
        </div>

        <div className="upload-section">
          <label>Upload Thumbnail:</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} />
          {thumbnailPreview && (
            <div className="upload-preview-container">
              <img src={thumbnailPreview} alt="Thumbnail" className="upload-preview" />
            </div>
          )}
        </div>

        {/* Submit button and Progress Bar */}
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Create Product"}
        </button>

        {loading && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ProductForm;
