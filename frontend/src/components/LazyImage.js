import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyImage = ({ 
  src, 
  alt = 'Activity image',
  width = '100%',
  height = 'auto',
  className = '',
  placeholderSrc,
  effect = 'blur',
  threshold = 100,
  ...props 
}) => {
  // Get the appropriate image source
  const getImageSource = () => {
    if (!src) return '/images/placeholder.svg';
    
    // Map activity names to images
    const activityImages = {
      'yoga': '/images/yoga.svg',
      'reading': '/images/reading.svg',
      'tv': '/images/tv.svg',
      'entertainment': '/images/tv.svg',
      'exercise': '/images/exercise.svg',
      'work': '/images/work.svg',
      'study': '/images/reading.svg',
      'meditation': '/images/yoga.svg',
      'fitness': '/images/exercise.svg'
    };
    
    // Check if src matches any activity
    const lowerSrc = src.toLowerCase();
    for (const [key, imagePath] of Object.entries(activityImages)) {
      if (lowerSrc.includes(key)) {
        return imagePath;
      }
    }
    
    // Return original if no match
    return src;
  };

  const imageSource = getImageSource();
  const placeholder = placeholderSrc || '/images/placeholder.svg';

  return (
    <LazyLoadImage
      src={imageSource}
      alt={alt}
      width={width}
      height={height}
      className={`lazy-image ${className}`}
      effect={effect}
      placeholderSrc={placeholder}
      loading="lazy"
      threshold={threshold}
      {...props}
    />
  );
};

export default LazyImage;
