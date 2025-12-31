const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runLighthouse() {
  console.log('🚀 Starting Lighthouse audit...');
  console.log('Make sure your development server is running on http://localhost:5173\n');
  
  return new Promise((resolve, reject) => {
    // Run Lighthouse via npx
    const lighthouseProcess = spawn('npx', [
      'lighthouse',
      'http://localhost:5173',
      '--output=html',
      '--output-path=./lighthouse-report.html',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags="--headless --no-sandbox --disable-gpu"'
    ], {
      stdio: 'inherit',
      shell: true
    });

    lighthouseProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Lighthouse audit completed!');
        
        // Read and display scores
        try {
          const reportPath = path.join(__dirname, '../lighthouse-report.html');
          if (fs.existsSync(reportPath)) {
            const reportDir = path.join(__dirname, '../lighthouse-reports');
            if (!fs.existsSync(reportDir)) {
              fs.mkdirSync(reportDir, { recursive: true });
            }
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const newReportPath = path.join(reportDir, `lighthouse-report-${timestamp}.html`);
            fs.copyFileSync(reportPath, newReportPath);
            
            console.log(`📄 Report saved to: ${newReportPath}`);
            console.log('\n📊 Open the HTML file in your browser to view detailed results.');
          }
        } catch (error) {
          console.log('Report generated at: lighthouse-report.html');
        }
        
        resolve();
      } else {
        console.error(`\n❌ Lighthouse failed with code: ${code}`);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Make sure your dev server is running: npm run dev');
        console.log('2. Check if Chrome is installed');
        console.log('3. Try running manually: npx lighthouse http://localhost:5173 --view');
        reject(new Error(`Lighthouse failed with code ${code}`));
      }
    });
  });
}

// Simple CLI script to show scores
function showBasicInstructions() {
  console.log(`
🌐 Activity Tracker - Lighthouse Performance Testing
===================================================

Available Commands:
1. Quick Audit:    npx lighthouse http://localhost:5173 --view
2. Full Report:    npx lighthouse http://localhost:5173 --output=html --output-path=./report.html
3. Mobile Test:    npx lighthouse http://localhost:5173 --form-factor=mobile
4. All Categories: npx lighthouse http://localhost:5173 --only-categories=performance,accessibility,best-practices,seo,pwa

Performance Targets:
• First Contentful Paint: < 1.8s
• Largest Contentful Paint: < 2.5s
• Cumulative Layout Shift: < 0.1
• Total Blocking Time: < 200ms
• Speed Index: < 3.4s
`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showBasicInstructions();
  } else {
    runLighthouse().catch(console.error);
  }
}

module.exports = { runLighthouse };