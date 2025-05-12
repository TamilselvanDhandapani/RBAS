import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Public Pages
import Home from "./pages/Page/Home";
import About from "./pages/Page/About";
import Contact from "./pages/Page/Contact";
import Whyus from "./pages/Page/Whyus";
import Cart from "./pages/Page/Cart";


// Auth Pages
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import VerifyOtp from "./pages/AuthPages/verifyOtp";

// Components
import Navbar from "./Componets/Navbar/Navbar";
import PrivateRoute from "./Routes/PrivateRoutes";

// Admin Pages
import AdminDashboard from "./Componets/Admin/AdminDashboard";
import ProductForm from "./Componets/Admin/ProductForm";
import ProductListPage from "./Componets/Admin/ProductListPage";
import ProductDetailsPage from "./Componets/Admin/ProductDetailsPage";
import Orders from "./Componets/Admin/Orders";
import OrderDetail from "./Componets/Admin/OrderDetail";
import Analytics from "./Componets/Admin/Analytics";

// User Pages
import DressList from "./Componets/User/DressList";
import DressDetail from "./Componets/User/DressDetail";
import MyAccount from "./Componets/User/MyAccount";
import PersonalInfoForm from "./Componets/User/PersonalInfoForm";
import AddressForm from "./Componets/User/AddressForm";
import OrderList from "./Componets/User/OrderList";
import WishList from "./Components/User/WishList";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        pauseOnHover={false}
        theme="dark"
      />

      <Router>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/why-us" element={<Whyus />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shopnow" element={<DressList />} />
          <Route path="/shopnow/:id" element={<DressDetail />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/productform"
            element={
              <PrivateRoute role="admin">
                <ProductForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute role="admin">
                <ProductListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PrivateRoute role="admin">
                <ProductDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute role="admin">
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <PrivateRoute role="admin">
                <OrderDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute role="admin">
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute role="user">
                <Wishlist />
              </PrivateRoute>
            }
          />

          {/* User Routes - My Account with Nested Children */}
          <Route
            path="/myaccount"
            element={
              <PrivateRoute role="user">
                <MyAccount />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <div className="account-default-view">
                  <h3>Your Account Dashboard</h3>
                  <p>Select an option from the menu to view or edit your account details.</p>
                </div>
              }
            />
            <Route path="personal-info" element={<PersonalInfoForm />} />
            <Route path="address" element={<AddressForm />} />
            <Route path="orderlist" element={<OrderList />} />
            <Route path="wishlist" element={<WishList />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
