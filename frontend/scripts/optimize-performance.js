import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Optimizing for production performance...\n');

// 1. Generate optimized build
console.log('1. Generating production build...');
import('child_process').then(({ execSync }) => {
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build generated\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
});

// 2. Create .htaccess for Apache optimization
const htaccessContent = `# Performance optimizations
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>`;

const distDir = join(__dirname, '../dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

writeFileSync(join(distDir, '.htaccess'), htaccessContent);
console.log('✅ Created .htaccess for server optimization\n');

// 3. Update package.json with optimized scripts
const packagePath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'build:optimized': 'vite build --mode production',
  'preview:prod': 'npx serve dist -p 4173',
  'audit:prod': 'npm run build:optimized && npm run preview:prod & npx wait-on http://localhost:4173 && npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-prod-report.html --view',
  'analyze': 'npm run build:optimized && npx vite-bundle-analyzer'
};

writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json with production scripts\n');

console.log('🎉 Performance optimization setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run audit:prod');
console.log('2. Check: dist/stats.html for bundle analysis');
console.log('3. Review: lighthouse-prod-report.html');