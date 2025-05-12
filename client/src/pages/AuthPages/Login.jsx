import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaGoogle, FaArrowRight } from "react-icons/fa";
import "../../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, message } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { success, user: loggedInUser } = await login(email, password);

    setLoading(false);

    if (!success && message.toLowerCase().includes("verify")) {
      return navigate("/verify-otp");
    }

    if (success && loggedInUser) {
      if (loggedInUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <div className="user-icon">
            <FaUser />
          </div>
          <h3>Welcome Back</h3>
        </div>

        {message && (
          <div className={`login-message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Login <FaArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <p>or continue with</p>
        </div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <FaGoogle className="google-icon" /> Google
        </button>

        <div className="register-link">
          Don't have an account? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
