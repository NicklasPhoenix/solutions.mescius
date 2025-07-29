/**
 * Pricing Page Generator
 * Filters pricelist.json and generates pricing page content automatically
 */

class PricingGenerator {
    constructor(config = null) {
        this.priceList = [];
        this.config = config || window.PRICING_CONFIG || {};
        this.validator = new PricelistValidator(this.config);
    }

    async loadPriceList() {
        try {
            const response = await fetch('./pricelist.json');
            this.priceList = await response.json();
            console.log(`Loaded ${this.priceList.length} products from pricelist.json`);
        } catch (error) {
            console.error('Error loading pricelist.json:', error);
        }
    }

    async filterProducts() {
        // Use the validator to get properly filtered products
        await this.validator.loadPriceList();
        const validatedData = await this.validator.validate();
        
        if (!validatedData) {
            console.error('Failed to validate pricelist');
            return [];
        }

        const filtered = [];
        Object.entries(validatedData.filtered).forEach(([productName, products]) => {
            filtered.push(...products);
        });

        console.log(`✅ Filtered to ${filtered.length} relevant products`);
        return filtered;
    }

    categorizeProducts(products) {
        // Initialize categories based on config
        const categories = {};
        
        if (this.config.currentProducts) {
            this.config.currentProducts.forEach(configProduct => {
                categories[configProduct.name] = [];
            });
        } else {
            // Fallback categories if no config
            categories = {
                'ComponentOne Studio': [],
                'Wijmo Enterprise': [],
                'ActiveReports.NET': [],
                'SpreadJS': [],
                'Spread.NET': [],
                'Documents API': []
            };
        }

        // Ensure products is an array
        if (!Array.isArray(products)) {
            console.error('Products is not an array:', products);
            return categories;
        }

        products.forEach(product => {
            const name = product['Product Name'];
            let categorized = false;
            
            // Try to match against configured products
            if (this.config.currentProducts) {
                for (const configProduct of this.config.currentProducts) {
                    const isMatch = configProduct.keywords?.some(keyword => 
                        name.toLowerCase().includes(keyword.toLowerCase())
                    );
                    
                    if (isMatch) {
                        categories[configProduct.name].push(product);
                        categorized = true;
                        break;
                    }
                }
            }
            
            // Fallback categorization if no config match
            if (!categorized) {
                if (name.includes('ComponentOne')) {
                    categories['ComponentOne Studio']?.push(product);
                } else if (name.includes('Wijmo')) {
                    categories['Wijmo Enterprise']?.push(product);
                } else if (name.includes('ActiveReports')) {
                    categories['ActiveReports.NET']?.push(product);
                } else if (name.includes('SpreadJS')) {
                    categories['SpreadJS']?.push(product);
                } else if (name.includes('Spread.NET') || name.includes('Spread .NET')) {
                    categories['Spread.NET']?.push(product);
                } else if (name.includes('Documents for')) {
                    categories['Documents API']?.push(product);
                }
            }
        });

        return categories;
    }

    generatePricingHTML(categories) {
        let html = '';
        
        Object.entries(categories).forEach(([category, products]) => {
            if (products.length === 0) return;
            
            html += `
                <div class="product-category" data-category="${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                    <h3 class="category-title">${category}</h3>
                    <div class="product-grid">
            `;
            
            products.forEach(product => {
                const price = Math.round(product.Euro);
                const productId = product['Internal Product ID'];
                const productName = product['Product Name'];
                
                html += `
                    <div class="pricing-card" data-product-id="${productId}">
                        <h4 class="product-name">${productName}</h4>
                        <div class="price-container">
                            <span class="price">€${price.toLocaleString()}</span>
                            <span class="price-term">per developer / year</span>
                        </div>
                        <button class="cta-button add-to-cart-btn" 
                                data-product-id="${productId}"
                                data-product-name="${productName}"
                                data-price="${price}">
                            Add to Cart
                        </button>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    generatePricingData(categories) {
        const pricingData = {};
        
        Object.entries(categories).forEach(([category, products]) => {
            pricingData[category] = products.map(product => ({
                id: product['Internal Product ID'],
                name: product['Product Name'],
                price: Math.round(product.Euro),
                type: this.getLicenseType(product['Product Name']),
                category: category
            }));
        });
        
        return pricingData;
    }

    getLicenseType(productName) {
        const name = productName.toLowerCase();
        if (name.includes('renewal')) return 'renewal';
        if (name.includes('upgrade')) return 'upgrade';
        if (name.includes('subscription')) return 'subscription';
        if (name.includes('enterprise')) return 'enterprise';
        if (name.includes('professional')) return 'professional';
        if (name.includes('standard')) return 'standard';
        return 'new-license';
    }

    async generate() {
        try {
            await this.loadPriceList();
            const filteredProducts = await this.filterProducts();
            
            console.log('Filtered products:', filteredProducts);
            
            if (!Array.isArray(filteredProducts)) {
                throw new Error('Filtered products is not an array');
            }
            
            const categorizedProducts = this.categorizeProducts(filteredProducts);
            
            console.log('Categorized products:', categorizedProducts);
            
            // Generate HTML
            const html = this.generatePricingHTML(categorizedProducts);
            
            // Generate structured data
            const data = this.generatePricingData(categorizedProducts);
            
            console.log('Generated pricing data:', data);
            
            return {
                html,
                data,
                filteredProducts,
                categorizedProducts
            };
        } catch (error) {
            console.error('Error in generate():', error);
            throw error;
        }
    }

    // Method to update the pricing page DOM
    updatePricingPage(containerId = 'pricing-container') {
        this.generate().then(result => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = result.html;
                
                // Re-initialize cart functionality
                if (window.cart) {
                    window.cart.updateCartDisplay();
                }
                
                console.log('Pricing page updated with current products');
            }
        });
    }
}

// Export for use
window.PricingGenerator = PricingGenerator;

// Auto-initialize if on pricing page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('pricing') || 
        document.body.classList.contains('pricing-page')) {
        
        const generator = new PricingGenerator();
        console.log('Pricing generator initialized');
        
        // Expose to global scope for debugging
        window.pricingGenerator = generator;
    }
});