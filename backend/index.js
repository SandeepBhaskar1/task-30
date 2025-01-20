const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173', // Frontend during development
        'https://task-30-4rxz.vercel.app', // Frontend in production
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Form schema and model
const formSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true }
);
const FormData = mongoose.model('FormData', formSchema);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Fetch all form data
app.get('/get', async (req, res) => {
    try {
        const allData = await FormData.find();
        res.json(allData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            message: 'Error fetching data.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

// Submit form data
app.post('/submit', async (req, res) => {
    try {
        const { fullName, dateOfBirth, gender, phoneNo, emailId, fullAddress, emergencyContact } = req.body;

        if (!fullName || !dateOfBirth || !gender || !phoneNo || !emailId || !fullAddress) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newFormData = new FormData({
            fullName,
            dateOfBirth,
            gender,
            phoneNo,
            emailId,
            fullAddress,
            emergencyContact,
        });

        const savedData = await newFormData.save();

        res.json({
            message: 'Form submitted successfully!',
            data: savedData,
        });
    } catch (error) {
        console.error('Form submission error:', error);
        res.status(500).json({
            message: 'An error occurred while submitting the form.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
