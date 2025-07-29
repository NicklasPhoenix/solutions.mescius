/**
 * Pricing Configuration
 * Define which products and license types to show on the pricing page
 */

const PRICING_CONFIG = {
    // Current products we want to display
    currentProducts: [
        {
            name: 'ComponentOne Studio',
            keywords: ['ComponentOne Studio', 'ComponentOne Enterprise', 'ComponentOne Professional'],
            category: 'UI Controls',
            color: 'var(--componentone)',
            description: 'Complete .NET UI control suite',
            versionPattern: /ComponentOne.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'Wijmo Enterprise',
            keywords: ['Wijmo Enterprise', 'Wijmo Professional', 'Wijmo'],
            category: 'JavaScript Controls', 
            color: 'var(--wijmo)',
            description: 'JavaScript UI controls and data visualization',
            versionPattern: /Wijmo.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'ActiveReports.NET',
            keywords: ['ActiveReports.NET', 'ActiveReports .NET', 'ActiveReports'],
            category: 'Reporting',
            color: 'var(--activereports)', 
            description: 'Comprehensive .NET reporting solution',
            versionPattern: /ActiveReports.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'SpreadJS',
            keywords: ['SpreadJS', 'Spread JS'],
            category: 'Spreadsheet',
            color: 'var(--spread)',
            description: 'Excel-like JavaScript spreadsheet component',
            versionPattern: /SpreadJS.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'Spread.NET',
            keywords: ['Spread.NET 18', 'Spread .NET 18'],
            category: 'Spreadsheet',
            color: 'var(--spread)',
            description: '.NET Excel-compatible spreadsheet controls',
            versionPattern: /Spread\.NET\s+(\d+)/i,
            preferLatestVersion: true,
            minimumVersion: 16 // Only get version 16 and above
        },
        {
            name: 'Documents for Excel (.NET)',
            keywords: ['GrapeCity Documents for Excel', 'GcExcel', 'Documents for Excel'],
            category: 'Document API',
            color: 'var(--documentsolutions)',
            description: 'High-performance Excel document API for .NET',
            versionPattern: /Documents for Excel.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'Documents for Word',
            keywords: ['GrapeCity Documents for Word', 'GcWord', 'Documents for Word'],
            category: 'Document API',
            color: 'var(--documentsolutions)',
            description: 'Word document generation API',
            versionPattern: /Documents for Word.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'Documents for PDF',
            keywords: ['GrapeCity Documents for PDF', 'GcPdf', 'Documents for PDF'],
            category: 'Document API', 
            color: 'var(--documentsolutions)',
            description: 'PDF creation and manipulation API',
            versionPattern: /Documents for PDF.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'Documents for Imaging',
            keywords: ['GrapeCity Documents for Imaging', 'GcImaging', 'Documents for Imaging'],
            category: 'Document API',
            color: 'var(--documentsolutions)',
            description: 'Advanced imaging and photo processing API',
            versionPattern: /Documents for Imaging.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        },
        {
            name: 'Documents for Excel (JS)',
            keywords: ['Documents for Excel JavaScript', 'Documents for Excel JS', 'GcExcel JavaScript'],
            category: 'Document API',
            color: 'var(--documentsolutions)',
            description: 'High-performance Excel document API for JavaScript',
            versionPattern: /Documents for Excel.*JavaScript.*(?:v)?(\d+)/i,
            preferLatestVersion: true
        }
    ],

    // License types to include (in order of preference)
    licenseTypes: [
        {
            type: 'new-license',
            keywords: ['New License', 'ESD'],
            priority: 1,
            label: 'New License'
        },
        {
            type: 'renewal',
            keywords: ['Renewal', 'Annual'],
            priority: 2,
            label: 'Renewal'
        },
        {
            type: 'upgrade',
            keywords: ['Upgrade'],
            priority: 3,
            label: 'Upgrade'
        },
        {
            type: 'subscription',
            keywords: ['Subscription'],
            priority: 4,
            label: 'Subscription'
        }
    ],

    // Edition preferences (higher priority = preferred)
    editions: [
        { name: 'Enterprise', priority: 3 },
        { name: 'Professional', priority: 2 },
        { name: 'Standard', priority: 1 }
    ],

    // Patterns to exclude
    excludePatterns: [
        'Source Code',
        'Compact Framework', 
        'CF ',
        'Pre Renewal',
        'Post Renewal',
        'Base Product',
        'Educational',
        'Archive',
        'Debugging',
        'Beta',
        'Legacy',
        'Discontinued',
        'Obsolete',
        'Trial',
        'Demo',
        'Development Only',
        'Redistribution',
        'Runtime'
    ],

    // Price thresholds
    priceFilter: {
        minPrice: 100,  // Minimum price in EUR
        maxPrice: 50000 // Maximum price in EUR  
    },

    // Bundle configurations (map to bundle cards)
    bundles: {
        'net-professional': {
            name: '.NET Professional Suite',
            products: ['ComponentOne Studio', 'Wijmo Enterprise', 'ActiveReports.NET', 'Spread.NET'],
            id: '285847'
        },
        'spreadjs-documents': {
            name: 'SpreadJS+Documents', 
            products: ['SpreadJS', 'Documents for Excel'],
            id: '285849'
        },
        'spread-documents': {
            name: 'Spread.NET+Documents',
            products: ['Spread.NET', 'Documents for Excel'],
            id: '285851'
        },
        'analytics-reporting': {
            name: 'Real-Time Analytics & Reporting',
            products: ['ActiveReports.NET', 'Wijmo Enterprise'], 
            id: '285868'
        },
        'automated-reporting': {
            name: 'Automated Reporting & Document Generation',
            products: ['ActiveReports.NET', 'Documents for Excel'],
            id: '285867'
        },
        'blazor-hybrid': {
            name: 'Blazor Hybrid Power Pack',
            products: ['ComponentOne Studio', 'Wijmo Enterprise', 'Documents for Excel'],
            id: '285848'
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRICING_CONFIG;
} else {
    window.PRICING_CONFIG = PRICING_CONFIG;
}