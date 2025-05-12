import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import "../../styles/Wishlist.css";

const Wishlist = () => {
  const { user } = useAuth();
  const { dispatch: cartDispatch, cartItems } = useContext(CartContext);

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch wishlist products
  useEffect(() => {
    if (!user?._id) return;

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}/wishlist`);
        setWishlistProducts(res.data);
      } catch (err) {
        toast.error("Failed to load wishlist");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // ❌ Remove from wishlist
  const handleRemove = async (productId) => {
    const updated = wishlistProducts.filter((p) => p._id !== productId);
    setWishlistProducts(updated);

    try {
      const wishlistIds = updated.map((p) => p._id);
      await axios.put("http://localhost:5000/api/users/wishlist", {
        userId: user._id,
        wishlist: wishlistIds,
      });
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error(err);
    }
  };

  // 🛒 Move to cart
  const handleMoveToCart = (product) => {
    const alreadyInCart = cartItems?.some(
      (item) => item.id === product._id && item.selectedSize === (product.size?.[0] || "M")
    );

    if (alreadyInCart) {
      toast.info("Item already in cart");
      return;
    }

    const payload = {
      id: product._id,
      title: product.title,
      price: product.discountedPrice,
      selectedSize: product.size?.[0] || "M",
      thumbnail: product.thumbnail,
    };

    cartDispatch({ type: "ADD_ITEM", payload });
    toast.success("Moved to cart ✅");
  };

  if (loading) return <div className="wishlist-loading">Loading...</div>;

  if (wishlistProducts.length === 0) {
    return <h2 className="empty-wishlist">💔 Your wishlist is empty!</h2>;
  }

  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">💖 Your Wishlist</h2>
      <div className="wishlist-grid">
        {wishlistProducts.map((product) => (
          <div key={product._id} className="wishlist-card">
            <Link to={`/shopnow/${product._id}`}>
              <img
                src={`http://localhost:5000${product.thumbnail}`}
                alt={product.title}
                className="wishlist-img"
                onError={(e) => (e.target.src = "/placeholder-product.jpg")}
              />
            </Link>

            <div className="wishlist-info">
              <h3>{product.title}</h3>
              <p>Price: ₹{product.discountedPrice}</p>
              <div className="wishlist-actions">
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(product._id)}
                >
                   Remove
                </button>
                <button
                  className="wishlist-cart-btn"
                  onClick={() => handleMoveToCart(product)}
                >
                  🛒 Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
