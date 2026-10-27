const fs = require('fs');
const path = require('path');

const sourcePath = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\2de0cedf-2457-42e1-a955-8639d4b5afe9\\media__1785559762765.jpg';
const destDir = path.join(__dirname, 'src', 'assets');
const destPath = path.join(destDir, 'logo.jpg');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('Logo successfully copied to:', destPath);
} catch (err) {
  console.error('Error copying logo:', err);
}
