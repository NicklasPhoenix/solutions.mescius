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
        this.cartToggleBtn = document.getElementById('cart-toggle-btn');
        this.checkoutLink = document.getElementById('checkout-link');
        
        // Create cart badge if it doesn't exist
        this.createCartBadge();
    }

    createCartBadge() {
        if (!this.cartToggleBtn) return;
        
        // Check if badge already exists
        this.cartBadge = this.cartToggleBtn.querySelector('.cart-badge');
        
        if (!this.cartBadge) {
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

        this.cartItemsElement.addEventListener('click', (e) => {
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
        });
    }

    updateCartTotal() {
        if (!this.cartTotalElement) return;

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotalElement.textContent = `€${this.formatPrice(total)}`;
    }

    updateCartBadge() {
        if (!this.cartBadge) return;

        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartBadge.textContent = totalItems;
        this.cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
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
        if (this.isVisible) {
            this.hideCart();
        } else {
            this.showCart();
        }
    }

    showCart() {
        if (!this.cartElement) return;

        this.cartElement.classList.add('active');
        this.isVisible = true;
        
        // Update aria-expanded for accessibility
        if (this.cartToggleBtn) {
            this.cartToggleBtn.setAttribute('aria-expanded', 'true');
        }
    }

    hideCart() {
        if (!this.cartElement) return;

        this.cartElement.classList.remove('active');
        this.isVisible = false;
        
        // Update aria-expanded for accessibility
        if (this.cartToggleBtn) {
            this.cartToggleBtn.setAttribute('aria-expanded', 'false');
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