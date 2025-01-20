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
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        setError(""); // Reset error state
        setIsSubmitting(true); // Disable the submit button during submission

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/submit`, // Ensure this points to the correct backend URL
                formData,
                {
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );
            navigate("/response", { state: response.data }); // Redirect to a response page after successful submission
        } catch (error) {
            console.error("Error submitting form:", error);
            // Show an error message based on the response from the backend
            setError(error.response?.data?.message || "An error occurred while submitting the form.");
        } finally {
            setIsSubmitting(false); // Enable the submit button after submission
        }
    };

    return (
        <div className="App">
            <div className="form-container">
                <h1>University Application Form</h1>
                {error && <div className="error-message">{error}</div>}
                <form id="university-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="half-width">
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
                        </div>
                        <div className="half-width">
                            <label htmlFor="dob">Date of Birth</label>
                            <input 
                                type="date" 
                                id="dob" 
                                name="dateOfBirth" 
                                value={formData.dateOfBirth} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="half-width">
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
                        </div>
                        <div className="half-width">
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
                        </div>
                    </div>

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

                    <h2>Emergency Contact Details</h2>
                    <div className="input-group">
                        <div className="half-width">
                            <label htmlFor="emergency-contact-name">Name</label>
                            <input 
                                type="text" 
                                id="emergency-contact-name" 
                                name="emergencyContact.name" 
                                value={formData.emergencyContact.name} 
                                onChange={handleChange}
                                required 
                                placeholder="Enter emergency contact name" 
                            />
                        </div>
                        <div className="half-width">
                            <label htmlFor="emergency-contact-relationship">Relationship</label>
                            <input 
                                type="text" 
                                id="emergency-contact-relationship" 
                                name="emergencyContact.relationship" 
                                value={formData.emergencyContact.relationship} 
                                onChange={handleChange}
                                required 
                                placeholder="Enter relationship" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="half-width">
                            <label htmlFor="emergency-contact-email">Email</label>
                            <input 
                                type="email" 
                                id="emergency-contact-email" 
                                name="emergencyContact.emailId" 
                                value={formData.emergencyContact.emailId} 
                                onChange={handleChange}
                                required 
                                placeholder="Enter emergency contact email" 
                            />
                        </div>
                        <div className="half-width">
                            <label htmlFor="emergency-contact-phone">Phone Number</label>
                            <input 
                                type="tel" 
                                id="emergency-contact-phone" 
                                name="emergencyContact.phoneNo" 
                                value={formData.emergencyContact.phoneNo} 
                                onChange={handleChange}
                                required 
                                placeholder="Enter emergency contact phone" 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Form;
