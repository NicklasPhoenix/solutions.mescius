/**
 * Pricing Page JavaScript
 * Handles shopping cart, product filtering, and tabs functionality
 */

// Global cart instance
let cart = null;

// Initialize pricing page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeProductFilters();
    initializeProductTabs();
    initializeRenewalForms();
});

/**
 * Initialize shopping cart
 */
function initializeCart() {
    // Use the global cart instance if it exists, otherwise create a new one
    if (window.cart) {
        cart = window.cart;
        console.log('Using global cart instance');
    } else if (typeof ShoppingCart !== 'undefined') {
        cart = new ShoppingCart();
        window.cart = cart; // Make available globally
        console.log('Created new cart instance');
    } else {
        console.warn('ShoppingCart class not loaded. Please include cart.js');
    }
}

/**
 * Product filtering system
 */
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const productSections = document.querySelectorAll('.product-pricing-section');
    const appliedFiltersContainer = document.getElementById('applied-filters-container');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    
    let activeFilters = {
        platform: 'all',
        productFamily: 'all'
    };

    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            const filterValue = this.getAttribute('data-value') || 
                              this.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            // Update active filters
            if (filterType === 'platform' || filterType === 'product-family') {
                activeFilters[filterType.replace('-', '')] = filterValue;
            }
            
            // Update UI
            updateActiveFilters();
            filterProducts();
            updateFilterCounts();
        });
    });

    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }

    function updateActiveFilters() {
        // Update button states
        filterButtons.forEach(button => {
            const filterType = button.getAttribute('data-filter');
            const filterValue = button.getAttribute('data-value') || 
                              button.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            const isActive = activeFilters[filterType.replace('-', '')] === filterValue ||
                           (filterValue === 'all' && activeFilters[filterType.replace('-', '')] === 'all');
            
            button.classList.toggle('active', isActive);
        });

        // Update applied filters display
        updateAppliedFiltersDisplay();
    }

    function updateAppliedFiltersDisplay() {
        if (!appliedFiltersContainer) return;

        const appliedFiltersHTML = [];
        
        Object.entries(activeFilters).forEach(([type, value]) => {
            if (value !== 'all') {
                const displayName = value.charAt(0).toUpperCase() + value.slice(1);
                appliedFiltersHTML.push(`
                    <span class="applied-filter" data-filter-type="${type}" data-filter-value="${value}">
                        ${displayName}
                        <button class="remove-filter" aria-label="Remove ${displayName} filter">×</button>
                    </span>
                `);
            }
        });

        appliedFiltersContainer.innerHTML = appliedFiltersHTML.join('');
        appliedFiltersContainer.style.display = appliedFiltersHTML.length > 0 ? 'block' : 'none';

        // Add event listeners for remove filter buttons
        appliedFiltersContainer.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', function() {
                const filterType = this.parentElement.getAttribute('data-filter-type');
                activeFilters[filterType] = 'all';
                updateActiveFilters();
                filterProducts();
                updateFilterCounts();
            });
        });
    }

    function filterProducts() {
        let visibleCount = 0;

        productSections.forEach(section => {
            const platform = section.getAttribute('data-platform');
            const productFamily = section.getAttribute('data-product-family');
            
            const platformMatch = activeFilters.platform === 'all' || platform === activeFilters.platform;
            const familyMatch = activeFilters.productfamily === 'all' || productFamily === activeFilters.productfamily;
            
            const shouldShow = platformMatch && familyMatch;
            
            section.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                visibleCount++;
            }
        });

        // Show/hide no results message
        const noResultsMessage = document.getElementById('no-results-message');
        if (noResultsMessage) {
            noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Animate transitions
        animateFilterTransitions();
    }

    function updateFilterCounts() {
        filterButtons.forEach(button => {
            const filterType = button.getAttribute('data-filter');
            const filterValue = button.getAttribute('data-value') || 
                              button.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            // Skip "all" buttons
            if (filterValue === 'all') return;

            // Count matching products
            let count = 0;
            productSections.forEach(section => {
                const platform = section.getAttribute('data-platform');
                const productFamily = section.getAttribute('data-product-family');
                
                const matches = (filterType === 'platform' && platform === filterValue) ||
                              (filterType === 'product-family' && productFamily === filterValue);
                
                if (matches) count++;
            });

            // Update button with count
            const countElement = button.querySelector('.filter-count');
            if (countElement) {
                countElement.textContent = `(${count})`;
            } else if (count > 0) {
                button.innerHTML += ` <span class="filter-count">(${count})</span>`;
            }
        });
    }

    function clearAllFilters() {
        activeFilters = {
            platform: 'all',
            productFamily: 'all'
        };
        updateActiveFilters();
        filterProducts();
        updateFilterCounts();
    }

    function animateFilterTransitions() {
        productSections.forEach(section => {
            if (section.style.display !== 'none') {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    }

    // Initialize filters
    updateActiveFilters();
    updateFilterCounts();
}

/**
 * Product tabs system
 */
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const productSection = this.closest('.product-pricing-section');
            
            switchTab(tabId, productSection);
        });

        // Keyboard navigation support
        button.addEventListener('keydown', function(e) {
            handleTabKeyboard(e);
        });
    });

    function switchTab(tabId, productSection) {
        if (!productSection) return;

        // Find tab buttons and panes within this product section
        const sectionTabButtons = productSection.querySelectorAll('.tab-btn');
        const sectionTabPanes = productSection.querySelectorAll('.tab-pane');

        // Update tab button states
        sectionTabButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // Update tab pane visibility
        sectionTabPanes.forEach(pane => {
            const isActive = pane.id === tabId;
            pane.hidden = !isActive;
            pane.setAttribute('aria-hidden', !isActive);
        });

        // Focus management
        const activeButton = productSection.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (activeButton && document.activeElement !== activeButton) {
            activeButton.focus();
        }
    }

    function handleTabKeyboard(event) {
        const currentTab = event.target;
        const productSection = currentTab.closest('.product-pricing-section');
        const tabs = Array.from(productSection.querySelectorAll('.tab-btn'));
        const currentIndex = tabs.indexOf(currentTab);

        let newIndex = currentIndex;

        switch (event.key) {
            case 'ArrowLeft':
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                break;
            case 'ArrowRight':
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = tabs.length - 1;
                break;
            default:
                return; // Don't prevent default for other keys
        }

        event.preventDefault();
        const newTab = tabs[newIndex];
        const newTabId = newTab.getAttribute('data-tab');
        switchTab(newTabId, productSection);
    }
}

/**
 * Renewal forms functionality
 */
function initializeRenewalForms() {
    const renewalForms = document.querySelectorAll('.renewal-form');
    
    renewalForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRenewalFormSubmit(this);
        });

        // Real-time validation
        const emailInput = form.querySelector('.renewal-email-input');
        const keysTextarea = form.querySelector('.renewal-keys-textarea');
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmailField(this);
            });
        }

        if (keysTextarea) {
            keysTextarea.addEventListener('blur', function() {
                validateKeysField(this);
            });
        }
    });

    function handleRenewalFormSubmit(form) {
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            licenseKeys: formData.get('license-keys'),
            productType: form.closest('.tab-pane').id
        };

        if (validateRenewalForm(data)) {
            submitRenewalRequest(data, form);
        }
    }

    function validateRenewalForm(data) {
        let isValid = true;
        const errors = [];

        // Email validation
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }

        // License keys validation
        if (!data.licenseKeys || data.licenseKeys.trim().length === 0) {
            errors.push('Please enter your license keys');
            isValid = false;
        }

        if (!isValid) {
            displayFormFeedback(errors.join('. '), 'error');
        }

        return isValid;
    }

    function validateEmailField(input) {
        const isValid = isValidEmail(input.value);
        input.classList.toggle('error', !isValid);
        
        const errorMsg = input.parentElement.querySelector('.field-error');
        if (!isValid && input.value) {
            if (!errorMsg) {
                const error = document.createElement('span');
                error.className = 'field-error';
                error.textContent = 'Please enter a valid email address';
                input.parentElement.appendChild(error);
            }
        } else if (errorMsg) {
            errorMsg.remove();
        }
    }

    function validateKeysField(textarea) {
        const isValid = textarea.value.trim().length > 0;
        textarea.classList.toggle('error', !isValid);
        
        const errorMsg = textarea.parentElement.querySelector('.field-error');
        if (!isValid && textarea.value) {
            if (!errorMsg) {
                const error = document.createElement('span');
                error.className = 'field-error';
                error.textContent = 'Please enter your license keys';
                textarea.parentElement.appendChild(error);
            }
        } else if (errorMsg) {
            errorMsg.remove();
        }
    }

    function submitRenewalRequest(data, form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            displayFormFeedback('Renewal request submitted successfully. We will contact you shortly.', 'success');
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    function displayFormFeedback(message, type) {
        // Find or create feedback container
        let feedback = document.querySelector('.form-feedback');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            // Insert after the last renewal form
            const lastForm = document.querySelector('.renewal-form:last-of-type');
            if (lastForm && lastForm.parentElement) {
                lastForm.parentElement.insertBefore(feedback, lastForm.nextSibling);
            }
        }

        feedback.className = `form-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Utility functions
 */

// Add to cart function for external use
function addToCart(productId, name, price) {
    if (cart) {
        cart.addToCart(productId, name, price);
    }
}

// Remove from cart function for external use
function removeFromCart(itemId) {
    if (cart) {
        cart.removeFromCart(itemId);
    }
}

// Toggle cart function for external use
function toggleCart() {
    if (cart) {
        cart.toggleCart();
    }
}

// Update cart total function for external use
function updateCartTotal() {
    if (cart) {
        cart.updateCartDisplay();
    }
}

// Proceed to checkout function for external use
function proceedToCheckout() {
    if (cart && cart.getItems().length > 0) {
        window.location.href = cart.generateCheckoutURL();
    }
}

// Export functions for global use
window.PricingPage = {
    addToCart,
    removeFromCart,
    toggleCart,
    updateCartTotal,
    proceedToCheckout,
    cart: () => cart
};