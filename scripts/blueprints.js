/**
 * Blueprints Page JavaScript
 * Handles expandable cards, animated metrics, and product modals
 */

// Initialize blueprint functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeExpandableCards();
    initializeMetricsAnimation();
    initializeProductModals();
    initializeNewsletterModal();
    initializeScrollAnimations();
});

/**
 * Initialize expandable card system
 */
function initializeExpandableCards() {
    const expandableCards = document.querySelectorAll('#expandable-card, .expandable-card');
    
    expandableCards.forEach(card => {
        const toggleBtn = card.querySelector('#card-toggle, .card-toggle');
        const collapsibleContent = card.querySelector('#collapsible-story-content, .collapsible-content');
        const toggleIcon = card.querySelector('.toggle-icon');
        
        if (!toggleBtn || !collapsibleContent) return;
        
        // Set initial state
        let isExpanded = false;
        collapsibleContent.style.maxHeight = '0';
        collapsibleContent.style.overflow = 'hidden';
        collapsibleContent.style.transition = 'max-height 0.4s ease-out';
        
        // Toggle functionality
        toggleBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            toggleCardExpansion(card, collapsibleContent, toggleIcon, isExpanded);
        });

        // Keyboard support
        toggleBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                isExpanded = !isExpanded;
                toggleCardExpansion(card, collapsibleContent, toggleIcon, isExpanded);
            }
        });

        // Set proper ARIA attributes
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', collapsibleContent.id || 'collapsible-content');
        collapsibleContent.setAttribute('aria-hidden', 'true');
    });
}

/**
 * Toggle card expansion with animation
 */
function toggleCardExpansion(card, content, icon, isExpanded) {
    if (isExpanded) {
        // Expand
        content.style.maxHeight = content.scrollHeight + 'px';
        content.setAttribute('aria-hidden', 'false');
        card.classList.add('expanded');
    } else {
        // Collapse
        content.style.maxHeight = '0';
        content.setAttribute('aria-hidden', 'true');
        card.classList.remove('expanded');
    }

    // Update toggle button
    const toggleBtn = card.querySelector('#card-toggle, .card-toggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', isExpanded.toString());
        
        // Update button text if it contains text
        const buttonText = toggleBtn.querySelector('.toggle-text');
        if (buttonText) {
            buttonText.textContent = isExpanded ? 'Show Less' : 'Read Full Story';
        }
    }

    // Rotate icon
    updateToggleIcon(icon, isExpanded);
    
    // Animate card height
    animateCardHeight(card, isExpanded);
}

/**
 * Update toggle icon rotation
 */
function updateToggleIcon(icon, isExpanded) {
    if (!icon) return;
    
    if (isExpanded) {
        icon.style.transform = 'rotate(180deg)';
        icon.classList.add('expanded');
    } else {
        icon.style.transform = 'rotate(0deg)';
        icon.classList.remove('expanded');
    }
}

/**
 * Animate card height changes
 */
function animateCardHeight(card, isExpanded) {
    // Add visual feedback
    card.style.transition = 'all 0.4s ease-out';
    
    if (isExpanded) {
        card.classList.add('expanding');
        setTimeout(() => {
            card.classList.remove('expanding');
        }, 400);
    }

    // Smooth scroll to keep card in view if needed
    if (isExpanded) {
        setTimeout(() => {
            const cardRect = card.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            if (cardRect.bottom > viewportHeight) {
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end',
                    inline: 'nearest'
                });
            }
        }, 200);
    }
}

/**
 * Initialize animated metrics counters
 */
function initializeMetricsAnimation() {
    const metrics = document.querySelectorAll('.metric-value[data-target], [data-target]');
    
    if (metrics.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMetricValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -20px 0px'
    });

    metrics.forEach(metric => {
        observer.observe(metric);
    });
}

/**
 * Animate metric value with counting effect
 */
function animateMetricValue(element) {
    const targetValue = element.getAttribute('data-target');
    if (!targetValue) return;

    const { number, suffix } = parseMetricValue(targetValue);
    
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = number / steps;
    const stepDuration = duration / steps;
    
    // Add counting class for visual effects
    element.classList.add('counting');
    
    const counter = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= number) {
            currentValue = number;
            clearInterval(counter);
            element.classList.remove('counting');
            element.classList.add('counted');
        }
        
        const formattedValue = formatMetricValue(currentValue, suffix);
        element.textContent = formattedValue;
        
        // Add pulse effect during animation
        if (currentValue < number) {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, stepDuration / 2);
        }
    }, stepDuration);
}

/**
 * Parse metric value to separate number and suffix
 */
function parseMetricValue(value) {
    const numericPart = value.match(/[\d.]+/);
    const suffixPart = value.replace(/[\d.]/g, '');
    
    return {
        number: numericPart ? parseFloat(numericPart[0]) : 0,
        suffix: suffixPart || ''
    };
}

/**
 * Format metric value with proper suffix
 */
function formatMetricValue(value, suffix) {
    let formattedNumber = Math.floor(value);
    
    // Handle specific formatting cases
    if (suffix.includes('%')) {
        return formattedNumber + '%';
    } else if (suffix.includes('€')) {
        return '€' + formattedNumber.toLocaleString('de-DE');
    } else if (suffix.includes('k') || suffix.includes('K')) {
        if (value >= 1000) {
            formattedNumber = (value / 1000).toFixed(value >= 10000 ? 0 : 1);
        }
        return formattedNumber + 'k';
    } else if (suffix.includes('M')) {
        if (value >= 1000000) {
            formattedNumber = (value / 1000000).toFixed(1);
        }
        return formattedNumber + 'M';
    }
    
    return formattedNumber + suffix;
}

/**
 * Initialize product information modals
 */
function initializeProductModals() {
    const modalTriggers = document.querySelectorAll('.product-info-trigger');
    const modal = document.getElementById('product-info-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');
    
    if (!modal) return;

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            openProductModal(this);
        });

        // Keyboard support
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProductModal(this);
            }
        });
    });

    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProductModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProductModal();
        }
    });

    function openProductModal(trigger) {
        const productId = trigger.getAttribute('data-product-id');
        const title = trigger.getAttribute('data-title');
        const description = trigger.getAttribute('data-description');
        const demoLink = trigger.getAttribute('data-demolink');
        const productLink = trigger.getAttribute('data-productlink');
        
        loadModalContent(title, description, demoLink, productLink);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            modalClose.focus();
        }, 100);
        
        // Track modal open
        trackModalInteraction('product_modal_opened', title);
    }

    function closeProductModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        const activeTrigger = document.querySelector('.product-info-trigger:focus');
        if (activeTrigger) {
            activeTrigger.focus();
        }
    }

    function loadModalContent(title, description, demoLink, productLink) {
        if (!modalContent) return;
        
        const content = `
            <div class="modal-header">
                <h3 class="modal-title">${escapeHtml(title || 'Product Information')}</h3>
            </div>
            <div class="modal-body">
                <div class="product-description">
                    ${description || '<p>Product information will be loaded here.</p>'}
                </div>
                <div class="modal-actions">
                    ${demoLink ? `<a href="${escapeHtml(demoLink)}" class="btn btn-secondary" target="_blank" rel="noopener">Try Demo</a>` : ''}
                    ${productLink ? `<a href="${escapeHtml(productLink)}" class="btn btn-primary" target="_blank" rel="noopener">Learn More</a>` : ''}
                </div>
            </div>
        `;
        
        modalContent.innerHTML = content;
    }
}

/**
 * Initialize newsletter modal functionality
 */
function initializeNewsletterModal() {
    const openBtn = document.getElementById('open-newsletter-modal');
    const closeBtn = document.getElementById('close-newsletter-modal');
    const modal = document.getElementById('newsletter-modal');
    
    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener('click', openNewsletterModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeNewsletterModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeNewsletterModal();
        }
    });

    document.addEventListener('keydown', handleNewsletterEscape);

    function openNewsletterModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            if (closeBtn) closeBtn.focus();
        }, 100);
        
        // Track modal open
        trackModalInteraction('newsletter_modal_opened');
    }

    function closeNewsletterModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus
        if (openBtn) openBtn.focus();
    }

    function handleNewsletterEscape(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeNewsletterModal();
        }
    }
}

/**
 * Initialize scroll-based animations
 */
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.hero-content, .metric-card, .feature-highlight, .case-study-preview, .scroll-animate'
    );
    
    if (animateElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Don't unobserve to allow re-triggering if needed
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

/**
 * Track modal interactions for analytics
 */
function trackModalInteraction(action, productName = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'product_name': productName,
            'page_location': window.location.href
        });
    }
    
    console.log(`Modal interaction: ${action}${productName ? ` - ${productName}` : ''}`);
}

/**
 * Utility function to escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Initialize progressive enhancement features
 */
function initializeProgressiveEnhancements() {
    // Add loading states for heavy content
    const heavyContent = document.querySelectorAll('.hero-background, .large-image');
    heavyContent.forEach(element => {
        element.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Lazy load images that are not immediately visible
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

// Initialize progressive enhancements
document.addEventListener('DOMContentLoaded', initializeProgressiveEnhancements);

// Export functions for global use
window.BlueprintsPage = {
    initializeExpandableCards,
    initializeMetricsAnimation,
    initializeProductModals,
    toggleCardExpansion,
    animateMetricValue,
    formatMetricValue
};