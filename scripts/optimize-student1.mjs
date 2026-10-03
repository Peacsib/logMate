import sharp from 'sharp';
import { join } from 'path';

const publicDir = 'public';
const inputPath = join(publicDir, 'register-student1.png');
const outputPath = join(publicDir, 'register-student1.webp');

console.log('🖼️  Converting register-student1.png to WebP...\n');

try {
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(outputPath);
  
  const stats = await sharp(outputPath).metadata();
  const originalSize = (await sharp(inputPath).metadata()).size;
  const newSize = stats.size;
  const savings = Math.round(((originalSize - newSize) / originalSize) * 100);
  
  console.log(`✅ register-student1.png → register-student1.webp`);
  console.log(`   Original: ${Math.round(originalSize / 1024)}KB`);
  console.log(`   Optimized: ${Math.round(newSize / 1024)}KB`);
  console.log(`   Saved: ${savings}% smaller\n`);
  console.log('✨ Optimization complete!');
} catch (error) {
  console.error(`❌ Failed to convert:`, error.message);
}
