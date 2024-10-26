const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust limit for large images

// Directory to store images
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// POST endpoint for triggering AR
app.post('/trigger-ar', (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      console.log("No images provided.");
      return res.status(400).json({ message: 'No images provided' });
    }

    images.forEach((base64Image, index) => {
      console.log(`Base64 image data for image ${index}:`, base64Image.slice(0, 50)); // Log first 50 characters
      
      // Proceed to save
      const buffer = Buffer.from(base64Image, 'base64');
      const imagePath = path.join(imagesDir, `image_${index}.png`);
      fs.writeFileSync(imagePath, buffer);
      console.log(`Successfully saved image: ${imagePath}`);
    });

    res.status(200).json({ message: 'Images saved successfully for AR try-on' });
  } catch (error) {
    console.error('Error handling /trigger-ar request:', error);
    res.status(500).json({ message: 'Failed to save images', error: error.message });
  }
});


// GET endpoint for Python to retrieve the latest image
app.get('/latest-image', (req, res) => {
  try {
    const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.png'));
    if (files.length === 0) {
      console.log("No images available in the directory.");
      return res.status(404).json({ message: 'No images available' });
    }

    const latestImage = files
      .map(file => ({ file, time: fs.statSync(path.join(imagesDir, file)).mtime }))
      .sort((a, b) => b.time - a.time)[0].file;

    console.log(`Sending latest image: ${latestImage}`);
    const imagePath = path.join(imagesDir, latestImage);
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching latest image:', error);
    res.status(500).json({ message: 'Failed to fetch the latest image', error: error.message });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
