import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Don't run performance monitoring in test environment
    if (process.env.NODE_ENV === 'test') {
      console.log('📊 Performance Monitor: Test mode - monitoring disabled');
      return;
    }

    console.log('📊 Performance Monitor: Initialized');
    
    // Track page load performance
    const trackPageLoad = () => {
      // Check if performance API is available (not available in Jest)
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0];
          const loadTime = navEntry.loadEventEnd - navEntry.startTime;
          console.log(`📊 Page Load Time: ${loadTime.toFixed(2)}ms`);
        }
      }
    };
    
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Check if PerformanceObserver is available
      if (typeof PerformanceObserver !== 'undefined') {
        // LCP (Largest Contentful Paint)
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
            }
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.log('LCP monitoring not available');
        }
        
        // CLS (Cumulative Layout Shift)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
              }
            }
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.log('CLS monitoring not available');
        }
      }
    };
    
    // Run tracking
    trackPageLoad();
    trackWebVitals();
    
    // Cleanup
    return () => {
      console.log('📊 Performance Monitor: Cleanup');
    };
  }, []);
  
  return null;
};

export default PerformanceMonitor;
