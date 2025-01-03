const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'da0nmpqmn',      // Replace with your cloud name
  api_key: '748779583948967',           // Replace with your API key
  api_secret: 'ItwM-YTQVuSJtr-Sj_gd1auYJqk',     // Replace with your API secret
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/photoDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for photo data
const photoSchema = new mongoose.Schema({
    name: String,
    filename: String,
    uploadDate: { type: Date, default: Date.now },
});

// Create a model based on the schema
const Photo = mongoose.model('Photo', photoSchema);

// Set up file storage with Multer (we don't need to store files locally anymore)
const storage = multer.memoryStorage();  // Store images in memory temporarily
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload handling using Cloudinary
app.post('/upload', upload.single('photo'), async (req, res) => {
    const { name } = req.body;  // Get the name from the form
    if (req.file && name) {
        try {
            // Upload file to Cloudinary
            cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    return res.status(500).json({ success: false, message: 'Error uploading to Cloudinary', error });
                }

                // Save photo information to MongoDB
                const newPhoto = new Photo({
                    name: name,
                    filename: result.secure_url,  // Save Cloudinary URL
                });

                newPhoto.save()
                    .then(() => {
                        console.log(`File uploaded by ${name}: ${result.secure_url}`);
                        res.json({ success: true, filename: result.secure_url, name: name });
                    })
                    .catch((err) => {
                        console.error('Error saving to DB:', err);
                        res.status(500).json({ success: false, message: 'Database error' });
                    });
            }).end(req.file.buffer);  // Upload the file buffer to Cloudinary
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            res.status(500).json({ success: false, message: 'Error uploading to Cloudinary', error });
        }
    } else {
        res.status(400).json({ success: false, message: 'No file uploaded or name missing' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
