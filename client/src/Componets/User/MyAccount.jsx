import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
import '../../styles/MyAccount.css';

const MyAccount = () => {
  const { user } = useAuth();
  const location = useLocation();

  const accountLinks = [
    { path: 'personal-info', icon: '👤', label: 'Personal Information' },
    { path: 'address', icon: '🏠', label: 'Address' },
    { path: 'orderlist', icon: '🛍️', label: 'My Orders' },
    { path: 'wishlist', icon: '❤️', label: 'Wishlist' }
  ];

  return (
    <div className="myaccount-container">
     

      <div className="account-layout">
        <div className="sidebar">
        <span>Hello, {user.username}</span>
     
          
          <ul>
            {accountLinks.map((link) => (
              <li
                key={link.path}
                className={location.pathname.includes(link.path) ? 'active' : ''}
              >
                <Link to={link.path}>
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="account-content">
          <Outlet /> {/* This is where child routes will render */}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
