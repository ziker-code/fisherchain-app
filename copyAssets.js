const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\2de0cedf-2457-42e1-a955-8639d4b5afe9';
const assetsDir = path.join(__dirname, 'src', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Files mapping: source file in brain dir -> dest filename in src/assets
const filesToCopy = [
  { src: 'media__1785559762765.jpg', dest: 'logo.jpg' },
  { src: 'media__1785566021432.jpg', dest: 'kakap.jpg' },
  { src: 'media__1785566025594.jpg', dest: 'cumi.jpg' },
  { src: 'media__1785566029127.jpg', dest: 'udang.jpg' },
  { src: 'media__1785566033316.jpg', dest: 'tuna.jpg' }
];

filesToCopy.forEach((item) => {
  const srcPath = path.join(brainDir, item.src);
  const destPath = path.join(assetsDir, item.dest);
  
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${item.src} to ${destPath}`);
    } catch (err) {
      console.error(`Error copying ${item.src}:`, err);
    }
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
});
