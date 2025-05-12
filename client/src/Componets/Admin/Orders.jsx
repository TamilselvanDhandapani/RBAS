import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHourglassStart,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
} from "react-icons/fa";
import "../../styles/AOrder.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const observer = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again later.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const matchSearch =
      order.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());
    const matchFrom = fromDate ? orderDate >= new Date(fromDate) : true;
    const matchTo = toDate ? orderDate <= new Date(toDate) : true;
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    return matchSearch && matchFrom && matchTo && matchStatus;
  });

  const lastOrderRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredOrders.length) {
          setVisibleCount((prev) => prev + 5);
        }
      });
      if (node) observer.current.observe(node);
    },
    [visibleCount, filteredOrders.length]
  );

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaHourglassStart />;
      case "confirmed":
        return <FaCheckCircle />;
      case "shipped":
        return <FaTruck />;
      case "delivered":
        return <FaBoxOpen />;
      case "cancelled":
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  return (
    <div className="order-list">
      <h2>📦 Orders</h2>

      <div className="order-filters">
        <input
          type="text"
          placeholder="Search by Order ID or Username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="date-filters">
          <label>
            From:
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
          <label>
            To:
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error ? (
        <p className="error-text">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.slice(0, visibleCount).map((order, index) => {
          const isLast = index === visibleCount - 1;
          const isNew = index === 0;

          return (
            <div
              key={order._id}
              className={`order-summary-wrapper ${isNew ? "new-order" : ""}`}
              ref={isLast ? lastOrderRef : null}
            >
              <div className="order-summary">
                <p>🆔 <strong>{order._id}</strong></p>
                <p>👤 {order.user?.username || "Unknown User"}</p>
                <p>💵 ₹{order.totalAmount}</p>
                <p>💳 {order.paymentMethod} ({order.paymentStatus})</p>
                <p>
                  📦 Products:{" "}
                  {order.products.map((p) =>
                    typeof p.product === "object"
                      ? p.product.title
                      : `Product ID: ${p.product}`
                  ).join(", ")}
                </p>
                <p>📅 {new Date(order.createdAt).toLocaleString()}</p>
                <p>
                  {getStatusIcon(order.status)}{" "}
                  <strong data-status={order.status.toLowerCase()}>
                    {order.status}
                  </strong>
                </p>
              </div>
              <Link to={`/order/${order._id}`}>
                <button className="view-order-btn">View Order</button>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
