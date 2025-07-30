/**
 * MESCIUS Vercel Analytics Integration
 * For static HTML websites
 */

// Initialize Vercel Analytics
(function() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Load Vercel Analytics script
    const script = document.createElement('script');
    script.src = 'https://va.vercel-scripts.com/v1/script.debug.js';
    script.defer = true;
    
    // Initialize analytics when script loads
    script.onload = function() {
        if (window.va) {
            window.va.track('pageview', {
                page: window.location.pathname,
                title: document.title,
                referrer: document.referrer
            });
            console.log('Vercel Analytics initialized');
        }
    };
    
    // Add script to head
    document.head.appendChild(script);
    
    // Track page navigation for SPAs (if needed in future)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    function trackPageView() {
        if (window.va) {
            window.va.track('pageview', {
                page: window.location.pathname,
                title: document.title,
                referrer: document.referrer
            });
        }
    }
    
    // Override history methods to track navigation
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(trackPageView, 0);
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(trackPageView, 0);
    };
    
    // Track back/forward navigation
    window.addEventListener('popstate', trackPageView);
    
    // Track custom events
    window.trackEvent = function(eventName, properties = {}) {
        if (window.va) {
            window.va.track(eventName, properties);
        }
    };
    
    // Track downloads, external links, etc.
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (!target) return;
        
        const href = target.href;
        if (!href) return;
        
        // Track external links
        if (href.includes('://') && !href.includes(window.location.hostname)) {
            window.trackEvent('external_link_click', {
                url: href,
                text: target.textContent.trim()
            });
        }
        
        // Track downloads
        const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.exe', '.msi'];
        if (downloadExtensions.some(ext => href.toLowerCase().includes(ext))) {
            window.trackEvent('file_download', {
                url: href,
                filename: href.split('/').pop()
            });
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName.toLowerCase() === 'form') {
            window.trackEvent('form_submit', {
                form_id: form.id || 'unknown',
                form_action: form.action || window.location.href
            });
        }
    });
})();
