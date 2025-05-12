import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/PersonalInfo.css"

const PersonalInfoForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/personal-info/${user._id}`, form);
      toast.success("Personal info updated!");
      navigate("/myaccount");
    } catch (err) {
      toast.error("Failed to update info");
    }
  };

  return (
   <>
    <form className="personal-info-form ajio-theme" onSubmit={handleSubmit}>
  <h2>Personal Information</h2>
  
  <div className="form-group">
    <label>Name</label>
    <input 
      className="form-control"
      name="username" 
      value={form.username} 
      onChange={handleChange} 
      required 
    />
  </div>

  <div className="form-group">
    <label>Phone</label>
    <input 
      className="form-control"
      name="phone" 
      value={form.phone} 
      onChange={handleChange} 
      required 
    />
  </div>

  <div className="form-group">
    <label>Gender</label>
    <select 
      className="form-control"
      name="gender" 
      value={form.gender} 
      onChange={handleChange} 
      required
    >
      <option value="">Select</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div className="form-group">
    <label>Date of Birth</label>
    <input 
      type="date" 
      className="form-control"
      name="dob" 
      value={form.dob} 
      onChange={handleChange} 
      required 
    />
  </div>

  <button type="submit" className="btn-submit">
    Save Changes
  </button>
</form>
   </>
  );
};

export default PersonalInfoForm;
