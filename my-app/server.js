const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');  // To resolve file paths

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Supabase configuration
const supabase = createClient(
    'https://gverjivsdovotdwirzme.supabase.co', // Replace with your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZXJqaXZzZG92b3Rkd2lyem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDYxNjcsImV4cCI6MjA1MDg4MjE2N30.uYT7wfg2A6kCufXxvCtMlbLTWES_fLKdt4JzRlE7VKs' // Replace with your Supabase anon key
);

// Set up Multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

// File upload endpoint
app.post('/upload', upload.single('photo'), async (req, res) => {
    const { name } = req.body;

    if (req.file && name) {
        try {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from('photos')  // Replace with your Supabase bucket name
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            // File uploaded successfully, now save the user name and file info in the database
            const { data: dbData, error: dbError } = await supabase
                .from('photos')
                .insert([{
                    name: name,
                    url: fileName,  // Save the file name instead of the URL
                }]);

            if (dbError) {
                throw dbError;
            }

            res.json({ success: true, message: 'File uploaded successfully', name });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ success: false, message: err.message });
        }
    } else {
        res.status(400).json({ success: false, message: 'Missing file or name' });
    }
});

// Default route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Ensure correct path to index.html
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

const cors = require('cors');

app.use(cors({
    origin: 'https://photo-upload-veight.vercel.app', // Replace with your frontend's origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const allowedOrigins = [
    'https://new2-4cicbgnxb-reuel-rais-projects.vercel.app',
    'https://photo-upload-veight.vercel.app',
    'http://localhost:3000' // Add any other allowed origins
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://photo-upload-veight.vercel.app'); // Replace with your frontend's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Your function logic here
}

const cors = require('cors');

app.use(cors({
    origin: 'https://new2-4cicbgnxb-reuel-rais-projects.vercel.app', // Allow your frontend's new URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

