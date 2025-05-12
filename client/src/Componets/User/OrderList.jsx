import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/OrderList.css";

const OrderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${user._id}`
        );
        setOrders(res.data);
      } catch (err) {
        toast.error("Failed to fetch orders. Please try again.");
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return <div className="order-loading">🔄 Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="order-empty">
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders. Start shopping now!</p>
        <button
          className="order-continue-btn"
          onClick={() => (window.location.href = "/shopnow")}
        >
          🛍️ Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-wrapper">
      <h2 className="order-title">🧾 Your Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-top">
            <div>
              <p className="order-id">Order #{order._id.slice(-6).toUpperCase()}</p>
              <p className="order-date">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`order-status status-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <div className="order-items">
            {order.products.map((item, idx) => (
              <div key={idx} className="order-product">
                <div className="product-left">
                  <img
                    src={
                      item.thumbnail?.startsWith("http")
                        ? item.thumbnail
                        : `http://localhost:5000${item.thumbnail}`
                    }
                    alt={item.product?.title || "Product"}
                    className="order-image"
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                  />
                </div>
                <div className="product-right">
                  <h4 className="product-name">{item.product?.title}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{(item.priceAtTime || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-bottom">
            <p>Total: ₹{(order.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
