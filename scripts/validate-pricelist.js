/**
 * Pricelist Validator
 * Analyzes pricelist.json and suggests which products to include/exclude
 * 
 * Enable debug mode: window.DEBUG_PRICING = true;
 */

class PricelistValidator {
    constructor(config = null) {
        this.priceList = [];
        this.config = config || window.PRICING_CONFIG || this.getDefaultConfig();
    }
    
    getDefaultConfig() {
        // Use the enhanced config if available, otherwise fall back to basic config
        if (window.PRICING_CONFIG) {
            return window.PRICING_CONFIG;
        }
        
        return {
            currentProducts: [
                {
                    name: 'ComponentOne Studio',
                    keywords: ['ComponentOne Studio', 'ComponentOne Enterprise', 'ComponentOne Professional'],
                    versionPattern: /ComponentOne.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'Wijmo Enterprise',
                    keywords: ['Wijmo Enterprise', 'Wijmo Professional', 'Wijmo'],
                    versionPattern: /Wijmo.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'ActiveReports.NET',
                    keywords: ['ActiveReports.NET', 'ActiveReports .NET', 'ActiveReports'],
                    versionPattern: /ActiveReports.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'SpreadJS',
                    keywords: ['SpreadJS', 'Spread JS'],
                    versionPattern: /SpreadJS.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'Spread.NET',
                    keywords: ['Spread.NET 18', 'Spread .NET 18'],
                    versionPattern: /Spread\.NET\s+(\d+)/i,
                    preferLatestVersion: true,
                    minimumVersion: 16
                },
                {
                    name: 'Documents for Excel (.NET)',
                    keywords: ['GrapeCity Documents for Excel', 'GcExcel', 'Documents for Excel'],
                    versionPattern: /Documents for Excel.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'Documents for Word',
                    keywords: ['GrapeCity Documents for Word', 'GcWord', 'Documents for Word'],
                    versionPattern: /Documents for Word.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'Documents for PDF',
                    keywords: ['GrapeCity Documents for PDF', 'GcPdf', 'Documents for PDF'],
                    versionPattern: /Documents for PDF.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'Documents for Imaging',
                    keywords: ['GrapeCity Documents for Imaging', 'GcImaging', 'Documents for Imaging'],
                    versionPattern: /Documents for Imaging.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                },
                {
                    name: 'Documents for Excel (JS)',
                    keywords: ['Documents for Excel JavaScript', 'Documents for Excel JS', 'GcExcel JavaScript'],
                    versionPattern: /Documents for Excel.*JavaScript.*(?:v)?(\d+)/i,
                    preferLatestVersion: true
                }
            ],
            licenseTypes: [
                { type: 'new-license', keywords: ['New License', 'ESD', 'Developer License'], priority: 1 },
                { type: 'renewal', keywords: ['Renewal'], priority: 3 },
                { type: 'upgrade', keywords: ['Upgrade'], priority: 2 }
            ],
            excludePatterns: [
                'Source Code', 'Compact Framework', 'Pre Renewal', 'Post Renewal', 
                'Base Product', 'Educational', 'Archive', 'Debugging', 'Beta', 
                'Legacy', 'Discontinued', 'Team License', 'Site License', 'SITE LICENSE',
                'Team Unlimited', '10 Pack', '5 Developer', 'Deployment License',
                'Unlimited Domain', 'SaaS (*.*)', 'Pipeline License', 'with Maintenance',
                'w/ Maintenance', 'w. Platinum Support', 'Platinum Support'
            ],
            priceFilter: { minPrice: 100, maxPrice: 5000 }, // Focus on individual developer licenses
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

        // Analyze each configured product
        this.config.currentProducts?.forEach(configProduct => {
            const matches = this.findProductMatches(configProduct);
            analysis.currentProducts[configProduct.name] = matches;
            
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
                    versionNumber: versionNumber
                });
            }
        });

        // Sort by version (latest first), then recommendation, then license type preference, then price
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
            
            // Prefer "New License" or "ESD" over upgrades and renewals
            const aIsNew = a['Product Name'].toLowerCase().includes('new license') || 
                          a['Product Name'].toLowerCase().includes('esd');
            const bIsNew = b['Product Name'].toLowerCase().includes('new license') || 
                          b['Product Name'].toLowerCase().includes('esd');
            
            if (aIsNew !== bIsNew) {
                return bIsNew - aIsNew; // New licenses first
            }
            
            // Prefer upgrade over renewal
            const aIsUpgrade = a['Product Name'].toLowerCase().includes('upgrade');
            const bIsUpgrade = b['Product Name'].toLowerCase().includes('upgrade');
            const aIsRenewal = a['Product Name'].toLowerCase().includes('renewal');
            const bIsRenewal = b['Product Name'].toLowerCase().includes('renewal');
            
            if (aIsUpgrade && bIsRenewal) return -1;
            if (bIsUpgrade && aIsRenewal) return 1;
            
            // Finally by price (lower first for individual developer licenses)
            return (a.Euro || 0) - (b.Euro || 0);
        });
    }

    /**
     * Get the best (recommended) products with latest versions
     * This method returns one product per configured product type
     */
    getRecommendedProducts() {
        const recommended = {};
        
        this.config.currentProducts?.forEach(configProduct => {
            const matches = this.findProductMatches(configProduct);
            
            // Filter to only recommended products
            const recommendedMatches = matches.filter(product => product.recommended);
            
            if (recommendedMatches.length > 0) {
                // Take the first one (already sorted by version, recommendation, license type, price)
                const bestProduct = recommendedMatches[0];
                
                // Additional validation for the best product
                if (window.DEBUG_PRICING) {
                    console.log(`🎯 Best product for ${configProduct.name}: ${bestProduct['Product Name']} - €${bestProduct.Euro}`);
                }
                
                recommended[configProduct.name] = bestProduct;
            } else if (matches.length > 0) {
                // If no recommended products, log why and potentially take the best available
                if (window.DEBUG_PRICING) {
                    console.warn(`⚠️ No recommended products found for ${configProduct.name}, available matches:`);
                    matches.slice(0, 3).forEach(product => {
                        console.log(`   • ${product['Product Name']} - €${product.Euro} (${product.reason})`);
                    });
                }
                
                // Only take non-recommended if it's at least a reasonable price
                if (matches[0].Euro <= 3000) {
                    recommended[configProduct.name] = matches[0];
                }
            } else {
                if (window.DEBUG_PRICING) {
                    console.warn(`❌ No matches found for ${configProduct.name}`);
                }
            }
        });
        
        return recommended;
    }

    /**
     * Get all available versions of a specific product
     */
    getProductVersions(productName) {
        const configProduct = this.config.currentProducts?.find(cp => cp.name === productName);
        if (!configProduct) {
            console.warn(`Product configuration not found for: ${productName}`);
            return [];
        }
        
        return this.findProductMatches(configProduct);
    }

    /**
     * Get products by category
     */
    getProductsByCategory(category) {
        const productsByCategory = {};
        
        this.config.currentProducts?.forEach(configProduct => {
            if (!category || configProduct.category === category) {
                const matches = this.findProductMatches(configProduct);
                if (matches.length > 0) {
                    productsByCategory[configProduct.name] = matches;
                }
            }
        });
        
        return productsByCategory;
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

    shouldIncludeProduct(product) {
        const productName = product['Product Name'];
        const price = product.Euro;

        // Check exclusion patterns first (most important)
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

        // Check price range (focus on individual developer licenses)
        if (this.config.priceFilter) {
            if (price < this.config.priceFilter.minPrice) {
                return { include: false, reason: 'Price below minimum threshold' };
            }
            if (price > this.config.priceFilter.maxPrice) {
                return { include: false, reason: 'Price above maximum threshold' };
            }
        }

        // Prefer "New License" or "ESD" products
        const isNewLicense = productName.toLowerCase().includes('new license') || 
                           productName.toLowerCase().includes('esd') ||
                           productName.toLowerCase().includes('developer license');
        
        // Heavily penalize team, site, and enterprise multi-user licenses
        const isMultiUserLicense = productName.toLowerCase().includes('team') ||
                                 productName.toLowerCase().includes('site') ||
                                 productName.toLowerCase().includes('pack') ||
                                 productName.toLowerCase().includes('unlimited') ||
                                 productName.toLowerCase().includes('deployment');

        if (isMultiUserLicense) {
            return { include: false, reason: 'Multi-user license (not individual developer)' };
        }

        // Check for maintenance/support add-ons that inflate the price
        const hasMaintenanceAddons = productName.toLowerCase().includes('platinum support') ||
                                   productName.toLowerCase().includes('w/ maintenance') ||
                                   productName.toLowerCase().includes('w. maintenance');

        if (hasMaintenanceAddons) {
            return { include: false, reason: 'Includes maintenance/support add-ons' };
        }

        // Prefer basic individual developer licenses
        if (isNewLicense) {
            return { include: true, reason: 'Individual developer new license' };
        }

        // Accept upgrade licenses as secondary option
        const isUpgrade = productName.toLowerCase().includes('upgrade');
        if (isUpgrade) {
            return { include: true, reason: 'Individual developer upgrade license' };
        }

        // Be more selective about renewals
        const isRenewal = productName.toLowerCase().includes('renewal');
        if (isRenewal && price <= (this.config.priceFilter?.maxPrice || 3000)) {
            return { include: true, reason: 'Individual developer renewal license' };
        }

        // Default case - if it passes all filters, it's probably acceptable
        return { include: true, reason: 'Meets basic criteria' };
    }

    generateReport() {
        const analysis = this.analyzeProducts();
        
        console.log('📋 PRICELIST ANALYSIS REPORT');
        console.log('=====================================');
        console.log(`Total products in pricelist: ${analysis.totalProducts}`);
        console.log(`Products with valid prices: ${analysis.withValidPrices}`);
        console.log('');

        // Report on each configured product
        Object.entries(analysis.currentProducts).forEach(([productName, matches]) => {
            console.log(`🔍 ${productName}:`);
            
            if (matches.length === 0) {
                console.log('   ❌ No matches found in pricelist');
            } else {
                const recommended = matches.filter(m => m.recommended);
                const notRecommended = matches.filter(m => !m.recommended);
                
                console.log(`   ✅ Found ${matches.length} matches (${recommended.length} recommended)`);
                
                if (recommended.length > 0) {
                    console.log('   📦 Recommended products:');
                    recommended.slice(0, 3).forEach(product => {
                        console.log(`      • ${product['Product Name']} - €${product.Euro}`);
                    });
                }
                
                if (notRecommended.length > 0 && notRecommended.length <= 5) {
                    console.log('   ⚠️  Not recommended:');
                    notRecommended.slice(0, 3).forEach(product => {
                        console.log(`      • ${product['Product Name']} - ${product.reason}`);
                    });
                }
            }
            console.log('');
        });

        // Missing products
        if (analysis.recommendations.missing.length > 0) {
            console.log('❌ MISSING PRODUCTS:');
            analysis.recommendations.missing.forEach(product => {
                console.log(`   • ${product}`);
            });
            console.log('');
        }

        return analysis;
    }

    // Generate filtered product list for pricing page
    generateFilteredList() {
        const analysis = this.analyzeProducts();
        const filtered = {};

        Object.entries(analysis.currentProducts).forEach(([productName, matches]) => {
            const recommended = matches.filter(m => m.recommended);
            if (recommended.length > 0) {
                // Pick the best option for each license type
                const byLicenseType = {};
                
                recommended.forEach(product => {
                    const licenseType = this.identifyLicenseType(product['Product Name']);
                    if (!byLicenseType[licenseType] || 
                        this.comparePriority(product, byLicenseType[licenseType]) > 0) {
                        byLicenseType[licenseType] = product;
                    }
                });
                
                filtered[productName] = Object.values(byLicenseType);
            }
        });

        return filtered;
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

    comparePriority(productA, productB) {
        // Compare based on edition priority
        const editionA = this.getEditionPriority(productA['Product Name']);
        const editionB = this.getEditionPriority(productB['Product Name']);
        
        if (editionA !== editionB) {
            return editionA - editionB;
        }
        
        // If same edition, prefer lower price
        return (productA.Euro || 0) - (productB.Euro || 0);
    }

    getEditionPriority(productName) {
        const name = productName.toLowerCase();
        
        for (const edition of this.config.editions || []) {
            if (name.includes(edition.name.toLowerCase())) {
                return edition.priority;
            }
        }
        
        return 0; // Default priority
    }

    async validate() {
        const loaded = await this.loadPriceList();
        if (!loaded) return null;
        
        const report = this.generateReport();
        const filtered = this.generateFilteredList();
        
        console.log('🎯 ENHANCED PRODUCT FILTERING RESULTS:');
        console.log('===================================');
        Object.entries(filtered).forEach(([productName, products]) => {
            console.log(`${productName}:`);
            products.forEach(product => {
                const versionInfo = product.version ? ` (v${product.version})` : '';
                const recommendedInfo = product.recommended ? ' ✅' : ' ⚠️';
                console.log(`   • ${product['Product Name']}${versionInfo} - €${product.Euro}${recommendedInfo}`);
            });
            console.log('');
        });

        return { 
            report, 
            filtered,
            recommended: this.getRecommendedProducts(),
            validator: this // Expose validator instance for additional queries
        };
    }
}

// Export for use
window.PricelistValidator = PricelistValidator;

// Provide easy validation function
window.validatePricelist = async function() {
    const validator = new PricelistValidator();
    return await validator.validate();
};

// Provide easy access to recommended products with latest versions
window.getRecommendedProducts = async function() {
    const validator = new PricelistValidator();
    await validator.loadPriceList();
    return validator.getRecommendedProducts();
};

// Provide easy access to specific product versions
window.getProductVersions = async function(productName) {
    const validator = new PricelistValidator();
    await validator.loadPriceList();
    return validator.getProductVersions(productName);
};

// Provide easy access to products by category
window.getProductsByCategory = async function(category = null) {
    const validator = new PricelistValidator();
    await validator.loadPriceList();
    return validator.getProductsByCategory(category);
};