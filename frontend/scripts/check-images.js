import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');

async function checkImageFormats() {
  console.log('🔍 Checking image formats...\n');
  
  const files = fs.readdirSync(imagesDir);
  const results = [];
  
  for (const file of files) {
    if (file === '.DS_Store' || file.includes('optimized')) continue;
    
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    
    try {
      const metadata = await sharp(filePath).metadata();
      results.push({
        file,
        size: (stats.size / 1024).toFixed(2) + ' KB',
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        space: metadata.space,
        status: '✅ OK'
      });
    } catch (error) {
      results.push({
        file,
        size: (stats.size / 1024).toFixed(2) + ' KB',
        format: 'UNKNOWN',
        width: 'N/A',
        height: 'N/A',
        space: 'N/A',
        status: `❌ ${error.message}`
      });
    }
  }
  
  // Display results
  console.log('📋 Image Analysis Results:');
  console.log('='.repeat(80));
  console.log('File\t\tSize\t\tFormat\t\tDimensions\tStatus');
  console.log('-'.repeat(80));
  
  results.forEach(img => {
    console.log(
      `${img.file}\t${img.size}\t\t${img.format}\t\t${img.width}x${img.height}\t${img.status}`
    );
  });
  
  console.log('\n💡 Recommendations:');
  console.log('1. Convert all images to WebP format for best compression');
  console.log('2. Ensure images are under 1MB each');
  console.log('3. Use proper dimensions (max 1200x800 for web)');
  console.log('4. Run: npm run optimize-images');
}

checkImageFormats();