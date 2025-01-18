const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 1164;

const corsOptions = {
    origin: ['https://task-30-wjdc.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.options('*', cors(corsOptions)); 
app.use(cors(corsOptions));

app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

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

const FormData = mongoose.model("FormData", formSchema);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/get', async (req, res) => {
    try {
        const allData = await FormData.find();
        res.json(allData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ 
            message: "Error fetching data.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.post("/submit", async (req, res) => {
    try {
        const { 
            fullName, 
            dateOfBirth, 
            gender, 
            phoneNo, 
            emailId, 
            fullAddress, 
            emergencyContact 
        } = req.body;

        if (!fullName || !dateOfBirth || !gender || !phoneNo || !emailId || !fullAddress) {
            return res.status(400).json({ message: "All fields are required." });
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

        res.json(responseMessage);
    } catch (error) {
        console.error("Form submission error:", error);
        res.status(500).json({ 
            message: "An error occurred while submitting the form.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});