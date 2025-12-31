import { writeFileSync } from 'fs';

// Create tiny WebP images as fallbacks
const webpData = 'UklGRh4AAABXRUJQVlA4IBIAAAAwAQCdASoBAAEALtC+oQFaSygBABABAA==';

['yoga', 'reading', 'tv', 'exercise', 'work'].forEach(name => {
  const buffer = Buffer.from(webpData, 'base64');
  writeFileSync(`optimized/${name}.webp`, buffer);
  console.log(`Created optimized/${name}.webp (placeholder)`);
});

console.log('\n✅ WebP fallback images created');
