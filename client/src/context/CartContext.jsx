import React, { createContext, useReducer, useEffect, useMemo } from "react";
import axios from "axios";
import CartReducer from "./CartReducer";
import { useAuth } from "./AuthContext"; // adjust as needed

const CartContext = createContext();
const LOCAL_CART_KEY = "cartItems";
const API_URL = "http://localhost:5000";

const calculateTotalPrice = (cartItems) =>
  cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

const calculateItemCount = (cartItems) =>
  cartItems.reduce((count, item) => count + item.quantity, 0);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, dispatch] = useReducer(CartReducer, []);

  // 🔁 Merge local cart into DB on login
  useEffect(() => {
    const mergeCartAfterLogin = async () => {
      if (!user?._id) return;

      const guestCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];

      try {
        // 1. Get server cart
        const res = await axios.get(`${API_URL}/api/cart/${user._id}`);
        const serverCart = res.data?.items || [];

        // 2. Merge maps
        const mergedMap = new Map();

        serverCart.forEach((item) => {
          mergedMap.set(`${item.product}-${item.selectedSize}`, {
            productId: item.product,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
          });
        });

        guestCart.forEach((item) => {
          const key = `${item.id}-${item.selectedSize}`;
          if (mergedMap.has(key)) {
            mergedMap.get(key).quantity += item.quantity;
          } else {
            mergedMap.set(key, {
              productId: item.id,
              selectedSize: item.selectedSize,
              quantity: item.quantity,
            });
          }
        });

        const mergedItems = Array.from(mergedMap.values());

        // 3. Sync to backend
        await axios.post(`${API_URL}/api/cart/sync`, {
          userId: user._id,
          items: mergedItems,
        });

        // 4. Load cart with full product info
        const displayItems = await Promise.all(
          mergedItems.map(async (item) => {
            const productId =
              typeof item.productId === "object" ? item.productId._id : item.productId;

            const { data: product } = await axios.get(`${API_URL}/api/products/${productId}`);

            return {
              id: productId,
              title: product.title,
              thumbnail: product.thumbnail,
              price: product.discountedPrice,
              selectedSize: item.selectedSize,
              quantity: item.quantity,
            };
          })
        );

        dispatch({ type: "SET_CART", payload: displayItems });
        localStorage.removeItem(LOCAL_CART_KEY);
      } catch (err) {
        console.error("🛑 Cart merge error:", err);
      }
    };

    mergeCartAfterLogin();
  }, [user]);

  // 🧠 For guests: Load cart from localStorage
  useEffect(() => {
    if (!user?._id) {
      const local = localStorage.getItem(LOCAL_CART_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          dispatch({ type: "SET_CART", payload: parsed });
        } catch (e) {
          console.error("🛑 Failed to parse guest cart");
        }
      }
    }
  }, [user]);

  // 🛒 Save guest cart back to localStorage
  useEffect(() => {
    if (!user?._id) {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const totalPrice = useMemo(() => calculateTotalPrice(cartItems), [cartItems]);
  const itemCount = useMemo(() => calculateItemCount(cartItems), [cartItems]);

  const contextValue = useMemo(
    () => ({
      cartItems,
      dispatch,
      totalPrice,
      itemCount,
    }),
    [cartItems, dispatch, totalPrice, itemCount]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export default CartContext;
