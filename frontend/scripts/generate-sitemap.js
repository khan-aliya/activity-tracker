import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/login', priority: 0.8, changefreq: 'monthly' },
  { url: '/register', priority: 0.8, changefreq: 'monthly' },
  { url: '/dashboard', priority: 0.9, changefreq: 'daily' },
  { url: '/activities', priority: 0.9, changefreq: 'daily' },
  { url: '/activities/create', priority: 0.7, changefreq: 'weekly' },
  { url: '/reports', priority: 0.8, changefreq: 'weekly' },
  { url: '/profile', priority: 0.6, changefreq: 'monthly' },
  { url: '/settings', priority: 0.5, changefreq: 'monthly' },
];

const buildDir = join(__dirname, '../dist');
const baseUrl = 'https://activity-tracker.example.com'; // Change this to your actual domain

// Ensure build directory exists
if (!existsSync(buildDir)) {
  console.log('⚠️  Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

const sitemapPath = join(buildDir, 'sitemap.xml');
writeFileSync(sitemapPath, sitemap);
console.log(`✅ Sitemap generated at: ${sitemapPath}`);

// Also create robots.txt
const robots = `# robots.txt for Activity Tracker
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /private/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
# Crawl-delay: 10`;

const robotsPath = join(buildDir, 'robots.txt');
writeFileSync(robotsPath, robots);
console.log(`✅ Robots.txt generated at: ${robotsPath}`);