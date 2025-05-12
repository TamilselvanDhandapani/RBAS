import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import "../../styles/Navbar.css";
import CartContext from "../../context/CartContext";

const AuthButtons = ({
  isAuthenticated,
  handleLogout,
  user,
  isMobile = false,
  itemCount = 0,
}) => {
  return isAuthenticated ? (
    <>
      {user?.role !== "admin" && (
        <div className="authbtns">
          <Link
            to="/myaccount"
            className={`btn signin-btn ${isMobile ? "mobile" : ""}`}
          >
            <div className="icon-text-wrapper">
              <FaUser className="cart-icon" />
              <span> {user.username}</span>
            </div>
          </Link>
          <Link
            to="/cart"
            className={`btn signin-btn ${isMobile ? "mobile" : ""}`}
          >
            <div className="icon-text-wrapper">
              <FaShoppingCart className="cart-icon" />
              {itemCount > 0 && (
                <span className="cart-count animate-bounce">{itemCount}</span>
              )}
            </div>
          </Link>
          <Link
            to="/wishlist"
            className={`btn signin-btn ${isMobile ? "mobile" : ""}`}
          >
            <div className="icon-text-wrapper">
              <FaHeart className="cart-icon" />
            </div>
          </Link>
        </div>
      )}
      {user?.role === "admin" && (
        <Link
          to="/admin-dashboard"
          className={`btn signin-btn ${isMobile ? "mobile" : ""}`}
        >
          Dashboard
        </Link>
      )}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="btn signin-btn">
        Login
      </Link>
      <Link to="/register" className="btn signup-btn">
        Register
      </Link>
    </>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState("");
  const [search, setSearch] = useState("");

  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        document.body.style.overflow = "auto";
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleMenu = () => {
    if (isMenuOpen) {
      setMenuAnimation("closing");
      setTimeout(() => {
        setIsMenuOpen(false);
        setMenuAnimation("");
        document.body.style.overflow = "auto";
      }, 400);
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shopnow?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  return (
    <>
      {isMenuOpen && (
        <div className="mobile-nav-overlay active" onClick={handleToggleMenu} />
      )}

      <nav ref={navRef} className="nav-container" aria-label="Main navigation">
        <div className="logo">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

       

        <div
          className={`nav-items ${isMenuOpen ? "open" : ""} ${
            menuAnimation === "closing" ? "animate-slide-out" : ""
          }`}
        >
          <ul>
            {[
              { path: "/", label: "Home" },
              { path: "/shopnow", label: "Collections" },
              { path: "/about", label: "Our Story" },
              { path: "/why-us", label: "Our Promise" },
              { path: "/contact", label: "Reach Out" },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link
                  className={isActive(path) ? "active-link" : ""}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          

          <div className="mobile-auth-section">
            <AuthButtons
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              user={user}
              isMobile
              itemCount={itemCount}
            />
          </div>
        </div>
        {/* <form className="nav-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form> */}

        <div className="desktop-auth-section">
          <AuthButtons
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            user={user}
            itemCount={itemCount}
          />
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={handleToggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
