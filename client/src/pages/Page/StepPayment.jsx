import React from "react";

const StepPayment = ({ onNext, onBack, paymentMethod, setPaymentMethod }) => {
  const handleSelect = (method) => setPaymentMethod(method);

  return (
    <div className="step step-payment">
      <h2>Select Payment Method</h2>
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => handleSelect("COD")}
          />
          Cash on Delivery (COD)
        </label>
        <label>
          <input
            type="radio"
            value="Online"
            checked={paymentMethod === "Online"}
            onChange={() => handleSelect("Online")}
          />
          Pay Online (Coming Soon)
        </label>
      </div>
      <div className="checkout-nav">
        <button onClick={onBack}>Back</button>
        <button onClick={onNext} disabled={!paymentMethod}>Next</button>
      </div>
    </div>
  );
};

export default StepPayment;
