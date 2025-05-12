import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTimes,
  FaSave,
  FaEdit,
  FaTrash,
  FaPhone,
} from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import "../../styles/AddressForm.css";

const BASE_URL = "http://localhost:5000/api/users";

const AddressManager = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const fetchAddresses = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/${user._id}`);
      setAddresses(res.data?.addresses || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?._id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setEditingAddress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingAddress
      ? `${BASE_URL}/${user._id}/address/${editingAddress}`
      : `${BASE_URL}/${user._id}/address`;

    try {
      await axios.put(url, form);
      toast.success(editingAddress ? "Address updated" : "Address added");
      resetForm();
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  const handleEdit = (address) => {
    setForm({ ...address });
    setEditingAddress(address._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${user._id}/address/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="address-manager">
      <div className="address-header">
        <h2><AiOutlineHome /> Saved Addresses</h2>
        <button
          className="toggle-form-btn"
          onClick={() => {
            setForm({
              fullName: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
            });
            setEditingAddress(null);
            setShowForm(true); // Always show the form for adding
          }}
        >
          <FaPlus /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="address-form">
          <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>

          {["fullName", "phone", "address", "city", "state", "pincode"].map((field) =>
            field === "address" ? (
              <textarea
                key={field}
                name={field}
                placeholder={capitalize(field)}
                value={form[field]}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                key={field}
                name={field}
                placeholder={capitalize(field)}
                value={form[field]}
                onChange={handleChange}
                required
              />
            )
          )}

          <div className="form-buttons">
            <button type="submit"><FaSave /> {editingAddress ? "Update" : "Save"}</button>
            <button type="button" className="cancel-btn" onClick={() => {
              resetForm();
              setShowForm(false);
            }}>
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p>No addresses saved yet.</p>
      ) : (
        <div className="address-list">
          {addresses.map((addr) => (
            <div key={addr._id} className="address-card">
              <p><strong><BiUser /> {addr.fullName}</strong></p>
              <p>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
              <p><FaPhone /> {addr.phone}</p>
              <div className="address-actions">
                <button onClick={() => handleEdit(addr)}><FaEdit /> Edit</button>
                <button onClick={() => handleDelete(addr._id)}><FaTrash /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;
