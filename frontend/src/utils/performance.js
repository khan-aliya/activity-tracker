// Performance monitoring utility
export const PerformanceMonitor = {
    metrics: {},
    
    startTimer(label) {
        this.metrics[label] = {
            start: performance.now(),
            end: null,
            duration: null
        };
    },
    
    endTimer(label) {
        if (this.metrics[label]) {
            this.metrics[label].end = performance.now();
            this.metrics[label].duration = 
                this.metrics[label].end - this.metrics[label].start;
            
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏱️ ${label}: ${this.metrics[label].duration.toFixed(2)}ms`);
            }
            
            return this.metrics[label].duration;
        }
        return null;
    },
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            if (navigationTiming) {
                const metrics = {
                    domContentLoaded: navigationTiming.domContentLoadedEventEnd,
                    pageLoad: navigationTiming.loadEventEnd,
                    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
                    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
                };
                
                console.table(metrics);
            }
        });
    }
};

// Auto-initialize
if (typeof window !== 'undefined') {
    PerformanceMonitor.measurePageLoad();
}