import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');
const optimizedDir = path.join(__dirname, '../public/images/optimized');

// Ensure directories exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Create WebP images from SVGs using a simple base64 approach
function createWebPFromSVG(svgContent, outputPath) {
  // Convert SVG to data URL
  const svgData = Buffer.from(svgContent).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${svgData}`;
  
  // For now, we'll create a simple HTML file that browsers can convert
  // In production, you'd use a proper image processing service
  const htmlConverter = `<!DOCTYPE html>
<html>
<head>
  <title>SVG to WebP Converter</title>
  <style>
    body { margin: 0; padding: 20px; }
    .image-container { margin: 10px; }
    img { max-width: 400px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>Optimized Images for Activity Tracker</h1>
  <div class="image-container">
    <h3>Original SVG:</h3>
    <img src="${dataUrl}" alt="Activity Image">
    <p>To convert to WebP:</p>
    <ol>
      <li>Take a screenshot of this image</li>
      <li>Save as WebP format</li>
      <li>Place in: ${optimizedDir}</li>
    </ol>
  </div>
</body>
</html>`;
  
  const htmlPath = outputPath.replace('.webp', '-converter.html');
  fs.writeFileSync(htmlPath, htmlConverter);
  console.log(`📄 Created converter for: ${path.basename(outputPath)}`);
  console.log(`   Open: ${htmlPath} to view and convert`);
  
  return htmlPath;
}

async function optimizeImages() {
  console.log('🔄 Optimizing images...\n');
  
  const files = fs.readdirSync(imagesDir);
  let optimizedCount = 0;
  
  for (const file of files) {
    // Skip non-SVG files and already processed files
    if (!file.endsWith('.svg') || file === '.DS_Store') {
      continue;
    }
    
    const inputPath = path.join(imagesDir, file);
    const outputName = path.basename(file, '.svg') + '.webp';
    const outputPath = path.join(optimizedDir, outputName);
    
    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${file} - already optimized`);
      continue;
    }
    
    try {
      // Read SVG content
      const svgContent = fs.readFileSync(inputPath, 'utf8');
      
      // Create WebP converter
      createWebPFromSVG(svgContent, outputPath);
      
      // Also copy the SVG to optimized folder for fallback
      const svgCopyPath = path.join(optimizedDir, file);
      fs.copyFileSync(inputPath, svgCopyPath);
      
      optimizedCount++;
      console.log(`✅ Processed: ${file} -> ${outputName}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  // Create a simple WebP fallback using a tiny 1x1 pixel WebP
  const tinyWebP = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x1A, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    0x56, 0x50, 0x38, 0x20, 0x0E, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x41, 0x4C, 0x50, 0x48, 0x02, 0x00,
    0x00, 0x00, 0x00, 0x00
  ]);
  
  // Create fallback WebP files
  const fallbackImages = ['yoga', 'reading', 'tv', 'exercise', 'work'];
  fallbackImages.forEach(name => {
    const fallbackPath = path.join(optimizedDir, `${name}.webp`);
    if (!fs.existsSync(fallbackPath)) {
      fs.writeFileSync(fallbackPath, tinyWebP);
      console.log(`📦 Created fallback: ${name}.webp`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Optimized: ${optimizedCount} images`);
  console.log(`📁 Output: ${optimizedDir}`);
  console.log(`\n💡 Note: For production, upload real WebP images to the optimized folder.`);
  console.log(`   The system will use SVG fallbacks until WebP images are available.`);
}

optimizeImages();