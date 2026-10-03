import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const publicDir = 'public';

const images = [
  { input: 'hero-new.png', output: 'hero-new.webp', quality: 85 },
  { input: 'logMate-logo-dark.png', output: 'logMate-logo-dark.webp', quality: 90 },
  { input: 'logMate-logo.png', output: 'logMate-logo.webp', quality: 90 },
  { input: 'logmate.png', output: 'logmate.webp', quality: 90 },
  { input: 'register-student.png', output: 'register-student.webp', quality: 85 },
  { input: 'uz-crest.png', output: 'uz-crest.webp', quality: 90 }
];

console.log('🖼️  Converting images to WebP...\n');

for (const img of images) {
  const inputPath = join(publicDir, img.input);
  const outputPath = join(publicDir, img.output);
  
  try {
    await sharp(inputPath)
      .webp({ quality: img.quality })
      .toFile(outputPath);
    
    const stats = await sharp(outputPath).metadata();
    console.log(`✅ ${img.input} → ${img.output} (${Math.round(stats.size / 1024)}KB)`);
  } catch (error) {
    console.error(`❌ Failed to convert ${img.input}:`, error.message);
  }
}

console.log('\n✨ Image optimization complete!');
