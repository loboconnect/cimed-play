const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background preto
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Borda
  ctx.strokeStyle = '#0099ff';
  ctx.lineWidth = size * 0.05;
  ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);

  // Texto "S" para Synapse
  ctx.fillStyle = '#0099ff';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Gerar ícone 192x192
const icon192 = generateIcon(192);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
console.log('✓ icon-192.png criado');

// Gerar ícone 512x512
const icon512 = generateIcon(512);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
console.log('✓ icon-512.png criado');

console.log('✓ Ícones gerados com sucesso!');
