const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 1164;

// CORS setup
const corsOptions = {
  origin: 'https://task-30-wjdc.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Use built-in express.json() for body parsing
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDb:", err));

// Define schema and model for form data
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
});

const FormData = mongoose.model("FormData", formSchema);

// Route to get all form data
app.get('/get', async (req, res) => {
  try {
    const allData = await FormData.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data." });
  }
});

// Route to handle form submission
app.post("/submit", async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, phoneNo, emailId, fullAddress, emergencyContact } = req.body;

    // Create new form data object
    const newFormData = new FormData({
      fullName,
      dateOfBirth,
      gender,
      phoneNo,
      emailId,
      fullAddress,
      emergencyContact,
    });

    // Save the data to the database
    const savedData = await newFormData.save();

    // Prepare response message
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
    res.status(500).json({ message: "An error occurred while submitting the form." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on 'http://localhost:${port}'`);
});
