# Vercel Analytics Integration Guide

## Overview
This document describes how Vercel Analytics has been integrated into the MESCIUS static website for performance monitoring and user behavior tracking.

## What's Installed
- **Package**: `@vercel/analytics` (v1.5.0)
- **Type**: Static website analytics (not Next.js Speed Insights)
- **Implementation**: Custom JavaScript integration for static HTML sites

## Files Added/Modified

### New Files
1. **`scripts/analytics.js`** - Main analytics integration
2. **`vercel.json`** - Vercel deployment configuration

### Modified Files
Analytics script added to:
- `index.html` - Main homepage
- `pricing/index.html` - Pricing page
- `bundles/index.html` - Bundles page
- `blueprints/bi-performance/index.html` - Sample blueprint page

## How It Works

### Automatic Tracking
The analytics automatically tracks:
- **Page Views**: Every page load and navigation
- **External Link Clicks**: Links to external websites
- **File Downloads**: PDF, DOC, XLS, ZIP, EXE, MSI files
- **Form Submissions**: All form interactions

### Custom Event Tracking
You can track custom events using:
```javascript
window.trackEvent('event_name', {
    property1: 'value1',
    property2: 'value2'
});
```

### Examples
```javascript
// Track product interest
window.trackEvent('product_interest', {
    product: 'SpreadJS',
    category: 'JavaScript Components'
});

// Track pricing card clicks
window.trackEvent('pricing_card_click', {
    product_id: '277382',
    price: '€4,055',
    license_type: 'renewal'
});

// Track demo requests
window.trackEvent('demo_request', {
    product: 'ComponentOne',
    page: 'pricing'
});
```

## Integration Pattern for New Pages

To add analytics to new pages, add this line before the closing `</body>` tag:

```html
<script src="../scripts/analytics.js"></script>
```

Adjust the path based on your page location:
- Root level: `scripts/analytics.js`
- One level deep: `../scripts/analytics.js`  
- Two levels deep: `../../scripts/analytics.js`

## Vercel Deployment

### Prerequisites
1. Deploy to Vercel
2. Enable Analytics in Vercel dashboard
3. Verify domain is correctly configured

### Configuration
The `vercel.json` file includes:
- Static site deployment configuration
- Cache headers for performance
- Route handling

### Expected Results
After deployment:
- Page views tracked automatically
- User interactions monitored
- Performance metrics collected
- Real-time dashboard available in Vercel

## Monitoring & Data

### What You'll See
- **Page Views**: Which pages are most popular
- **User Flows**: How users navigate through the site
- **External Links**: Which external resources users access
- **Downloads**: What files users download most
- **Forms**: Form submission rates and success

### Access Dashboard
1. Log into Vercel dashboard
2. Select your project
3. Navigate to "Analytics" tab
4. View real-time and historical data

## Performance Impact
- **Minimal**: ~2KB additional JavaScript
- **Async Loading**: Doesn't block page rendering
- **Cached**: Script cached by CDN
- **Optional**: Gracefully degrades if blocked

## Privacy & Compliance
- **Cookie-Free**: Uses privacy-friendly tracking
- **GDPR Compliant**: No personal data collection
- **Aggregated Data**: Individual users not identified
- **Respects Do Not Track**: Honor user preferences

## Troubleshooting

### No Data Showing
1. Check if analytics script is loading
2. Verify Vercel project has analytics enabled
3. Wait 30 seconds after page load
4. Check for ad blockers or privacy extensions

### Custom Events Not Working
```javascript
// Check if analytics is loaded
console.log(window.va ? 'Analytics loaded' : 'Analytics not loaded');

// Test custom event
window.trackEvent('test_event', { test: true });
```

### Debug Mode
The analytics loads in debug mode during development to show console logs.

## Future Enhancements

### Enhanced E-commerce Tracking
```javascript
// Track product views
window.trackEvent('product_view', {
    product_id: '277382',
    product_name: 'ComponentOne Studio Enterprise',
    category: 'Developer Tools',
    price: 4055
});

// Track add to cart
window.trackEvent('add_to_cart', {
    product_id: '277382',
    quantity: 1,
    value: 4055
});
```

### A/B Testing Integration
```javascript
// Track experiment variants
window.trackEvent('experiment_view', {
    experiment_name: 'pricing_page_layout',
    variant: 'version_b'
});
```

---

**Implementation Date**: July 30, 2025  
**Version**: 1.0  
**Maintainer**: MESCIUS Development Team
