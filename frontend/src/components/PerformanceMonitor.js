import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    console.log('📊 Performance Monitor: Initialized');
    
    // Track page load performance
    const trackPageLoad = () => {
      if (performance.getEntriesByType('navigation').length > 0) {
        const navEntry = performance.getEntriesByType('navigation')[0];
        const loadTime = navEntry.loadEventEnd - navEntry.startTime;
        console.log(`📊 Page Load Time: ${loadTime.toFixed(2)}ms`);
      }
    };
    
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }
      });
      
      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
          }
        }
      });
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.log('Web Vitals tracking not available');
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
