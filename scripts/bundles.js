/**
 * Bundles Page JavaScript
 * Handles volume discounts, multi-year subscriptions, and bundle calculators
 */

// Bundle configuration data
const bundleConfig = {
    'card-net': {
        basePrice: 2772,
        listPrice: 4265,
        id: '285847',
        name: '.NET Professional Suite',
        products: [
            { name: 'ComponentOne Studio', price: 1385 },
            { name: 'Wijmo Enterprise', price: 0 },
            { name: 'ActiveReports.NET (Prof.)', price: 1485 },
            { name: 'Spread.NET', price: 1395 }
        ]
    },
    'card-js': {
        basePrice: 1203,
        listPrice: 1850,
        id: '285849',
        name: 'SpreadJS+Documents',
        products: [
            { name: 'SpreadJS', price: 925 },
            { name: 'Documents for Excel (JS)', price: 925 }
        ]
    },
    'card-desktop': {
        basePrice: 1508,
        listPrice: 2320,
        id: '285851',
        name: 'Spread.NET+Documents',
        products: [
            { name: 'Spread.NET', price: 1395 },
            { name: 'Documents for Excel (.NET)', price: 925 }
        ]
    },
    'card-analytics': {
        basePrice: 1649,
        listPrice: 2870,
        id: '285868',
        name: 'Real-Time Analytics & Reporting',
        products: [
            { name: 'ActiveReportsJS Single Domain', price: 1485 },
            { name: 'Wijmo Enterprise', price: 1385 }
        ]
    },
    'card-autoreport': {
        basePrice: 1555,
        listPrice: 2410,
        id: '285867',
        name: 'Automated Reporting & Document Generation',
        products: [
            { name: 'ActiveReports.NET Standard', price: 1485 },
            { name: 'Documents for Excel (.NET)', price: 925 }
        ]
    },
    'card-blazor': {
        basePrice: 2658,
        listPrice: 3415,
        id: '285848',
        name: 'Blazor Hybrid Power Pack',
        products: [
            { name: 'ComponentOne Studio', price: 1385 },
            { name: 'Wijmo Enterprise', price: 1105 },
            { name: 'Documents for Excel (.NET)', price: 925 }
        ]
    }
};

// Volume discount tiers
const volumeDiscounts = {
    5: 0.05,   // 5% discount for 5+ licenses
    10: 0.10   // 10% discount for 10+ licenses
};

// Multi-year subscription discounts
const multiYearDiscounts = {
    2: 0.10,   // 10% discount for 2-year subscription
    3: 0.15    // 15% discount for 3-year subscription
};

// Initialize bundles page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBundleCalculators();
    initializeSubscriptionToggles();
    initializeTooltips();
    initializeBundleInfoModals();
});

/**
 * Initialize bundle calculators
 */
function initializeBundleCalculators() {
    // Find all bundle cards
    const bundleCards = document.querySelectorAll('.bundle-card');
    
    bundleCards.forEach(card => {
        const cardId = card.id;
        if (!bundleConfig[cardId]) return;
        
        initializeBundleCard(card, cardId);
    });
}

/**
 * Initialize individual bundle card
 */
function initializeBundleCard(card, cardId) {
    const config = bundleConfig[cardId];
    
    // Find elements within this card
    const quantityInput = card.querySelector('.quantity-input');
    const quantityButtons = card.querySelectorAll('.quantity-btn');
    const priceDisplay = card.querySelector('.bundle-price');
    const savingsDisplay = card.querySelector('.savings-amount');
    const yearToggle = card.querySelector('[name^="years-"]');
    
    // Initialize quantity controls
    if (quantityInput && quantityButtons.length > 0) {
        initializeQuantityControls(card, quantityInput, quantityButtons);
    }
    
    // Initialize year subscription toggles
    if (yearToggle) {
        initializeYearToggles(card);
    }
    
    // Initial price calculation
    updateBundlePrice(cardId);
}

/**
 * Initialize quantity controls for a bundle
 */
function initializeQuantityControls(card, quantityInput, quantityButtons) {
    const cardId = card.id;
    
    // Quantity input change
    quantityInput.addEventListener('change', function() {
        let quantity = parseInt(this.value);
        
        // Validate quantity
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
            this.value = quantity;
        }
        
        updateBundlePrice(cardId);
    });
    
    // Quantity buttons
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            let currentQuantity = parseInt(quantityInput.value) || 1;
            
            if (action === 'increase') {
                currentQuantity++;
            } else if (action === 'decrease' && currentQuantity > 1) {
                currentQuantity--;
            }
            
            quantityInput.value = currentQuantity;
            updateBundlePrice(cardId);
        });
    });
}

/**
 * Initialize year subscription toggles
 */
function initializeYearToggles(card) {
    const cardId = card.id;
    const yearRadios = card.querySelectorAll('[name^="years-"]');
    
    yearRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                updateSubscriptionPeriod(cardId, parseInt(this.value));
                updateBundlePrice(cardId);
            }
        });
    });
}

/**
 * Initialize subscription toggles for multi-year discounts
 */
function initializeSubscriptionToggles() {
    const subscriptionToggles = document.querySelectorAll('input[name^="years-"]');
    
    subscriptionToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            if (this.checked) {
                const bundleCard = this.closest('.bundle-card');
                if (bundleCard) {
                    const years = parseInt(this.value);
                    updateSubscriptionPeriod(bundleCard.id, years);
                    updateBundlePrice(bundleCard.id);
                }
            }
        });
    });
}

/**
 * Update bundle pricing calculation
 */
function updateBundlePrice(bundleId) {
    const config = bundleConfig[bundleId];
    if (!config) return;
    
    const card = document.getElementById(bundleId);
    if (!card) return;
    
    // Get current values
    const quantityInput = card.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput?.value) || 1;
    
    const yearRadios = card.querySelectorAll('[name^="years-"]');
    let selectedYears = 1;
    for (const radio of yearRadios) {
        if (radio.checked) {
            selectedYears = parseInt(radio.value);
            break;
        }
    }
    
    // Calculate base price
    let totalPrice = config.basePrice * quantity;
    
    // Apply volume discount
    const volumeDiscount = calculateVolumeDiscount(quantity);
    if (volumeDiscount > 0) {
        totalPrice = totalPrice * (1 - volumeDiscount);
    }
    
    // Apply multi-year discount
    const multiYearDiscount = calculateMultiYearDiscount(selectedYears);
    if (multiYearDiscount > 0) {
        totalPrice = totalPrice * (1 - multiYearDiscount);
    }
    
    // Update price display
    updatePriceDisplay(bundleId, totalPrice, quantity, selectedYears, volumeDiscount, multiYearDiscount);
    
    // Update savings calculation
    updateSavingsDisplay(bundleId, config.listPrice, totalPrice, quantity);
}

/**
 * Calculate volume discount based on quantity
 */
function calculateVolumeDiscount(quantity) {
    if (quantity >= 10) {
        return volumeDiscounts[10];
    } else if (quantity >= 5) {
        return volumeDiscounts[5];
    }
    return 0;
}

/**
 * Calculate multi-year subscription discount
 */
function calculateMultiYearDiscount(years) {
    return multiYearDiscounts[years] || 0;
}

/**
 * Update price display elements
 */
function updatePriceDisplay(bundleId, totalPrice, quantity, years, volumeDiscount, multiYearDiscount) {
    const card = document.getElementById(bundleId);
    if (!card) return;
    
    // Main price display
    const priceElement = card.querySelector('.bundle-price, .price');
    if (priceElement) {
        priceElement.textContent = `€${formatCurrency(totalPrice)}`;
    }
    
    // Price per license display
    const perLicenseElement = card.querySelector('.price-per-license');
    if (perLicenseElement) {
        const pricePerLicense = totalPrice / quantity;
        perLicenseElement.textContent = `€${formatCurrency(pricePerLicense)} per license`;
    }
    
    // Update discount tags
    updateDiscountTags(card, volumeDiscount, multiYearDiscount);
    
    // Update price summary
    updatePriceSummary(bundleId, totalPrice, quantity, years);
}

/**
 * Update discount tags display
 */
function updateDiscountTags(card, volumeDiscount, multiYearDiscount) {
    // Volume discount tag
    const volumeTag = card.querySelector('.volume-discount-tag');
    if (volumeTag) {
        if (volumeDiscount > 0) {
            volumeTag.textContent = `-${Math.round(volumeDiscount * 100)}% Volume`;
            volumeTag.style.display = 'inline-block';
        } else {
            volumeTag.style.display = 'none';
        }
    }
    
    // Multi-year discount tag
    const yearTag = card.querySelector('.year-discount-tag');
    if (yearTag) {
        if (multiYearDiscount > 0) {
            yearTag.textContent = `-${Math.round(multiYearDiscount * 100)}% Multi-Year`;
            yearTag.style.display = 'inline-block';
        } else {
            yearTag.style.display = 'none';
        }
    }
}

/**
 * Update savings display
 */
function updateSavingsDisplay(bundleId, listPrice, totalPrice, quantity) {
    const card = document.getElementById(bundleId);
    if (!card) return;
    
    const totalListPrice = listPrice * quantity;
    const savings = totalListPrice - totalPrice;
    const savingsPercentage = (savings / totalListPrice) * 100;
    
    const savingsElement = card.querySelector('.savings-amount');
    if (savingsElement && savings > 0) {
        savingsElement.textContent = `Save €${formatCurrency(savings)} (${Math.round(savingsPercentage)}%)`;
        savingsElement.style.display = 'block';
    } else if (savingsElement) {
        savingsElement.style.display = 'none';
    }
}

/**
 * Update price summary section
 */
function updatePriceSummary(bundleId, totalPrice, quantity, years) {
    const summaryElement = document.getElementById(`price-summary-${bundleId.replace('card-', '')}`);
    if (!summaryElement) return;
    
    const config = bundleConfig[bundleId];
    
    summaryElement.innerHTML = `
        <div class="summary-line">
            <span>Bundle: ${config.name}</span>
            <span>€${formatCurrency(config.basePrice)}</span>
        </div>
        <div class="summary-line">
            <span>Quantity: ${quantity}</span>
            <span>€${formatCurrency(config.basePrice * quantity)}</span>
        </div>
        ${quantity >= 5 ? `
        <div class="summary-line discount">
            <span>Volume Discount (${Math.round(calculateVolumeDiscount(quantity) * 100)}%)</span>
            <span>-€${formatCurrency(config.basePrice * quantity * calculateVolumeDiscount(quantity))}</span>
        </div>` : ''}
        ${years > 1 ? `
        <div class="summary-line discount">
            <span>Multi-Year Discount (${Math.round(calculateMultiYearDiscount(years) * 100)}%)</span>
            <span>-€${formatCurrency((config.basePrice * quantity * (1 - calculateVolumeDiscount(quantity))) * calculateMultiYearDiscount(years))}</span>
        </div>` : ''}
        <div class="summary-line total">
            <span>Total (${years} year${years > 1 ? 's' : ''})</span>
            <span>€${formatCurrency(totalPrice)}</span>
        </div>
    `;
}

/**
 * Update subscription period and discounts
 */
function updateSubscriptionPeriod(bundleId, years) {
    const card = document.getElementById(bundleId);
    if (!card) return;
    
    // Update period display
    const periodDisplay = card.querySelector('.subscription-period');
    if (periodDisplay) {
        periodDisplay.textContent = `${years} year${years > 1 ? 's' : ''}`;
    }
    
    // Update discount information
    const discountInfo = card.querySelector('.multi-year-discount-info');
    if (discountInfo) {
        const discount = calculateMultiYearDiscount(years);
        if (discount > 0) {
            discountInfo.textContent = `Save ${Math.round(discount * 100)}% with multi-year commitment`;
            discountInfo.style.display = 'block';
        } else {
            discountInfo.style.display = 'none';
        }
    }
}

/**
 * Initialize tooltip system
 */
function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        trigger.addEventListener('mouseleave', function() {
            hideTooltip(this);
        });
        
        // Touch support for mobile
        trigger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            showTooltip(this);
        });
    });
    
    // Hide tooltips when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('[data-tooltip]')) {
            hideAllTooltips();
        }
    });
}

/**
 * Show tooltip
 */
function showTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    
    if (!tooltipText) return;
    
    // Remove existing tooltip
    hideTooltip(element);
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = tooltipText;
    tooltip.setAttribute('role', 'tooltip');
    
    // Position tooltip
    document.body.appendChild(tooltip);
    positionTooltip(tooltip, element);
    
    // Store reference
    element._tooltip = tooltip;
    
    // Show with animation
    requestAnimationFrame(() => {
        tooltip.classList.add('visible');
    });
}

/**
 * Hide tooltip
 */
function hideTooltip(element) {
    if (element._tooltip) {
        element._tooltip.remove();
        element._tooltip = null;
    }
}

/**
 * Hide all tooltips
 */
function hideAllTooltips() {
    const tooltips = document.querySelectorAll('.tooltip-popup');
    tooltips.forEach(tooltip => tooltip.remove());
}

/**
 * Position tooltip relative to trigger element
 */
function positionTooltip(tooltip, trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
    let top = triggerRect.top - tooltipRect.height - 10;
    
    // Adjust if tooltip goes outside viewport
    if (left < 10) {
        left = 10;
    } else if (left + tooltipRect.width > viewport.width - 10) {
        left = viewport.width - tooltipRect.width - 10;
    }
    
    if (top < 10) {
        // Show below if no space above
        top = triggerRect.bottom + 10;
        tooltip.classList.add('below');
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

/**
 * Format currency for display
 */
function formatCurrency(amount) {
    return amount.toLocaleString('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * Add to cart functionality for bundles
 */
function addBundleToCart(bundleId) {
    const config = bundleConfig[bundleId];
    if (!config) return;
    
    const card = document.getElementById(bundleId);
    if (!card) return;
    
    const quantity = parseInt(card.querySelector('.quantity-input')?.value) || 1;
    
    // Calculate current price
    const yearRadios = card.querySelectorAll('[name^="years-"]');
    let selectedYears = 1;
    for (const radio of yearRadios) {
        if (radio.checked) {
            selectedYears = parseInt(radio.value);
            break;
        }
    }
    
    let totalPrice = config.basePrice * quantity;
    const volumeDiscount = calculateVolumeDiscount(quantity);
    const multiYearDiscount = calculateMultiYearDiscount(selectedYears);
    
    if (volumeDiscount > 0) {
        totalPrice = totalPrice * (1 - volumeDiscount);
    }
    if (multiYearDiscount > 0) {
        totalPrice = totalPrice * (1 - multiYearDiscount);
    }
    
    // Add to cart if cart system is available
    if (window.PricingPage && window.PricingPage.addToCart) {
        const bundleName = `${config.name} (${quantity}x, ${selectedYears} year${selectedYears > 1 ? 's' : ''})`;
        window.PricingPage.addToCart(config.id, bundleName, totalPrice);
    } else {
        // Fallback: redirect to checkout
        const checkoutUrl = `https://www.mescius.eu/contact?bundle=${encodeURIComponent(JSON.stringify({
            id: config.id,
            name: config.name,
            quantity: quantity,
            years: selectedYears,
            price: totalPrice
        }))}`;
        window.location.href = checkoutUrl;
    }
}

/**
 * Handle contact sales actions
 */
function contactSales(bundleId) {
    const config = bundleConfig[bundleId];
    if (!config) return;
    
    const card = document.getElementById(bundleId);
    const quantity = parseInt(card?.querySelector('.quantity-input')?.value) || 1;
    
    const subject = encodeURIComponent(`Inquiry about ${config.name} Bundle`);
    const body = encodeURIComponent(`Hi,

I'm interested in the ${config.name} Bundle with the following configuration:
- Quantity: ${quantity} licenses
- Bundle: ${config.name}

Could you please provide more information and a quote?

Thank you!`);
    
    window.location.href = `mailto:eu.sales@mescius.com?subject=${subject}&body=${body}`;
}

/**
 * Initialize bundle info modals
 */
function initializeBundleInfoModals() {
    const infoTriggers = document.querySelectorAll('.bundle-info-trigger');
    
    infoTriggers.forEach(trigger => {
        // Add ARIA attributes for accessibility
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('aria-label', trigger.getAttribute('aria-label') || 'More information about this bundle');
        
        // Click handler
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openBundleInfoModal(this);
        });

        // Keyboard handler
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openBundleInfoModal(this);
            }
        });
    });
}

/**
 * Open bundle info modal
 */
function openBundleInfoModal(trigger) {
    // Get modal data from the trigger element
    const title = trigger.getAttribute('data-title') || 'Bundle Information';
    const description = trigger.getAttribute('data-description') || 'No description available';
    const solutionLink = trigger.getAttribute('data-solutionlink');
    
    // Build modal content
    let modalContent = `
        <div class="bundle-info-content">
            <div class="bundle-description">
                ${description}
            </div>
    `;
    
    // Add action buttons if links are available
    if (solutionLink) {
        modalContent += `
            <div class="bundle-info-actions">
                <a href="${solutionLink}" class="btn btn-primary">Explore Solutions</a>
            </div>
        `;
    }
    
    modalContent += `</div>`;
    
    // Create and show modal using existing modal system
    if (typeof ModalSystem !== 'undefined' && window.modalSystem) {
        window.modalSystem.createAndShowModal(title, modalContent);
    } else {
        // Fallback: create a simple modal
        showSimpleModal(title, modalContent);
    }
}

/**
 * Simple modal fallback
 */
function showSimpleModal(title, content) {
    // Remove existing modal
    const existingModal = document.getElementById('simple-bundle-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'simple-bundle-modal';
    modal.className = 'modal-overlay show'; // Add 'show' class to make it visible
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Export functions for global use
window.BundlesPage = {
    updateBundlePrice,
    calculateVolumeDiscount,
    calculateMultiYearDiscount,
    addBundleToCart,
    contactSales,
    formatCurrency,
    initializeBundleInfoModals
};