const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the HTML page
  await page.goto('file:///C:/Users/a/Documents/GitHub/Zalojs-Example/index.html');

  // Save the image file
  const imageUrl = 'https://fen2png.com/api/?fen=5rk1/pp4pp/4p3/2R3Q1/3n4/2q4r/P1P2PPP/5RK1%20b%20-%20-%20-&raw=true';
  const imagePath = path.join(__dirname, 'saved_image.png'); // Path to save the image

  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(imagePath));

    console.log('Image saved successfully at:', imagePath);

    // Upload the image file
    const inputUploadHandle = await page.$('input[type=file]');
    await inputUploadHandle.uploadFile(imagePath);

    console.log('Image uploaded successfully.');

  } catch (error) {
    console.error('Error occurred while fetching or uploading the image:', error);
  } finally {
    // Close the browser
  }
})();
