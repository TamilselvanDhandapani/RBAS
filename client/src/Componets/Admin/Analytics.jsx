import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const [salesOverTime, setSalesOverTime] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [overallCounts, setOverallCounts] = useState({
    totalOrders: 0,
    totalProducts: 0,
    productsByCategory: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [sales, status, products, revenue, counts] = await Promise.all([
        axios.get("/api/analytics/sales-over-time"),
        axios.get("/api/analytics/order-status-distribution"),
        axios.get("/api/analytics/top-selling-products"),
        axios.get("/api/analytics/monthly-revenue"),
        axios.get("/api/analytics/overall-counts"),
      ]);

      setSalesOverTime(sales.data);
      setOrderStatus(status.data);
      setTopProducts(products.data);
      setMonthlyRevenue(revenue.data);
      setOverallCounts(counts.data);
    };

    fetchData();
  }, []);

  const cardStyle = {
    flex: "1",
    padding: "1.5rem",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    textAlign: "center",
  };

  const sectionStyle = {
    marginBottom: "2rem",
    padding: "1rem",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  };

  const integerTicks = {
    scales: {
      y: {
        ticks: {
          precision: 0,
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div style={{ padding: "2rem", background: "#f6f8fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "2rem" }}>📊 E-commerce Analytics Dashboard</h2>

      {/* Overall Counts */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h4>Total Orders</h4>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1a73e8" }}>
            {overallCounts.totalOrders}
          </p>
        </div>
        <div style={cardStyle}>
          <h4>Total Products</h4>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#34a853" }}>
            {overallCounts.totalProducts}
          </p>
        </div>
      </div>

      {/* Products by Category */}
      <div style={sectionStyle}>
        <h3>Products Count by Category</h3>
        <Line
          data={{
            labels: overallCounts.productsByCategory.map((item) => item._id),
            datasets: [
              {
                label: "Products",
                data: overallCounts.productsByCategory.map((item) => item.count),
                tension: 0.3,
                borderColor: "#1a73e8",
              },
            ],
          }}
          options={integerTicks}
        />
      </div>

      {/* Sales Over Time */}
      <div style={sectionStyle}>
        <h3>Sales Over Last 30 Days</h3>
        <Line
          data={{
            labels: salesOverTime.map((item) => item._id),
            datasets: [
              {
                label: "Total Sales (₹)",
                data: salesOverTime.map((item) => item.totalSales),
                borderColor: "#1a73e8",
                tension: 0.3,
              },
              {
                label: "Orders",
                data: salesOverTime.map((item) => item.orderCount),
                borderColor: "#34a853",
                tension: 0.3,
              },
            ],
          }}
          options={integerTicks}
        />
      </div>

      {/* Order Status Distribution */}
      <div style={sectionStyle}>
        <h3>Order Status Distribution</h3>
        <Line
          data={{
            labels: orderStatus.map((item) => item._id),
            datasets: [
              {
                label: "Orders",
                data: orderStatus.map((item) => item.count),
                borderColor: "#fbbc05",
                tension: 0.3,
              },
            ],
          }}
          options={integerTicks}
        />
      </div>

      {/* Top Selling Products */}
      <div style={sectionStyle}>
        <h3>Top Selling Products</h3>
        <Line
          data={{
            labels: topProducts.map((item) => item.productDetails.title),
            datasets: [
              {
                label: "Units Sold",
                data: topProducts.map((item) => item.totalSold),
                borderColor: "#ea4335",
                tension: 0.3,
              },
            ],
          }}
          options={integerTicks}
        />
      </div>

      {/* Monthly Revenue */}
      <div style={sectionStyle}>
        <h3>Monthly Revenue (₹)</h3>
        <Line
          data={{
            labels: monthlyRevenue.map((item) => `Month ${item._id}`),
            datasets: [
              {
                label: "Revenue (₹)",
                data: monthlyRevenue.map((item) => item.totalRevenue),
                borderColor: "#673ab7",
                tension: 0.3,
              },
            ],
          }}
          options={integerTicks}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
