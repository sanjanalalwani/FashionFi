const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5000;

// Allow CORS for all routes
app.use(cors());

// Define the /trigger-ar route
app.post('/trigger-ar', (req, res) => {
    const shirtImages = req.body.images; // Assuming you send an array of image paths
    const args = shirtImages.map(img => path.join(__dirname, img)).join(' '); // Construct command-line arguments

    exec(`python scripts/AR.py ${args}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            res.status(500).json({ message: 'Failed to run AR script.' });
            return;
        }
        res.json({ message: 'AR script executed successfully.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
