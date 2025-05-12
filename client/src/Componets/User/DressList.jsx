import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import "../../styles/DressList.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";

const DressList = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const [filters, setFilters] = useState({
    category: "",
    size: "",
    maxPrice: "",
  });
  const [sortOption, setSortOption] = useState("");

  // === Search Query from URL ===
  const getQueryParam = (key) =>
    new URLSearchParams(location.search).get(key) || "";
  const searchQuery = getQueryParam("search");
  const debouncedSearch = useDebounce(searchQuery, 500);

  // === Fetch Products ===
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // === Fetch Wishlist ===
  useEffect(() => {
    if (!user?._id) {
      setWishlist([]);
      setWishlistLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}/wishlist`);
        const wishlistIds = res.data.map((item) => item._id);
        setWishlist(wishlistIds);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, [user?._id]);

  // === Persist filters and sort ===
  useEffect(() => {
    const saved = localStorage.getItem("dress-filters");
    const savedSort = localStorage.getItem("dress-sort");
    if (saved) setFilters(JSON.parse(saved));
    if (savedSort) setSortOption(savedSort);
  }, []);

  useEffect(() => {
    localStorage.setItem("dress-filters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("dress-sort", sortOption);
  }, [sortOption]);

  // === Filtering & Sorting ===
  useEffect(() => {
    let temp = [...products];

    if (filters.category)
      temp = temp.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());

    if (filters.size)
      temp = temp.filter((p) => p.size.includes(filters.size));

    if (filters.maxPrice)
      temp = temp.filter((p) => p.discountedPrice <= parseInt(filters.maxPrice));

    if (debouncedSearch)
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );

    if (sortOption === "lowToHigh")
      temp.sort((a, b) => a.discountedPrice - b.discountedPrice);
    else if (sortOption === "highToLow")
      temp.sort((a, b) => b.discountedPrice - a.discountedPrice);
    else if (sortOption === "rating")
      temp.sort((a, b) => b.rating - a.rating);
    else if (sortOption === "reviewCount")
      temp.sort((a, b) => b.ratingCount - a.ratingCount);

    setFiltered(temp);
  }, [filters, sortOption, products, debouncedSearch]);

  // === Wishlist Toggle ===
  const toggleWishlist = async (id) => {
    if (!user?._id) {
      toast.warning("Please login to use wishlist");
      return;
    }

    const updatedWishlist = wishlist.includes(id)
      ? wishlist.filter((itemId) => itemId !== id)
      : [...wishlist, id];

    setWishlist(updatedWishlist);

    try {
      await axios.put("http://localhost:5000/api/users/wishlist", {
        userId: user._id,
        wishlist: updatedWishlist,
      });
      toast.success("Wishlist updated");
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error(err);
    }
  };

  // === Infinite Scroll with IntersectionObserver ===
  const observer = useRef();

  const lastProductRef = useCallback(
    (node) => {
      if (loading || wishlistLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 6);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, wishlistLoading]
  );

  const clearFilters = () => {
    setFilters({ category: "", size: "", maxPrice: "" });
    setSortOption("");
    localStorage.removeItem("dress-filters");
    localStorage.removeItem("dress-sort");
  };

  if (loading || wishlistLoading) return <div className="dress-loading-spinner">Loading...</div>;

  return (
    <div className="dress-list-container">
      <h2 className="dress-list-title">Trending Styles</h2>

      {debouncedSearch && (
        <p className="search-result-label">
          Showing results for: <strong>{debouncedSearch}</strong>
        </p>
      )}

      <div className="filter-toggle-bar">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="filter-toggle-btn"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="filter-sort-panel">
          <div className="panel-header">
            <h3>Filters & Sorting</h3>
            <FaTimes className="close-filter-panel" onClick={() => setShowFilters(false)} />
          </div>

          <div className="filter-sort-row">
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="filter-dropdown"
            >
              <option value="">All Categories</option>
              <option value="saree">Saree</option>
              <option value="kurti">Kurti</option>
              <option value="lehenga">Lehenga</option>
            </select>

            <select
              value={filters.size}
              onChange={(e) => setFilters((prev) => ({ ...prev, size: e.target.value }))}
              className="filter-dropdown"
            >
              <option value="">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <select
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
              className="filter-dropdown"
            >
              <option value="">All Prices</option>
              <option value="1000">Under ₹1000</option>
              <option value="2000">Under ₹2000</option>
              <option value="3000">Under ₹3000</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-dropdown"
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="rating">Popularity (Ratings)</option>
              <option value="reviewCount">Most Reviewed</option>
            </select>

            <button onClick={clearFilters} className="clear-btn">Clear All</button>
          </div>
        </div>
      )}

      <div className="dress-flex-container">
        {filtered.slice(0, visibleCount).map((product, index) => (
          <div
            key={product._id}
            ref={index === visibleCount - 1 ? lastProductRef : null}
            className="dress-card"
          >
            <div className="wishlist-icon" onClick={() => toggleWishlist(product._id)}>
              {user && wishlist.includes(product._id) ? (
                <FaHeart className="filled-heart" />
              ) : (
                <FaRegHeart className="outline-heart" />
              )}
            </div>

            <Link to={`/shopnow/${product._id}`} className="dress-card-link">
              <div className="dress-image-container">
                <img
                  loading="lazy"
                  src={`http://localhost:5000${product.thumbnail}`}
                  alt={product.title}
                  className="dress-thumbnail"
                  onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                />
                {product.discountedPrice < product.originalPrice && (
                  <span className="dress-discount-badge">
                    {Math.round(
                      ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              <div className="dress-card-body">
                <h3 className="dress-title">{product.title}</h3>
                <div className="dress-price">
                  <span className="dress-current-price">₹{product.discountedPrice}</span>
                  {product.discountedPrice < product.originalPrice && (
                    <span className="dress-original-price">₹{product.originalPrice}</span>
                  )}
                </div>

                <div className="dress-rating">
                  <div className="dress-stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`dress-star ${i < Math.floor(product.rating) ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="dress-rating-count">({product.ratingCount})</span>
                </div>

                <button type="button" className="dress-cart-btn">Add to Cart</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DressList;
