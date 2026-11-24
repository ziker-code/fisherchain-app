// Membuat ikon PWA dari src/assets/logo.jpg → public/icons/*
// Jalankan: node scripts/generate-icons.cjs
const path = require('path');
const Jimp = require('jimp-compact');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src/assets/logo.jpg');
const OUT = path.join(ROOT, 'public/icons');

(async () => {
  const logo = await Jimp.read(SRC);
  // Potong bingkai abu-abu di luar kotak putih logo
  const inset = Math.round(logo.bitmap.width * 0.06);
  const art = logo.clone().crop(inset, inset, logo.bitmap.width - inset * 2, logo.bitmap.height - inset * 2);

  const square = async (size, scale, file) => {
    const canvas = new Jimp(size, size, 0xffffffff);
    const inner = Math.round(size * scale);
    const img = art.clone().resize(inner, inner, Jimp.RESIZE_BICUBIC);
    canvas.composite(img, Math.round((size - inner) / 2), Math.round((size - inner) / 2));
    await canvas.writeAsync(path.join(OUT, file));
    console.log('✓', file);
  };

  await square(192, 1, 'icon-192.png');
  await square(512, 1, 'icon-512.png');
  await square(512, 0.8, 'maskable-512.png'); // area aman 80% untuk ikon adaptif Android
  await square(180, 1, 'apple-touch-icon.png');
  await square(48, 1, 'favicon.png');
})();
