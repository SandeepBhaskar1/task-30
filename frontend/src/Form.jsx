import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Form() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNo: "",
    emailId: "",
    fullAddress: "",
    emergencyContact: {
      name: "",
      relationship: "",
      emailId: "",
      phoneNo: "",
    },
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        emergencyContact: { ...prevData.emergencyContact, [key]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/submit`, 
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/response", { state: response.data }); 
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>University Application Form</h1>
        <form id="university-form" onSubmit={handleSubmit}>
          <label htmlFor="full-name">Full Name</label>
          <input 
            type="text" 
            id="full-name" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange}
            required 
            placeholder="Enter your full name" 
          />

          <label htmlFor="dob">Date of Birth</label>
          <input 
            type="date" 
            id="dob" 
            name="dateOfBirth" 
            value={formData.dateOfBirth} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="gender">Gender</label>
          <select 
            id="gender" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            name="phoneNo" 
            value={formData.phoneNo} 
            onChange={handleChange}
            required 
            placeholder="Enter your phone number" 
          />

          <label htmlFor="email">Email ID</label>
          <input 
            type="email" 
            id="email" 
            name="emailId" 
            value={formData.emailId} 
            onChange={handleChange}
            required 
            placeholder="Enter your email address" 
          />

          <label htmlFor="address">Full Address</label>
          <textarea 
            id="address" 
            name="fullAddress" 
            value={formData.fullAddress} 
            onChange={handleChange}
            required 
            placeholder="Enter your full address" 
          />

          <label htmlFor="emergency-contact-name">Emergency Contact Name</label>
          <input 
            type="text" 
            id="emergency-contact-name" 
            name="emergencyContact.name" 
            value={formData.emergencyContact.name} 
            onChange={handleChange}
            required 
            placeholder="Enter the name of your emergency contact" 
          />

          <label htmlFor="emergency-contact-relationship">Emergency Contact Relationship</label>
          <input 
            type="text" 
            id="emergency-contact-relationship" 
            name="emergencyContact.relationship" 
            value={formData.emergencyContact.relationship} 
            onChange={handleChange}
            required 
            placeholder="Enter the relationship with your emergency contact" 
          />

          <label htmlFor="emergency-contact-email">Emergency Contact Email</label>
          <input 
            type="email" 
            id="emergency-contact-email" 
            name="emergencyContact.emailId" 
            value={formData.emergencyContact.emailId} 
            onChange={handleChange}
            required 
            placeholder="Enter the email of your emergency contact" 
          />

          <label htmlFor="emergency-contact-phone">Emergency Contact Phone Number</label>
          <input 
            type="tel" 
            id="emergency-contact-phone" 
            name="emergencyContact.phoneNo" 
            value={formData.emergencyContact.phoneNo} 
            onChange={handleChange}
            required 
            placeholder="Enter the phone number of your emergency contact" 
          />

          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default Form;
