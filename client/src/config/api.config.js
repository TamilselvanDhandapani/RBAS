const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
    RESEND_OTP: `${API_BASE_URL}/api/auth/resend-otp`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    ME: `${API_BASE_URL}/api/auth/me`,
    GOOGLE: `${API_BASE_URL}/api/auth/google`
  },

  // User endpoints
  USER: {
    GET_USER: (id) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE_INFO: (id) => `${API_BASE_URL}/api/users/personal-info/${id}`,
    UPDATE_ADDRESS: (id) => `${API_BASE_URL}/api/users/${id}/address`,
    DELETE_ADDRESS: (userId, addressId) => `${API_BASE_URL}/api/users/${userId}/address/${addressId}`,
    GET_WISHLIST: (id) => `${API_BASE_URL}/api/users/${id}/wishlist`,
    UPDATE_WISHLIST: `${API_BASE_URL}/api/users/wishlist`
  },

  // Product endpoints
  PRODUCT: {
    GET_ALL: `${API_BASE_URL}/api/products`,
    GET_ONE: (id) => `${API_BASE_URL}/api/products/${id}`,
    CREATE: `${API_BASE_URL}/api/products`,
    UPDATE: (id) => `${API_BASE_URL}/api/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/products/${id}`,
    DELETE_IMAGE: `${API_BASE_URL}/api/products/delete-image`,
    DELETE_THUMBNAIL: `${API_BASE_URL}/api/products/delete-thumbnail`
  },

  // Cart endpoints
  CART: {
    GET: (userId) => `${API_BASE_URL}/api/cart/${userId}`,
    ADD: `${API_BASE_URL}/api/cart`,
    UPDATE: `${API_BASE_URL}/api/cart/update`,
    REMOVE: `${API_BASE_URL}/api/cart/remove`,
    SYNC: `${API_BASE_URL}/api/cart/sync`
  },

  // Order endpoints
  ORDER: {
    CREATE: `${API_BASE_URL}/api/orders`,
    GET_ALL: `${API_BASE_URL}/api/orders`,
    GET_USER_ORDERS: (userId) => `${API_BASE_URL}/api/orders/user/${userId}`,
    GET_ONE: (orderId) => `${API_BASE_URL}/api/orders/order/${orderId}`,
    UPDATE_STATUS: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
    VERIFY: `${API_BASE_URL}/api/orders/verify`
  },

  // Payment endpoints
  PAYMENT: {
    RAZORPAY: `${API_BASE_URL}/api/payment/razorpay`
  }
};

export const getImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export default API_ENDPOINTS;