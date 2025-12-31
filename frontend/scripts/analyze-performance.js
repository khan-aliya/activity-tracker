import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Lighthouse report
const reportPath = path.join(__dirname, '../lighthouse-report.json');

if (!fs.existsSync(reportPath)) {
  console.log('❌ No Lighthouse report found. Run: npm run lighthouse');
  process.exit(1);
}

try {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const categories = report.categories;
  const audits = report.audits;
  
  console.log('📊 Lighthouse Performance Analysis');
  console.log('='.repeat(60));
  
  // Display scores
  console.log('\n🎯 Performance Scores:');
  Object.entries(categories).forEach(([key, category]) => {
    const score = Math.round(category.score * 100);
    let emoji = '🔴';
    if (score >= 90) emoji = '🟢';
    else if (score >= 70) emoji = '🟡';
    
    console.log(`${emoji} ${category.title}: ${score}/100`);
  });
  
  // Display key metrics
  console.log('\n📈 Core Web Vitals:');
  const coreMetrics = {
    'first-contentful-paint': 'First Contentful Paint',
    'largest-contentful-paint': 'Largest Contentful Paint',
    'cumulative-layout-shift': 'Cumulative Layout Shift',
    'total-blocking-time': 'Total Blocking Time',
    'speed-index': 'Speed Index'
  };
  
  Object.entries(coreMetrics).forEach(([id, name]) => {
    const audit = audits[id];
    if (audit) {
      console.log(`• ${name}: ${audit.displayValue || 'N/A'} (${audit.score}/100)`);
    }
  });
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  const recommendations = [];
  
  // Check image optimization
  const usesOptimizedImages = audits['uses-optimized-images'];
  if (usesOptimizedImages && usesOptimizedImages.score < 1) {
    recommendations.push('Optimize images: Convert to WebP format');
  }
  
  // Check caching
  const usesLongCache = audits['uses-long-cache-ttl'];
  if (usesLongCache && usesLongCache.score < 1) {
    recommendations.push('Implement caching: Set cache headers for static assets');
  }
  
  // Check bundle size
  const totalByteWeight = audits['total-byte-weight'];
  if (totalByteWeight && totalByteWeight.numericValue > 5000000) {
    recommendations.push('Reduce bundle size: Code split and tree shake');
  }
  
  if (recommendations.length === 0) {
    console.log('✅ Great job! All performance best practices are met.');
  } else {
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
  }
  
  // Save summary report
  const summary = {
    timestamp: new Date().toISOString(),
    scores: Object.fromEntries(
      Object.entries(categories).map(([key, cat]) => [key, Math.round(cat.score * 100)])
    ),
    recommendations: recommendations
  };
  
  const summaryPath = path.join(__dirname, '../performance-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📄 Summary saved to: ${summaryPath}`);
  
} catch (error) {
  console.error('Error analyzing performance:', error.message);
}