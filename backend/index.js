const express = require('express');
const cors = require('cors'); // To handle CORS
const mongoose = require('mongoose'); // For MongoDB connection
require('dotenv').config(); // For environment variables

const app = express();
const port = process.env.PORT || 5000; // Default to port 5000 if not provided

const corsOptions = {
    origin: [
        'https://task-30-4rxz.vercel.app/',    // Add your actual frontend URL
        'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};


// Apply CORS middleware
app.use(cors(corsOptions));

// Parse incoming requests with JSON payloads
app.use(express.json());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Form schema for storing form data in MongoDB
const formSchema = new mongoose.Schema({
    fullName: String,
    dateOfBirth: String,
    gender: String,
    phoneNo: String,
    emailId: String,
    fullAddress: String,
    emergencyContact: {
        name: String,
        relationship: String,
        emailId: String,
        phoneNo: String,
    },
}, { timestamps: true });

const FormData = mongoose.model("FormData", formSchema); // MongoDB model for form data

// Health check route to ensure server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Route to get all form data from MongoDB
app.get('/get', async (req, res) => {
    try {
        const allData = await FormData.find();
        res.json(allData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Error fetching data.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

// Route to handle form submission (POST request)
app.post("/submit", async (req, res) => {
    try {
        const { fullName, dateOfBirth, gender, phoneNo, emailId, fullAddress, emergencyContact } = req.body;

        // Validation: Check if required fields are present
        if (!fullName || !dateOfBirth || !gender || !phoneNo || !emailId || !fullAddress) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create new form data document
        const newFormData = new FormData({
            fullName,
            dateOfBirth,
            gender,
            phoneNo,
            emailId,
            fullAddress,
            emergencyContact,
        });

        // Save form data to MongoDB
        const savedData = await newFormData.save();

        const responseMessage = {
            message: "Form Submitted Successfully! Here are the details you provided:",
            data: {
                "Full Name": savedData.fullName,
                "Date of Birth": savedData.dateOfBirth,
                "Gender": savedData.gender,
                "Phone No.": savedData.phoneNo,
                "Email ID": savedData.emailId,
                "Full Address": savedData.fullAddress,
                "Emergency Contact": {
                    "Name": savedData.emergencyContact.name,
                    "Relationship": savedData.emergencyContact.relationship,
                    "Email ID": savedData.emergencyContact.emailId,
                    "Phone No.": savedData.emergencyContact.phoneNo,
                },
            },
        };

        // Respond with success message and saved form data
        res.json(responseMessage);
    } catch (error) {
        console.error("Form submission error:", error);
        res.status(500).json({
            message: "An error occurred while submitting the form.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
