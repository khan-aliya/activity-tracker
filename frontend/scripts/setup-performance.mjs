import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

console.log('🚀 Setting up performance optimizations...\n');

// Check and setup images
const imagesDir = join(__dirname, '../public/images');
const optimizedDir = join(__dirname, '../public/images/optimized');

// Create directories if needed
if (!existsSync(optimizedDir)) {
  mkdirSync(optimizedDir, { recursive: true });
  console.log('📁 Created optimized images directory');
}

// Copy SVG images to optimized
if (existsSync(imagesDir)) {
  const files = readdirSync(imagesDir).filter(f => f.endsWith('.svg'));
  
  if (files.length === 0) {
    console.log('⚠️ No SVG images found. Please run:');
    console.log('cd public/images && node create-images.mjs');
  } else {
    files.forEach(file => {
      const source = join(imagesDir, file);
      const dest = join(optimizedDir, file);
      
      if (!existsSync(dest)) {
        copyFileSync(source, dest);
        console.log(`✅ Copied: ${file}`);
      }
    });
  }
}

console.log('\n✅ Performance setup complete!');
console.log('\n📋 Next Steps:');
console.log('1. Build: npm run build');
console.log('2. Run dev server: npm run dev');
console.log('3. Test: npm run lighthouse');
