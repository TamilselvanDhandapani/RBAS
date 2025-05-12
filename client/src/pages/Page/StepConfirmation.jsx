import React, { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StepConfirmation = ({ onBack, selectedAddress, paymentMethod }) => {
  const { user } = useAuth();
  const { cartItems, totalPrice, dispatch } = useContext(CartContext);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const payload = {
        userId: user._id,
        products: cartItems.map((item) => ({
          product: item.product || item.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          color: item.color,
          thumbnail: item.thumbnail,
        })),
        totalAmount: totalPrice,
        shippingAddress: selectedAddress,
        paymentMethod,
      };

      const res = await axios.post("http://localhost:5000/api/orders", payload);
      if (res.status === 201) {
        dispatch({ type: "CLEAR_CART" });
        toast.success("✅ Order placed successfully!");
        navigate("/orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="step step-confirmation">
      <h2>Confirm Your Order</h2>

      <div className="confirm-summary">
        <h4>Shipping To:</h4>
        <p>{`${selectedAddress.fullName}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`}</p>

        <h4>Payment Method:</h4>
        <p>{paymentMethod}</p>

        <h4>Total:</h4>
        <p>₹{totalPrice.toFixed(2)}</p>
      </div>

      <div className="checkout-nav">
        <button onClick={onBack}>Back</button>
        <button onClick={handlePlaceOrder} disabled={isPlacingOrder}>
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default StepConfirmation;
