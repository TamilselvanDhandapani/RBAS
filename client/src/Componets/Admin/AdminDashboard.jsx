import React from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminDashboard.css";

import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admindashboard-container">
      <div className="admindashboard-header">
        <h1>👰‍♀️ Bride Boutique Admin Dashboard</h1>
      </div>

      <ul className="admindashboard-links">
        <li>
          <Link to="/productform">
            <span className="icon">🛍️</span> New Product
          </Link>
        </li>
        <li>
          <Link to="/products">
            <span className="icon">📦</span> Products
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <span className="icon">🧾</span> Orders
          </Link>
        </li>
        <li>
          <Link to="/analytics">
            <span className="icon">📈</span> Analytics
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default AdminDashboard;
