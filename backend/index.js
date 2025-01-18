const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 1164;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDb:", err));

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

app.get('/get', async (req, res) => {
  try {
    const allData = await FormData.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data." });
  }
});

app.post("/submit", async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, phoneNo, emailId, fullAddress, emergencyContact } = req.body;

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
    res.status(500).json({ message: "An error occurred while submitting the form." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on 'http://localhost:${port}'`);
});
