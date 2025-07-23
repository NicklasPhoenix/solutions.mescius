/**
 * MESCIUS Modern Design System - Main JavaScript
 * Core functionality for the modern design system
 */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeModals();
    initializeScrollEffects();
    initializeTheme();
    initializeCart();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close mobile menu when clicking on nav links
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Header scroll effect
    if (header) {
        let scrolled = false;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50 && !scrolled) {
                header.classList.add('scrolled');
                scrolled = true;
            } else if (scrollTop <= 50 && scrolled) {
                header.classList.remove('scrolled');
                scrolled = false;
            }
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initializeAnimations() {
    // Create intersection observer for scroll animations
    const animateElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
    
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Parallax effect for hero sections
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Counter animations - just set the final values, no animation
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        counter.textContent = counter.getAttribute('data-target');
    });
}

/**
 * Modal functionality
 */
function initializeModals() {
    // Newsletter modal
    const openModalBtn = document.getElementById('open-newsletter-modal');
    const closeModalBtn = document.getElementById('close-newsletter-modal');
    const modal = document.getElementById('newsletter-modal');

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll effects and progress indicators
 */
function initializeScrollEffects() {
    // Progress bars animation on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    
    if (progressBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const pillar = progressBar.closest('.pillar');
                    const width = pillar ? pillar.style.getPropertyValue('--progress-width') : '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 300);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Footer fade in animation
    const footer = document.querySelector('.footer');
    if (footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('in-view');
                    observer.unobserve(footer);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(footer);
    }
}

/**
 * Theme management
 */
function initializeTheme() {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Theme toggle functionality (if theme switcher exists)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update toggle button state - fix icon logic
            updateThemeToggleIcons(newTheme);
        });
        
        // Set initial toggle state
        updateThemeToggleIcons(savedTheme);
    }

    // Respect system preference only if no saved theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (!localStorage.getItem('theme')) {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        if (themeToggle) {
            updateThemeToggleIcons(systemTheme);
        }
    }
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', systemTheme);
            if (themeToggle) {
                updateThemeToggleIcons(systemTheme);
            }
        }
    });
}

/**
 * Update theme toggle icons - icons are now controlled by CSS
 * This function is kept for compatibility but CSS handles the visibility
 */
function updateThemeToggleIcons(theme) {
    // Icons are now controlled by CSS [data-theme] selectors
    // No JavaScript needed for icon display
}


/**
 * Utility functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

/**
 * Initialize shopping cart
 */
function initializeCart() {
    // Create floating cart HTML if it doesn't exist
    if (!document.getElementById('floating-cart')) {
        createFloatingCartHTML();
    }
    
    // Initialize cart only if ShoppingCart class is available
    if (typeof ShoppingCart !== 'undefined') {
        // Check if global cart instance already exists (from pricing.js)
        if (!window.cart) {
            window.cart = new ShoppingCart();
            console.log('Cart initialized globally');
        }
    }
}

/**
 * Create floating cart HTML structure
 */
function createFloatingCartHTML() {
    const cartHTML = `
        <div id="floating-cart" class="floating-cart" aria-live="polite" aria-atomic="true">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <div class="cart-header-actions">
                    <button id="cart-minimize-btn" class="cart-minimize-btn" title="Minimize Cart" aria-label="Minimize cart">−</button>
                    <button id="cart-close-btn" class="cart-close" title="Close Cart" aria-label="Close cart">×</button>
                </div>
            </div>
            <div id="cart-content" class="cart-content">
                <div id="cart-items">
                    <p>Your cart is empty.</p>
                </div>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total:</strong> <span id="cart-total-price">€0.00</span>
                </div>
                <a id="checkout-link" class="cta-button is-disabled" href="#">Proceed to Checkout</a>
            </div>
        </div>
    `;
    
    // Insert cart HTML at the end of body
    document.body.insertAdjacentHTML('beforeend', cartHTML);
}

// Export functions for use in other scripts
window.MesciusDesignSystem = {
    initializeNavigation,
    initializeAnimations,
    initializeModals,
    initializeScrollEffects,
    initializeTheme,
    initializeCart,
    updateThemeToggleIcons,
    debounce,
    throttle
};