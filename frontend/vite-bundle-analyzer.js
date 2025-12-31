import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if stats.html exists from build
const statsPath = path.join(__dirname, 'dist/stats.html');
if (fs.existsSync(statsPath)) {
  console.log('📊 Opening bundle analyzer report...');
  
  // Open in default browser
  const open = (process.platform === 'darwin' ? 'open' : 
                process.platform === 'win32' ? 'start' : 'xdg-open');
  
  spawn(open, [statsPath], { stdio: 'inherit' });
} else {
  console.log('❌ No bundle analysis found. Building with analysis enabled...');
  
  // Run build with analyzer
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ANALYZE: 'true' }
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0 && fs.existsSync(statsPath)) {
      const open = (process.platform === 'darwin' ? 'open' : 
                    process.platform === 'win32' ? 'start' : 'xdg-open');
      spawn(open, [statsPath], { stdio: 'inherit' });
    }
  });
}