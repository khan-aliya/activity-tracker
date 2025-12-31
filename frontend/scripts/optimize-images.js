import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Create directories if they don't exist
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log('Created images directory');
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('Created optimized images directory');
}

// Create a placeholder image if none exist
const placeholderPath = path.join(inputDir, 'placeholder.svg');
if (!fs.existsSync(placeholderPath)) {
  const placeholderSVG = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="400" fill="#f8f9fa"/>
    <text x="400" y="200" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="24">
      Activity Tracker
    </text>
    <text x="400" y="240" text-anchor="middle" fill="#adb5bd" font-family="Arial" font-size="16">
      Optimized Image Placeholder
    </text>
  </svg>`;
  
  fs.writeFileSync(placeholderPath, placeholderSVG);
  console.log('Created placeholder image');
}

async function optimizeImage(inputPath, outputPath) {
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Resize and convert to WebP
    await sharp(inputPath)
      .resize({
        width: Math.min(metadata.width || 1200, 1200),
        height: Math.min(metadata.height || 800, 800),
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: 80,
        effort: 4 // Better compression
      })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`Error optimizing ${path.basename(inputPath)}:`, error.message);
    
    // If WebP fails, try JPEG as fallback
    try {
      const jpegPath = outputPath.replace('.webp', '.jpg');
      await sharp(inputPath)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(jpegPath);
      console.log(`✓ Fallback to JPEG: ${path.basename(inputPath)} -> ${path.basename(jpegPath)}`);
      return true;
    } catch (jpegError) {
      console.error(`JPEG fallback also failed for ${path.basename(inputPath)}:`, jpegError.message);
      return false;
    }
  }
}

async function optimizeAllImages() {
  try {
    const files = fs.readdirSync(inputDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif', '.bmp', '.tiff'];
    
    console.log(`Found ${files.length} files in ${inputDir}`);
    
    let optimizedCount = 0;
    let failedCount = 0;
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      // Skip non-image files and already optimized files
      if (!imageExtensions.includes(ext) || file.includes('optimized') || file === '.DS_Store') {
        continue;
      }
      
      const inputPath = path.join(inputDir, file);
      const outputName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(outputDir, outputName);
      
      // Skip if already optimized (check for both WebP and JPEG)
      const webpExists = fs.existsSync(outputPath);
      const jpegExists = fs.existsSync(outputPath.replace('.webp', '.jpg'));
      
      if (webpExists || jpegExists) {
        console.log(`Skipping ${file} - already optimized`);
        continue;
      }
      
      console.log(`Optimizing ${file}...`);
      
      const success = await optimizeImage(inputPath, outputPath);
      
      if (success) {
        optimizedCount++;
        console.log(`✓ Success: ${file}`);
      } else {
        failedCount++;
        console.log(`✗ Failed: ${file}`);
      }
    }
    
    console.log(`\n📊 Optimization Summary:`);
    console.log(`✅ Optimized: ${optimizedCount} images`);
    console.log(`❌ Failed: ${failedCount} images`);
    console.log(`📁 Output: ${outputDir}`);
    
    // Create a README file in optimized folder
    const readmePath = path.join(outputDir, 'README.md');
    const readmeContent = `# Optimized Images

This directory contains optimized versions of the images from the parent folder.

## Optimization Details:
- Format: WebP (with JPEG fallback)
- Max Dimensions: 1200x800px
- Quality: 80%
- Generated: ${new Date().toISOString()}

## Usage:
Use the optimized images in your components for better performance.

## Original Files:
Do not delete original images from the parent folder as they serve as source files.`;
    
    fs.writeFileSync(readmePath, readmeContent);
    
  } catch (error) {
    console.error('Error in optimizeAllImages:', error);
  }
}

optimizeAllImages();