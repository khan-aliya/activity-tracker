import { writeFileSync } from 'fs';

console.log('🎨 Creating optimized SVG images for Activity Tracker...\n');

// Define activities
const activities = [
  { name: 'yoga', color: '#4CAF50', emoji: '🧘', title: 'YOGA' },
  { name: 'reading', color: '#2196F3', emoji: '📚', title: 'READING' },
  { name: 'tv', color: '#FF9800', emoji: '📺', title: 'ENTERTAINMENT' },
  { name: 'exercise', color: '#E91E63', emoji: '💪', title: 'EXERCISE' },
  { name: 'work', color: '#9C27B0', emoji: '💼', title: 'WORK' }
];

// Create SVG for each activity
activities.forEach(activity => {
  const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${activity.color}" rx="15"/>
    <text x="200" y="120" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48">${activity.emoji}</text>
    <text x="200" y="180" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${activity.title}</text>
    <text x="200" y="220" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="14">Track your ${activity.name} activities</text>
  </svg>`;

  writeFileSync(`${activity.name}.svg`, svgContent);
  console.log(`✅ Created ${activity.name}.svg`);
});

// Create placeholder
const placeholderSvg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="150" fill="#f8f9fa" rx="8"/>
  <text x="100" y="75" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="14">Loading...</text>
</svg>`;

writeFileSync('placeholder.svg', placeholderSvg);
console.log('✅ Created placeholder.svg');

console.log('\n🎉 Successfully created 6 SVG images!');
console.log('📁 Location: frontend/public/images/');
