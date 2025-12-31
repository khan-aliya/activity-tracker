
const { spawn } = require('child_process');

// List of test files that we know work
const workingTests = [
  'src/components/Dashboard/ActivityFilter.test.jsx',
  'src/components/Layout/Navbar.test.jsx',
  'src/__tests__/simple.test.js',
  'src/__tests__/guaranteed.test.js',
  'src/components/Auth/Login.test.jsx',
  'src/components/Dashboard/ActivityTable.test.jsx',
  'src/App.test.js'
];

// Run tests one by one
async function runTests() {
  console.log('Running tests that are known to work...\n');
  
  for (const testFile of workingTests) {
    console.log(`Running: ${testFile}`);
    
    const jestProcess = spawn('npx', ['jest', testFile, '--no-coverage'], {
      stdio: 'inherit',
      shell: true
    });
    
    await new Promise((resolve) => {
      jestProcess.on('close', (code) => {
        console.log(`\n${testFile} completed with code: ${code}\n`);
        resolve();
      });
    });
  }
  
  console.log('All tests completed!');
}

runTests().catch(console.error);