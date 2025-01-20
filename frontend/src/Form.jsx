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
            setFormData((prev) => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, [key]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/submit`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );
            navigate("/response", { state: response.data }); // Navigate to ResponsePage
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message || "Failed to submit the form."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="App">
            <div className="form-container">
                <h1>University Application Form</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        required
                    />
                    <label>Email ID</label>
                    <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        required
                    />
                    <label>Full Address</label>
                    <textarea
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleChange}
                        required
                    />
                    <h2>Emergency Contact</h2>
                    <label>Name</label>
                    <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleChange}
                        required
                    />
                    <label>Relationship</label>
                    <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleChange}
                        required
                    />
                    <label>Email ID</label>
                    <input
                        type="email"
                        name="emergencyContact.emailId"
                        value={formData.emergencyContact.emailId}
                        onChange={handleChange}
                        required
                    />
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="emergencyContact.phoneNo"
                        value={formData.emergencyContact.phoneNo}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Form;
