import sharp from 'sharp';
import { join } from 'path';

const publicDir = 'public';
const inputPath = join(publicDir, 'hero-new1.png');
const outputPath = join(publicDir, 'hero-new1.webp');

console.log('🖼️  Converting hero-new1.png to WebP...\n');

try {
  const inputMeta = await sharp(inputPath).metadata();
  
  await sharp(inputPath)
    .webp({ quality: 95, effort: 6 })
    .toFile(outputPath);
  
  const stats = await sharp(outputPath).metadata();
  const originalSize = inputMeta.size;
  const newSize = stats.size;
  const savings = Math.round(((originalSize - newSize) / originalSize) * 100);
  
  console.log(`✅ hero-new1.png → hero-new1.webp`);
  console.log(`   Original: ${Math.round(originalSize / 1024)}KB`);
  console.log(`   Optimized: ${Math.round(newSize / 1024)}KB`);
  console.log(`   Saved: ${savings}% smaller\n`);
  console.log('✨ Optimization complete!');
} catch (error) {
  console.error(`❌ Failed to convert:`, error.message);
}
