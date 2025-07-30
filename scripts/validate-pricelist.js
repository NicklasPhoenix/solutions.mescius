/**
 * Enhanced Pricelist Validator
 * Analyzes pricelist.json and provides comprehensive product filtering
 * Supports ALL license types: New, Renewal, Upgrade, Perpetual, Subscription
 * 
 * Enable debug mode: window.DEBUG_PRICING = true;
 */

class PricelistValidator {
    constructor(config = null) {
        this.priceList = [];
        this.config = config || window.PRICING_CONFIG || this.getDefaultConfig();
    }
    
    getDefaultConfig() {
        // Use the enhanced config if available, otherwise fall back to comprehensive config
        if (window.PRICING_CONFIG) {
            return window.PRICING_CONFIG;
        }
        
        return {
            currentProducts: [
                {
                    name: 'ComponentOne Studio',
                    keywords: ['ComponentOne Studio', 'ComponentOne Enterprise', 'ComponentOne Professional'],
                    versionPattern: /ComponentOne.*(?:v)?(\d+)/i,
                    preferLatestVersion: true,
                    category: 'UI Controls'
                },
                {
                    name: 'Wijmo Enterprise',
                    keywords: ['Wijmo Enterprise', 'Wijmo Professional', 'Wijmo'],
                    versionPattern: /Wijmo.*(?:v)?(\d+)/i,
                    preferLatestVersion: true,
                    category: 'JavaScript Controls'
                },
                {
                    name: 'ActiveReports.NET',
                    keywords: ['ActiveReports', 'ActiveReports.NET', 'ActiveReports .NET'],
                    versionPattern: /ActiveReports.*(?:v)?(\d+)/i,
                    preferLatestVersion: true,
                    category: 'Reporting'
                },
                {
                    name: 'SpreadJS',
                    keywords: ['SpreadJS', 'Spread JS'],
                    versionPattern: /SpreadJS.*(?:v)?(\d+)/i,
                    preferLatestVersion: true,
                    category: 'Spreadsheet'
                },
                {
                    name: 'Spread.NET',
                    keywords: ['Spread.NET', 'Spread .NET'],
                    versionPattern: /Spread\.NET.*(\d+)/i,
                    preferLatestVersion: true,
                    minimumVersion: 16,
                    category: 'Spreadsheet'
                },
                {
                    name: 'Documents for Excel (.NET)',
                    keywords: ['Document Solutions for Excel', 'GcExcel', 'Documents for Excel'],
                    versionPattern: /(?:Document Solutions for Excel|GcExcel).*v(\d+)/i,
                    preferLatestVersion: true,
                    category: 'Document API'
                },
                {
                    name: 'Documents for Word',
                    keywords: ['Document Solutions for Word', 'GcWord', 'Documents for Word'],
                    versionPattern: /(?:Document Solutions for Word|GcWord).*v(\d+)/i,
                    preferLatestVersion: true,
                    category: 'Document API'
                },
                {
                    name: 'Documents for PDF',
                    keywords: ['Document Solutions for PDF', 'GcPdf', 'Documents for PDF'],
                    versionPattern: /(?:Document Solutions for PDF|GcPdf).*v(\d+)/i,
                    preferLatestVersion: true,
                    category: 'Document API'
                },
                {
                    name: 'Documents for Imaging',
                    keywords: ['Document Solutions for Imaging', 'GcImaging', 'Documents for Imaging'],
                    versionPattern: /(?:Document Solutions for Imaging|GcImaging).*v(\d+)/i,
                    preferLatestVersion: true,
                    category: 'Document API'
                }
            ],
            licenseTypes: [
                { type: 'new-license', keywords: ['New License', 'ESD'], priority: 1, displayName: 'New License', tabId: 'new' },
                { type: 'renewal', keywords: ['Renewal', 'Maintenance Renewal'], priority: 2, displayName: 'Renewal', tabId: 'renewal' },
                { type: 'upgrade', keywords: ['Upgrade'], priority: 2, displayName: 'Upgrade', tabId: 'upgrade' },
                { type: 'perpetual', keywords: ['PERPETUAL', 'Perpetual'], priority: 3, displayName: 'Perpetual', tabId: 'perpetual' },
                { type: 'subscription', keywords: ['Subscription', 'Annual'], priority: 1, displayName: 'Subscription', tabId: 'subscription' }
            ],
            excludePatterns: [
                'Source Code', 'Compact Framework', 'Pre Renewal', 'Post Renewal', 
                'Base Product', 'Educational', 'Archive', 'Debugging', 'Beta', 
                'Legacy', 'Discontinued', 'Japanese Version', 'Promotion'
            ],
            priceFilter: { minPrice: 100, maxPrice: 15000 },
            editions: [
                { name: 'Enterprise', priority: 3 },
                { name: 'Professional', priority: 2 },
                { name: 'Standard', priority: 1 }
            ]
        };
    }

    async loadPriceList() {
        try {
            const response = await fetch('./pricelist.json');
            this.priceList = await response.json();
            console.log(`📊 Loaded ${this.priceList.length} products from pricelist.json`);
            return true;
        } catch (error) {
            console.error('❌ Error loading pricelist.json:', error);
            return false;
        }
    }

    analyzeProducts() {
        const analysis = {
            totalProducts: this.priceList.length,
            withValidPrices: 0,
            currentProducts: {},
            licenseTypeBreakdown: {},
            recommendations: {
                include: [],
                exclude: [],
                missing: []
            }
        };

        // Count products with valid prices
        analysis.withValidPrices = this.priceList.filter(p => 
            p.Euro && typeof p.Euro === 'number' && p.Euro > 0
        ).length;

        // Initialize license type breakdown
        this.config.licenseTypes?.forEach(licenseType => {
            analysis.licenseTypeBreakdown[licenseType.type] = 0;
        });

        // Analyze each configured product
        this.config.currentProducts?.forEach(configProduct => {
            const matches = this.findProductMatches(configProduct);
            analysis.currentProducts[configProduct.name] = matches;
            
            // Count by license type
            matches.forEach(product => {
                const licenseType = this.identifyLicenseType(product['Product Name']);
                if (analysis.licenseTypeBreakdown[licenseType] !== undefined) {
                    analysis.licenseTypeBreakdown[licenseType]++;
                }
            });
            
            if (matches.length === 0) {
                analysis.recommendations.missing.push(configProduct.name);
            }
        });

        return analysis;
    }

    findProductMatches(configProduct) {
        const matches = [];
        
        this.priceList.forEach(product => {
            const productName = product['Product Name'];
            
            // Check if product name matches any keywords
            const isMatch = configProduct.keywords?.some(keyword => 
                productName.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (isMatch) {
                const shouldInclude = this.shouldIncludeProduct(product);
                const version = this.extractVersion(productName, configProduct);
                const versionNumber = version ? parseInt(version) : 0;
                const licenseType = this.identifyLicenseType(productName);
                
                // Check minimum version requirement
                if (configProduct.minimumVersion && versionNumber > 0 && versionNumber < configProduct.minimumVersion) {
                    if (window.DEBUG_PRICING) {
                        console.log(`⚠️  Skipping "${productName}" - version ${versionNumber} below minimum ${configProduct.minimumVersion}`);
                    }
                    return; // Skip this product if version is below minimum
                }
                
                matches.push({
                    ...product,
                    recommended: shouldInclude.include,
                    reason: shouldInclude.reason,
                    version: version,
                    versionNumber: versionNumber,
                    licenseType: licenseType,
                    category: configProduct.category || 'Other'
                });
            }
        });

        // Sort by version (latest first), then license type priority, then price
        return matches.sort((a, b) => {
            // If we prefer latest version for this product
            if (configProduct.preferLatestVersion) {
                if (a.versionNumber !== b.versionNumber) {
                    return b.versionNumber - a.versionNumber; // Higher version first
                }
            }
            
            // Then sort by recommendation
            if (a.recommended !== b.recommended) {
                return b.recommended - a.recommended;
            }
            
            // Then by license type priority
            const aLicenseType = this.config.licenseTypes?.find(lt => lt.type === a.licenseType);
            const bLicenseType = this.config.licenseTypes?.find(lt => lt.type === b.licenseType);
            const aPriority = aLicenseType ? aLicenseType.priority : 999;
            const bPriority = bLicenseType ? bLicenseType.priority : 999;
            
            if (aPriority !== bPriority) {
                return aPriority - bPriority; // Lower priority number = higher priority
            }
            
            // Finally by price (lower first for individual developer licenses)
            return (a.Euro || 0) - (b.Euro || 0);
        });
    }

    /**
     * Get products organized by license type for tabbed interface
     */
    getProductsByLicenseType() {
        const productsByLicenseType = {};
        
        // Initialize each license type
        this.config.licenseTypes?.forEach(licenseType => {
            productsByLicenseType[licenseType.type] = {};
        });
        
        this.config.currentProducts?.forEach(configProduct => {
            const matches = this.findProductMatches(configProduct);
            
            matches.forEach(product => {
                const licenseType = product.licenseType;
                if (!productsByLicenseType[licenseType]) {
                    productsByLicenseType[licenseType] = {};
                }
                if (!productsByLicenseType[licenseType][configProduct.name]) {
                    productsByLicenseType[licenseType][configProduct.name] = [];
                }
                productsByLicenseType[licenseType][configProduct.name].push(product);
            });
        });
        
        return productsByLicenseType;
    }

    /**
     * Get the best product for each license type for each configured product
     */
    getRecommendedProductsByLicenseType() {
        const recommended = {};
        
        this.config.licenseTypes?.forEach(licenseType => {
            recommended[licenseType.type] = {};
        });
        
        this.config.currentProducts?.forEach(configProduct => {
            const matches = this.findProductMatches(configProduct);
            
            // Group by license type
            const byLicenseType = {};
            matches.forEach(product => {
                if (!byLicenseType[product.licenseType]) {
                    byLicenseType[product.licenseType] = [];
                }
                byLicenseType[product.licenseType].push(product);
            });
            
            // Get best product for each license type
            Object.entries(byLicenseType).forEach(([licenseType, products]) => {
                const recommendedProducts = products.filter(p => p.recommended);
                const bestProduct = recommendedProducts.length > 0 ? recommendedProducts[0] : products[0];
                
                if (bestProduct) {
                    recommended[licenseType][configProduct.name] = bestProduct;
                }
            });
        });
        
        return recommended;
    }

    extractVersion(productName, configProduct) {
        if (!configProduct.versionPattern) return null;
        
        const match = productName.match(configProduct.versionPattern);
        const version = match ? match[1] : null;
        
        // Debug logging for version extraction
        if (window.DEBUG_PRICING && version) {
            console.log(`🔍 Extracted version "${version}" from "${productName}" using pattern ${configProduct.versionPattern}`);
        }
        
        return version;
    }

    identifyLicenseType(productName) {
        const name = productName.toLowerCase();
        
        for (const licenseType of this.config.licenseTypes || []) {
            if (licenseType.keywords.some(keyword => 
                name.includes(keyword.toLowerCase()))) {
                return licenseType.type;
            }
        }
        
        return 'other';
    }

    shouldIncludeProduct(product) {
        const productName = product['Product Name'];
        const price = product.Euro;

        // Check exclusion patterns first
        const hasExcludePattern = this.config.excludePatterns?.some(pattern =>
            productName.toLowerCase().includes(pattern.toLowerCase())
        );

        if (hasExcludePattern) {
            return { include: false, reason: 'Contains excluded pattern' };
        }

        // Check price validity
        if (!price || typeof price !== 'number' || price <= 0) {
            return { include: false, reason: 'Invalid or missing price' };
        }

        // Check price range
        if (this.config.priceFilter) {
            if (price < this.config.priceFilter.minPrice) {
                return { include: false, reason: 'Price below minimum threshold' };
            }
            if (price > this.config.priceFilter.maxPrice) {
                return { include: false, reason: 'Price above maximum threshold' };
            }
        }

        return { include: true, reason: 'Meets all criteria' };
    }

    generateReport() {
        const analysis = this.analyzeProducts();
        
        console.log('📋 COMPREHENSIVE PRICELIST ANALYSIS REPORT');
        console.log('===========================================');
        console.log(`Total products in pricelist: ${analysis.totalProducts}`);
        console.log(`Products with valid prices: ${analysis.withValidPrices}`);
        
        console.log('\n📊 License Type Breakdown:');
        Object.entries(analysis.licenseTypeBreakdown).forEach(([type, count]) => {
            const licenseType = this.config.licenseTypes?.find(lt => lt.type === type);
            const displayName = licenseType ? licenseType.displayName : type;
            console.log(`   ${displayName}: ${count} products`);
        });
        console.log('');

        // Report on each configured product
        Object.entries(analysis.currentProducts).forEach(([productName, matches]) => {
            console.log(`🔍 ${productName}:`);
            
            if (matches.length === 0) {
                console.log('   ❌ No matches found in pricelist');
            } else {
                const recommended = matches.filter(m => m.recommended);
                console.log(`   ✅ Found ${matches.length} matches (${recommended.length} recommended)`);
                
                // Group by license type
                const byLicenseType = {};
                matches.forEach(product => {
                    if (!byLicenseType[product.licenseType]) {
                        byLicenseType[product.licenseType] = [];
                    }
                    byLicenseType[product.licenseType].push(product);
                });
                
                Object.entries(byLicenseType).forEach(([licenseType, products]) => {
                    const licenseTypeConfig = this.config.licenseTypes?.find(lt => lt.type === licenseType);
                    const displayName = licenseTypeConfig ? licenseTypeConfig.displayName : licenseType;
                    console.log(`   📦 ${displayName} (${products.length}):`);
                    products.slice(0, 2).forEach(product => {
                        const versionInfo = product.version ? ` v${product.version}` : '';
                        const recIcon = product.recommended ? '✅' : '⚠️';
                        console.log(`      ${recIcon} ${product['Product Name']}${versionInfo} - €${product.Euro}`);
                    });
                });
            }
            console.log('');
        });

        return analysis;
    }

    async validate() {
        const loaded = await this.loadPriceList();
        if (!loaded) return null;
        
        const report = this.generateReport();
        const productsByLicenseType = this.getProductsByLicenseType();
        const recommendedByLicenseType = this.getRecommendedProductsByLicenseType();
        
        console.log('🎯 PRODUCTS BY LICENSE TYPE:');
        console.log('=============================');
        
        Object.entries(productsByLicenseType).forEach(([licenseType, products]) => {
            const licenseTypeConfig = this.config.licenseTypes?.find(lt => lt.type === licenseType);
            const displayName = licenseTypeConfig ? licenseTypeConfig.displayName : licenseType;
            
            console.log(`\n📋 ${displayName.toUpperCase()}:`);
            Object.entries(products).forEach(([productName, productList]) => {
                if (productList.length > 0) {
                    const bestProduct = productList[0]; // Already sorted
                    const versionInfo = bestProduct.version ? ` v${bestProduct.version}` : '';
                    console.log(`   • ${productName}${versionInfo}: €${bestProduct.Euro}`);
                }
            });
        });

        return { 
            report, 
            productsByLicenseType,
            recommendedByLicenseType,
            validator: this
        };
    }
}

// Export for use
window.PricelistValidator = PricelistValidator;

// Enhanced validation function that returns comprehensive data
window.validatePricelist = async function() {
    const validator = new PricelistValidator();
    return await validator.validate();
};

// Get products organized by license type for tabbed interface
window.getProductsByLicenseType = async function() {
    const validator = new PricelistValidator();
    await validator.loadPriceList();
    return validator.getProductsByLicenseType();
};

// Get recommended products by license type
window.getRecommendedProductsByLicenseType = async function() {
    const validator = new PricelistValidator();
    await validator.loadPriceList();
    return validator.getRecommendedProductsByLicenseType();
};
