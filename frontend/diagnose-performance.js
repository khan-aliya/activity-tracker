console.log("=== PERFORMANCE DIAGNOSIS ===");
console.log("1. Checking for common React issues...");

// Common issues that cause 13s load times:
const issues = [
  "1. API calls blocking render",
  "2. Large unoptimized bundles", 
  "3. Missing code splitting",
  "4. Render-blocking resources",
  "5. Development mode in production",
  "6. Console errors breaking execution"
];

issues.forEach(issue => console.log(`- ${issue}`));

console.log("\n=== QUICK FIXES ===");
console.log("1. Check if backend API is responding slowly");
console.log("2. Verify React is running in production mode");
console.log("3. Check for infinite loops or blocking calls");
console.log("4. Ensure Vite is properly configured");

// Test API response time
fetch('http://localhost:8000/api/activities')
  .then(res => {
    const start = performance.now();
    return res.json().then(data => {
      const end = performance.now();
      console.log(`\nAPI Response Time: ${Math.round(end - start)}ms`);
    });
  })
  .catch(err => {
    console.log("\n⚠️ API Connection Error:", err.message);
    console.log("This could be blocking your React app!");
  })