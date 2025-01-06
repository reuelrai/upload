// api/upload.js

export default async function handler(req, res) {
    // Set CORS headers to allow requests from GitHub Pages
    res.setHeader('Access-Control-Allow-Origin', 'https://reuelrai.github.io');  // Allow your front-end
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

    if (req.method === 'OPTIONS') {
        // Handle pre-flight request (browser sends this before sending actual request)
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        // Your file upload logic goes here
        // Example response:
        res.status(200).json({ success: true, message: 'Photo uploaded successfully' });
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
