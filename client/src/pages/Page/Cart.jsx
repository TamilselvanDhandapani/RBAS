import React, { useContext, useEffect, useState } from "react";
import CartContext from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/Cart.css";

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, dispatch, totalPrice, itemCount } = useContext(CartContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  // Fetch addresses
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}`);
        const addressList = res.data.addresses || [];
        setAddresses(addressList);
        if (addressList.length > 0) {
          setSelectedAddressId(addressList[addressList.length - 1]._id);
        }
      } catch (err) {
        toast.error("Failed to fetch addresses");
        setAddresses([]);
      }
    };

    if (user?._id) fetchAddress();
  }, [user]);

  const handleRemove = async (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item });
    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        data: {
          userId: user._id,
          productId: item.product || item.id,
          selectedSize: item.selectedSize,
          color: item.color,
        },
      });
    } catch {
      toast.error("Failed to update server cart");
    }
  };

  const handleIncrease = async (item) => {
    dispatch({ type: "INCREASE", payload: item });
    try {
      await axios.put("http://localhost:5000/api/cart/update", {
        userId: user._id,
        productId: item.product || item.id,
        selectedSize: item.selectedSize,
        quantity: item.quantity + 1,
        color: item.color,
      });
    } catch {
      toast.error("Failed to update server cart");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      handleRemove(item);
      return;
    }

    dispatch({ type: "DECREASE", payload: item });
    try {
      await axios.put("http://localhost:5000/api/cart/update", {
        userId: user._id,
        productId: item.product || item.id,
        selectedSize: item.selectedSize,
        quantity: item.quantity - 1,
        color: item.color,
      });
    } catch {
      toast.error("Failed to update server cart");
    }
  };

  const openRazorpay = async (orderData, orderPayload) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "Your Store",
      description: "Order Payment",
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post("http://localhost:5000/api/orders/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            const finalOrder = await axios.post("http://localhost:5000/api/orders", {
              ...orderPayload,
              paymentMethod: "Razorpay",
              paymentStatus: "paid",
            });

            if (finalOrder.status === 201) {
              dispatch({ type: "CLEAR_CART" });
              toast.success("✅ Order placed successfully!");
            }
          } else {
            toast.error("❌ Payment verification failed");
          }
        } catch (err) {
          toast.error("❌ Payment error");
        }
      },
      prefill: {
        name: user.username,
        email: user.email,
      },
      theme: {
        color: "#008060",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCheckout = async () => {
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddress) return toast.warning("Please select a shipping address");

    setIsPlacingOrder(true);

    const orderPayload = {
      userId: user._id,
      products: cartItems.map(item => ({
        product: item.product || item.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        thumbnail: item.thumbnail,
        color: item.color,
        priceAtTime: item.price,
      })),
      totalAmount: totalPrice,
      shippingAddress: selectedAddress,
      paymentMethod,
    };

    try {
      if (paymentMethod === "COD") {
        const res = await axios.post("http://localhost:5000/api/orders", orderPayload);
        if (res.status === 201) {
          dispatch({ type: "CLEAR_CART" });
          toast.success("✅ Order placed successfully!");
        }
      } else if (paymentMethod === "Razorpay") {
        const razorRes = await axios.post("http://localhost:5000/api/payment/razorpay", {
          amount: totalPrice,
        });
        openRazorpay(razorRes.data, orderPayload);
      }
    } catch (error) {
      toast.error("❌ Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return <h2 className="empty-cart">🛒 Your cart is empty!</h2>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛍️ Your Cart ({itemCount} items)</h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={`${item.product || item.id}-${item.selectedSize}-${item.color}`} className="cart-item">
            <img
              src={
                item.thumbnail?.startsWith("http")
                  ? item.thumbnail
                  : `http://localhost:5000${item.thumbnail}`
              }
              alt={item.title}
              className="cart-img"
              onError={(e) => (e.target.src = "/fallback.jpg")}
            />
            <div className="cart-details">
              <h4 className="cart-item-title">{item.title}</h4>
              <p className="cart-item-size">Size: {item.selectedSize}</p>
              <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
              <div className="cart-qty-controls">
                <button onClick={() => handleDecrease(item)} disabled={isPlacingOrder}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item)} disabled={isPlacingOrder}>+</button>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item)} disabled={isPlacingOrder}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="address-select">
        <h3>📦 Select Shipping Address</h3>
        {addresses.length === 0 ? (
          <p>No address found. <a href="/address">Add Address</a></p>
        ) : (
          <ul>
            {addresses.map((addr) => (
              <li key={addr._id}>
                <label>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    disabled={isPlacingOrder}
                  />
                  {"  "} {addr.fullName}, {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="payment-method">
        <h3>💳 Select Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Razorpay"
            checked={paymentMethod === "Razorpay"}
            onChange={() => setPaymentMethod("Razorpay")}
          />
          Pay Online (Razorpay)
        </label>
      </div>

      <div className="cart-summary">
        <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={isPlacingOrder || cartItems.length === 0}
        >
          {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
