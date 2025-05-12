import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const StepShipping = ({ onNext, selectedAddress, setSelectedAddress }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}`);
        const list = res.data.addresses || [];
        setAddresses(list);
        if (!selectedAddress && list.length > 0) {
          setSelectedAddress(list[list.length - 1]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch addresses");
      }
    };
    if (user?._id) fetchAddresses();
  }, [user]);

  const handleSelect = (addr) => setSelectedAddress(addr);

  return (
    <div className="step step-shipping">
      <h2>Select Shipping Address</h2>
      {addresses.length === 0 ? (
        <p>No address found. <a href="/address">Add one</a></p>
      ) : (
        <ul className="address-list">
          {addresses.map((addr) => (
            <li key={addr._id} className="address-option">
              <label>
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => handleSelect(addr)}
                />
                {`${addr.fullName}, ${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`}
              </label>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onNext} disabled={!selectedAddress}>Next</button>
    </div>
  );
};

export default StepShipping;
