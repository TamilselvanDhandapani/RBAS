import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/auth";

// Load user from localStorage if available
const storedUser = localStorage.getItem("user");

// Initial State
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: storedUser ? false : true, // ✅ If user exists, no need to load
  message: "",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, message: "" };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case "AUTH_FAIL":
      return { ...state, loading: false, isAuthenticated: false, message: action.payload };
    case "LOGOUT":
      return { ...initialState, isAuthenticated: false, loading: false };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const AuthContext = createContext();

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Fetch logged-in user if token exists
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: "STOP_LOADING" });
      return;
    }

    try {
      dispatch({ type: "AUTH_START" });
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "AUTH_SUCCESS", payload: res.data.user });
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "AUTH_FAIL", payload: "Session expired" });
      
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("token");

    if (oauthToken) {
      localStorage.setItem("token", oauthToken);
      window.history.replaceState({}, "", window.location.pathname);
    }

    loadUser();
  }, []);

  // Register user
  const register = async (username, email, password) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await axios.post(`${API_URL}/register`, { username, email, password });
      localStorage.setItem("pendingUserId", res.data.userId);
      localStorage.setItem("pendingEmail", email);
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg || "OTP sent" });
      toast.success("OTP sent to your email.");
      return true;
    } catch (err) {
      dispatch({
        type: "AUTH_FAIL",
        payload: err.response?.data?.msg || "Register error",
      });
      toast.error(err.response?.data?.msg || "Register failed!");
    }
  };

  // Verify OTP
  const verifyOtp = async (otp) => {
    dispatch({ type: "AUTH_START" });
    try {
      const userId = localStorage.getItem("pendingUserId");
  
      const res = await axios.post(`${API_URL}/verify-otp`, { userId, otp });
  
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch({ type: "AUTH_SUCCESS", payload: res.data.user });
      }
  
      localStorage.removeItem("pendingUserId");
      localStorage.removeItem("pendingEmail");
  
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg || res.data.message });
      toast.success(res.data.msg || "OTP verified successfully!");
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || "OTP verification failed!";
      dispatch({
        type: "AUTH_FAIL",
        payload: errorMsg,
      });
      toast.error(errorMsg);
      return false;
    }
  };
  

  // Login user
  const login = async (email, password) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
  
      const { token, user } = res.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      dispatch({ type: "AUTH_SUCCESS", payload: user });
      dispatch({ type: "SET_MESSAGE", payload: res.data.message });
  
      toast.success("Login successful!");
  
      return { success: true, user }; // ✅ Return user data here
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed!";
      dispatch({ type: "AUTH_FAIL", payload: msg });
      toast.error(msg);
      return { success: false }; // ✅ Return status for login failure
    }
  };
  
  // Resend OTP
  const resendOtp = async () => {
    try {
      const email = localStorage.getItem("pendingEmail");
      const res = await axios.post(`${API_URL}/resend-otp`, { email });
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success("OTP resent successfully!");
    } catch (err) {
      dispatch({
        type: "AUTH_FAIL",
        payload: err.response?.data?.msg || "Resend OTP failed",
      });
      toast.error(err.response?.data?.msg || "Failed to resend OTP!");
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      dispatch({
        type: "AUTH_FAIL",
        payload: err.response?.data?.msg || "Forgot password failed",
      });
      toast.error(err.response?.data?.msg || "Failed to send reset link!");
    }
  };

  // Reset Password
  const resetPassword = async ({ token, newPassword }) => {
    try {
      const res = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
      dispatch({ type: "SET_MESSAGE", payload: res.data.msg });
      toast.success("Password reset successful!");
      return true;
    } catch (err) {
      dispatch({
        type: "AUTH_FAIL",
        payload: err.response?.data?.msg || "Reset password failed",
      });
      toast.error(err.response?.data?.msg || "Reset failed!");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear(); 
    dispatch({ type: "LOGOUT" });
    toast.info("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
