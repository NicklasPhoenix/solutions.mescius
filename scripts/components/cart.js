/**
 * Shopping Cart Component
 * Manages cart state, persistence, and interactions
 */

class ShoppingCart {
    constructor() {
        this.items = [];
        this.isVisible = false;
        this.storageKey = 'mescius_cart';
        
        // DOM elements
        this.cartElement = null;
        this.cartItemsElement = null;
        this.cartTotalElement = null;
        this.cartToggleBtn = null;
        this.checkoutLink = null;
        this.cartBadge = null;
        
        this.init();
    }

    init() {
        // Load cart from localStorage
        this.loadCart();
        
        // Initialize DOM elements
        this.initializeElements();
        
        // Set up event listeners
        this.initializeEventListeners();
        
        // Update UI
        this.updateCartDisplay();
    }

    initializeElements() {
        this.cartElement = document.getElementById('floating-cart');
        this.cartItemsElement = document.getElementById('cart-items');
        this.cartTotalElement = document.getElementById('cart-total-price');
        this.cartToggleBtn = document.getElementById('cart-btn');
        this.checkoutLink = document.getElementById('checkout-link');
        this.cartCount = document.getElementById('cart-count');
        
        // Create cart badge if it doesn't exist
        this.createCartBadge();
        
        // Always set up floating cart functionality
        this.setupFloatingCart();
    }

    createCartBadge() {
        if (!this.cartToggleBtn) return;
        
        // Check if badge already exists
        this.cartBadge = this.cartToggleBtn.querySelector('.cart-badge');
        
        // Don't create if cart-count already exists
        if (!this.cartBadge && !this.cartToggleBtn.querySelector('.cart-count')) {
            this.cartBadge = document.createElement('span');
            this.cartBadge.className = 'cart-badge';
            this.cartBadge.textContent = '0';
            this.cartToggleBtn.appendChild(this.cartBadge);
        }
    }

    initializeEventListeners() {
        // Cart toggle button
        if (this.cartToggleBtn) {
            this.cartToggleBtn.addEventListener('click', () => this.toggleCart());
        }

        // Cart close, minimize buttons, and header clicks
        document.addEventListener('click', (e) => {
            // Close button clicked
            if (e.target.id === 'cart-close-btn' || e.target.classList.contains('cart-close')) {
                e.stopPropagation();
                this.hideCart();
                return;
            }
            
            // Minimize button clicked
            if (e.target.id === 'cart-minimize-btn') {
                e.stopPropagation();
                this.minimizeCart();
                return;
            }
            
            // Header clicked (but not action buttons)
            const cartHeader = e.target.closest('.cart-header');
            if (cartHeader && this.isVisible) {
                const headerActions = e.target.closest('.cart-header-actions');
                if (!headerActions) {
                    e.stopPropagation();
                    this.toggleMinimize();
                }
            }
        });

        // Add direct event listener to cart header for more reliable toggling
        if (this.cartElement) {
            const cartHeader = this.cartElement.querySelector('.cart-header');
            if (cartHeader) {
                cartHeader.addEventListener('click', (e) => {
                    // Only toggle if not clicking on action buttons and cart is visible
                    if (!e.target.closest('.cart-header-actions') && this.isVisible) {
                        e.stopPropagation();
                        this.toggleMinimize();
                    }
                });
            }
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                this.handleAddToCart(e.target);
            }
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible && this.cartElement && 
                !this.cartElement.contains(e.target) && 
                !this.cartToggleBtn?.contains(e.target) &&
                !this.floatingCartBtn?.contains(e.target) &&
                !e.target.classList.contains('add-to-cart-btn')) {
                this.hideCart();
            }
        });

        // Escape key to close cart
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideCart();
            }
        });
    }

    handleAddToCart(button) {
        const productId = button.getAttribute('data-product-id');
        const productName = button.getAttribute('data-product-name');
        const price = parseFloat(button.getAttribute('data-price'));

        if (!productId || !productName || isNaN(price)) {
            console.error('Invalid product data on add to cart button');
            return;
        }

        this.addToCart(productId, productName, price);
        
        // Show cart after adding item
        this.showCart();
        
        // Add visual feedback
        this.showAddToCartFeedback(button);
    }

    addToCart(productId, name, price) {
        // Check if item already exists
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
    }

    removeFromCart(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    updateCartDisplay() {
        this.updateCartItems();
        this.updateCartTotal();
        this.updateCartBadge();
        this.updateCheckoutLink();
    }

    updateCartItems() {
        if (!this.cartItemsElement) return;

        if (this.items.length === 0) {
            this.cartItemsElement.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${this.escapeHtml(item.name)}</h4>
                    <div class="cart-item-price">€${this.formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-action="decrease" aria-label="Decrease quantity">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-action="increase" aria-label="Increase quantity">+</button>
                    </div>
                    <button class="remove-item-btn" aria-label="Remove from cart">×</button>
                </div>
                <div class="cart-item-total">€${this.formatPrice(item.price * item.quantity)}</div>
            </div>
        `).join('');

        this.cartItemsElement.innerHTML = itemsHTML;

        // Add event listeners for cart item controls
        this.addCartItemListeners();
    }

    addCartItemListeners() {
        if (!this.cartItemsElement) return;

        // Remove existing event listeners to prevent duplicates
        const existingListener = this.cartItemsElement._cartListener;
        if (existingListener) {
            this.cartItemsElement.removeEventListener('click', existingListener);
        }

        // Create new event listener
        const newListener = (e) => {
            // Prevent event bubbling to document
            e.stopPropagation();
            
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const itemId = cartItem.getAttribute('data-item-id');

            if (e.target.classList.contains('remove-item-btn')) {
                this.removeFromCart(itemId);
            } else if (e.target.classList.contains('quantity-btn')) {
                const action = e.target.getAttribute('data-action');
                const item = this.items.find(item => item.id === itemId);
                if (item) {
                    const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    this.updateQuantity(itemId, newQuantity);
                }
            }
        };

        // Store reference to listener for cleanup
        this.cartItemsElement._cartListener = newListener;
        this.cartItemsElement.addEventListener('click', newListener);
    }

    minimizeCart() {
        if (!this.cartElement) return;
        this.cartElement.classList.add('is-minimized');
    }

    expandCart() {
        if (!this.cartElement) return;
        this.cartElement.classList.remove('is-minimized');
    }

    toggleMinimize() {
        if (!this.cartElement) return;
        if (this.cartElement.classList.contains('is-minimized')) {
            this.expandCart();
        } else {
            this.minimizeCart();
        }
    }

    updateCartTotal() {
        if (!this.cartTotalElement) return;

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotalElement.textContent = `€${this.formatPrice(total)}`;
    }

    updateCartBadge() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update header cart count (prefer cart-count over cart-badge)
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
            this.cartCount.classList.toggle('empty', totalItems === 0);
        } else if (this.cartBadge) {
            this.cartBadge.textContent = totalItems;
            this.cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Update floating cart count
        if (this.floatingCartCount) {
            this.floatingCartCount.textContent = totalItems;
            this.floatingCartCount.classList.toggle('empty', totalItems === 0);
        }
    }

    updateCheckoutLink() {
        if (!this.checkoutLink) return;

        if (this.items.length > 0) {
            this.checkoutLink.classList.remove('is-disabled');
            this.checkoutLink.href = this.generateCheckoutURL();
        } else {
            this.checkoutLink.classList.add('is-disabled');
            this.checkoutLink.href = '#';
        }
    }

    generateCheckoutURL() {
        const baseURL = 'https://www.mescius.eu/contact';
        const cartData = encodeURIComponent(JSON.stringify({
            items: this.items,
            total: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: new Date().toISOString()
        }));
        
        return `${baseURL}?cart=${cartData}`;
    }

    toggleCart() {
        // Toggle the floating cart visibility
        if (!this.cartElement) {
            console.error('Cart element not found');
            return;
        }
        
        this.isVisible = !this.isVisible;
        this.cartElement.classList.toggle('is-open', this.isVisible);
        
        // Update aria-expanded for accessibility
        if (this.cartToggleBtn) {
            this.cartToggleBtn.setAttribute('aria-expanded', this.isVisible.toString());
        }
        if (this.floatingCartBtn) {
            this.floatingCartBtn.setAttribute('aria-expanded', this.isVisible.toString());
        }
    }

    showCart() {
        if (!this.cartElement) return;

        this.cartElement.classList.add('is-open');
        this.isVisible = true;
        
        // Update aria-expanded for accessibility
        if (this.cartToggleBtn) {
            this.cartToggleBtn.setAttribute('aria-expanded', 'true');
        }
        if (this.floatingCartBtn) {
            this.floatingCartBtn.setAttribute('aria-expanded', 'true');
        }
    }

    hideCart() {
        if (!this.cartElement) return;

        this.cartElement.classList.remove('is-open');
        this.isVisible = false;
        
        // Update aria-expanded for accessibility
        if (this.cartToggleBtn) {
            this.cartToggleBtn.setAttribute('aria-expanded', 'false');
        }
        if (this.floatingCartBtn) {
            this.floatingCartBtn.setAttribute('aria-expanded', 'false');
        }
    }

    showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.add('success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('success');
        }, 1000);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem(this.storageKey);
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
            this.items = [];
        }
    }

    // Purchase page detection and floating cart setup
    isPurchasePage() {
        // Don't float cart on blueprint pages - they're informational, not purchase pages
        if (window.location.pathname.includes('/blueprints/')) {
            return false;
        }
        
        const buyButtons = document.querySelectorAll('.bundle-purchase, [href*="checkout"]');
        const pricingElements = document.querySelectorAll('.price, .bundle-price, .pricing');
        const bundlePages = window.location.pathname.includes('/bundles/') || 
                           window.location.pathname.includes('/pricing/') ||
                           document.body.classList.contains('pricing-page') ||
                           document.body.classList.contains('bundles-page');
        
        return buyButtons.length > 0 || pricingElements.length > 0 || bundlePages;
    }

    setupFloatingCart() {
        // No need to create separate floating button - use header button
        // Just ensure cart functionality is ready
        console.log('Floating cart functionality enabled for header button');
    }

    createCartPanel() {
        const panel = document.createElement('div');
        panel.id = 'cart-panel';
        panel.className = 'cart-panel';
        
        // Prevent clicks inside the panel from closing it
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        panel.innerHTML = `
            <div class="cart-panel-content">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="cart-close" onclick="this.closest('.cart-panel').classList.remove('active'); document.body.classList.remove('cart-open'); window.cart.isVisible = false;">×</button>
                </div>
                <div class="cart-items" id="cart-items-list">
                    ${this.items.length === 0 ? '<p class="empty-cart">Your cart is empty</p>' : this.renderCartItems()}
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: €${this.formatPrice(this.getTotal())}</strong>
                    </div>
                    <button class="checkout-btn" ${this.items.length === 0 ? 'disabled' : ''} onclick="window.cart.proceedToCheckout()">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
        
        return panel;
    }

    renderCartItems() {
        return this.items.map(item => `
            <div class="cart-item">
                <div class="item-details">
                    <h4>${this.escapeHtml(item.name)}</h4>
                    <p>€${this.formatPrice(item.price)} per license</p>
                </div>
                <div class="item-quantity">
                    <button onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="window.cart.removeFromCart('${item.id}')">Remove</button>
            </div>
        `).join('');
    }

    proceedToCheckout() {
        if (this.items.length === 0) return;
        
        // For now, redirect to a generic checkout URL
        window.location.href = 'https://checkout.mescius.eu/';
    }

    updateCartPanel() {
        const cartPanel = document.getElementById('cart-panel');
        if (cartPanel) {
            const itemsList = cartPanel.querySelector('#cart-items-list');
            const total = cartPanel.querySelector('.cart-total strong');
            const checkoutBtn = cartPanel.querySelector('.checkout-btn');
            
            if (itemsList) {
                itemsList.innerHTML = this.items.length === 0 ? '<p class="empty-cart">Your cart is empty</p>' : this.renderCartItems();
            }
            if (total) {
                total.textContent = `Total: €${this.formatPrice(this.getTotal())}`;
            }
            if (checkoutBtn) {
                checkoutBtn.disabled = this.items.length === 0;
            }
        }
    }

    showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Override the addToCart method to include notification
    addToCart(productId, name, price) {
        // Check if item already exists
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateCartPanel();
        
        // Show notification
        this.showCartNotification(`${name} added to cart!`);
    }

    // Override updateQuantity to update panel
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartPanel();
            }
        }
    }

    // Override removeFromCart to update panel
    removeFromCart(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartPanel();
    }

    // Utility methods
    formatPrice(price) {
        return price.toLocaleString('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API methods
    getItems() {
        return [...this.items];
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Export for use in other scripts
window.ShoppingCart = ShoppingCart;

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
});