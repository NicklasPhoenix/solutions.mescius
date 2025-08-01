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
        card.classList.add('is-expanded'); // Add theme-aware class
    } else {
        // Collapse
        content.style.maxHeight = '0';
        content.setAttribute('aria-hidden', 'true');
        card.classList.remove('expanded');
        card.classList.remove('is-expanded'); // Remove theme-aware class
    }

    // Update toggle button
    const toggleBtn = card.querySelector('#card-toggle, .card-toggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', isExpanded.toString());
        
        // Update button text if it contains text
        const buttonText = toggleBtn.querySelector('.toggle-text');
        if (buttonText) {
            buttonText.textContent = isExpanded ? 'Show Less' : 'View Implementation Details';
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
    const animatedMetrics = document.querySelectorAll('.metric-value[data-target], [data-target]');
    const textMetrics = document.querySelectorAll('.metric-value[data-text], [data-text]');
    
    if (animatedMetrics.length === 0 && textMetrics.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check if this is a text-only metric or an animated metric
                if (entry.target.hasAttribute('data-text')) {
                    // Text-only metrics just get a fade-in effect
                    entry.target.classList.add('counted');
                } else if (entry.target.hasAttribute('data-target')) {
                    // Animated metrics get the counting animation
                    animateMetricValue(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -20px 0px'
    });

    // Observe both types of metrics
    animatedMetrics.forEach(metric => {
        observer.observe(metric);
    });
    
    textMetrics.forEach(metric => {
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
        
        // Add pulse effect during animation - theme-aware
        if (currentValue < number) {
            element.style.transform = 'scale(1.05)';
            element.style.transition = 'transform 0.1s ease-out';
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
        // Handle % with additional characters like +
        const percentMatch = suffix.match(/%(.*)$/);
        const additionalChars = percentMatch ? percentMatch[1] : '';
        return formattedNumber + '%' + additionalChars;
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
 * Get product information by ID (matching pricing page data)
 */
function getProductInfo(productId) {
    const productDatabase = {
        'componentone': {
            title: 'ComponentOne',
            description: '<strong>The complete UI toolkit for .NET developers.</strong><br>ComponentOne includes hundreds of controls to solve any business need. Key features include:<ul><li>High-performance DataGrids and Charts</li><li>Full support for WinForms, WPF, Blazor, and MAUI</li><li>Powerful reporting and document generation</li></ul>',
            demoLink: 'https://mescius.eu/componentone/download',
            productLink: 'https://developer.mescius.com/componentone'
        },
        'componentone-studio': {
            title: 'ComponentOne',
            description: '<strong>The complete UI toolkit for .NET developers.</strong><br>ComponentOne includes hundreds of controls to solve any business need. Key features include:<ul><li>High-performance DataGrids and Charts</li><li>Full support for WinForms, WPF, Blazor, and MAUI</li><li>Powerful reporting and document generation</li></ul>',
            demoLink: 'https://mescius.eu/componentone/download',
            productLink: 'https://developer.mescius.com/componentone'
        },
        'spreadjs-professional': {
            title: 'SpreadJS',
            description: '<strong>Empower your web applications with the industry-leading JavaScript spreadsheet solution.</strong><br>SpreadJS provides a complete, Excel-like experience for your users, including:<ul><li>High-speed grids</li><li>Complex calculations & charts</li><li>Pivot tables</li><li>Advanced data analysis tools</li></ul><p>It is ideal for creating <strong>financial, scientific, and enterprise resource planning (ERP)</strong> applications.</p>',
            demoLink: 'https://mescius.eu/spreadjs/download',
            productLink: 'https://developer.mescius.com/spreadjs'
        },
        'spreadnet': {
            title: 'Spread.NET',
            description: '<strong>Deliver the ultimate spreadsheet experience in your .NET desktop and web applications with Spread.NET.</strong><br>This powerful component suite provides high-performance data grids and designers for <strong>WinForms, ASP.NET, and WPF</strong>.<p>Enable advanced features including:</p><ul><li>Complex calculations, charting, and pivot tables</li><li>Seamless Excel (.XLSX) import and export</li></ul><p>The perfect toolset for creating feature-rich <strong>financial and data analysis</strong> applications.</p>',
            demoLink: 'https://mescius.eu/spreadnet/download',
            productLink: 'https://developer.mescius.com/spreadnet'
        },
        'wijmo-enterprise': {
            title: 'Wijmo',
            description: "<strong>Build high-performance, enterprise-level web applications</strong> with Wijmo's comprehensive library of JavaScript/TypeScript UI components.<p>Key features include:</p><ul><li>A <strong>zero-dependency, small footprint</strong> architecture written for performance.</li><li>The industry's best datagrid, <strong>FlexGrid</strong>, plus 100+ other controls for data visualization and UI.</li><li>Full framework support for <strong>Angular, React, Vue</strong>, and more.</li></ul><p>Wijmo is the premier choice for your most <strong>demanding data-driven applications.</strong></p>",
            demoLink: 'https://mescius.eu/wijmo/download',
            productLink: 'https://developer.mescius.com/wijmo'
        },
        'activereportsjs': {
            title: 'ActiveReportsJS',
            description: "<strong>Integrate fast, feature-rich reporting</strong> into your client-side web applications with ActiveReportsJS.<p>This complete JavaScript solution provides:</p><ul><li>A powerful, <strong>embeddable report designer and viewer</strong>.</li><li>The ability for your end-users to create and interact with reports on <strong>any platform</strong>.</li><li>Connectivity to local and remote JSON data sources.</li><li>Direct-in-browser export to popular formats like <strong>PDF, Excel (XLSX), and HTML</strong>.</li></ul>",
            demoLink: 'https://mescius.eu/activereportsjs/download',
            productLink: 'https://developer.mescius.com/activereportsjs'
        },
        'activereportsnet': {
            title: 'ActiveReports.NET',
            description: "<strong>Add powerful, interactive reporting</strong> to your <strong>WinForms, WPF, and ASP.NET</strong> applications with ActiveReports.NET.<p>This complete .NET reporting toolkit <strong>seamlessly integrates with Visual Studio</strong>, allowing developers to create everything from simple to complex reports.</p><p>Key capabilities include:</p><ul><li>Embeddable end-user report designers.</li><li>Extensive data-binding to any .NET data source.</li><li>Support for multiple report types, including <strong>RDL and Page reports</strong>.</li><li>Rich data visualization and export to popular formats like <strong>PDF, Excel, and Word</strong>.</li></ul>",
            demoLink: 'https://mescius.eu/activereportsnet/download',
            productLink: 'https://developer.mescius.com/activereportsnet'
        },
        'activereports-net': {
            title: 'ActiveReports.NET',
            description: "<strong>Add powerful, interactive reporting</strong> to your <strong>WinForms, WPF, and ASP.NET</strong> applications with ActiveReports.NET.<p>This complete .NET reporting toolkit <strong>seamlessly integrates with Visual Studio</strong>, allowing developers to create everything from simple to complex reports.</p><p>Key capabilities include:</p><ul><li>Embeddable end-user report designers.</li><li>Extensive data-binding to any .NET data source.</li><li>Support for multiple report types, including <strong>RDL and Page reports</strong>.</li><li>Rich data visualization and export to popular formats like <strong>PDF, Excel, and Word</strong>.</li></ul>",
            demoLink: 'https://mescius.eu/activereportsnet/download',
            productLink: 'https://developer.mescius.com/activereportsnet'
        },
        'documentsolutions-dotnet': {
            title: 'Document Solutions',
            description: "<strong>Supercharge your document processing</strong> with Document Solutions, a suite of <strong>high-speed, dependency-free APIs</strong> for .NET and Java.<p>Key features allow you to:</p><ul><li>Programmatically create, load, manipulate, and save <strong>Excel, PDF, & Word</strong> documents.</li><li>Deploy on any server (<strong>Windows, Linux, & macOS</strong>) with zero server-side dependencies on MS Office or Acrobat.</li><li>Automate common tasks like <strong>generating invoices, creating reports from templates,</strong> and managing documents in your enterprise applications.</li></ul>",
            demoLink: 'https://mescius.eu/document-solutions/download-product',
            productLink: 'https://developer.mescius.com/document-solutions'
        },
        'documents-excel': {
            title: 'Document Solutions',
            description: "<strong>Supercharge your document processing</strong> with Document Solutions, a suite of <strong>high-speed, dependency-free APIs</strong> for .NET and Java.<p>Key features allow you to:</p><ul><li>Programmatically create, load, manipulate, and save <strong>Excel, PDF, & Word</strong> documents.</li><li>Deploy on any server (<strong>Windows, Linux, & macOS</strong>) with zero server-side dependencies on MS Office or Acrobat.</li><li>Automate common tasks like <strong>generating invoices, creating reports from templates,</strong> and managing documents in your enterprise applications.</li></ul>",
            demoLink: 'https://mescius.eu/document-solutions/download-product',
            productLink: 'https://developer.mescius.com/document-solutions'
        },
        'documents-pdf': {
            title: 'Document Solutions',
            description: "<strong>Supercharge your document processing</strong> with Document Solutions, a suite of <strong>high-speed, dependency-free APIs</strong> for .NET and Java.<p>Key features allow you to:</p><ul><li>Programmatically create, load, manipulate, and save <strong>Excel, PDF, & Word</strong> documents.</li><li>Deploy on any server (<strong>Windows, Linux, & macOS</strong>) with zero server-side dependencies on MS Office or Acrobat.</li><li>Automate common tasks like <strong>generating invoices, creating reports from templates,</strong> and managing documents in your enterprise applications.</li></ul>",
            demoLink: 'https://mescius.eu/document-solutions/download-product',
            productLink: 'https://developer.mescius.com/document-solutions'
        }
    };
    
    return productDatabase[productId] || {
        title: 'Product Information',
        description: 'Product details will be available soon.',
        demoLink: '',
        productLink: ''
    };
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
        let title = trigger.getAttribute('data-title');
        let description = trigger.getAttribute('data-description');
        let demoLink = trigger.getAttribute('data-demolink');
        let productLink = trigger.getAttribute('data-productlink');
        
        // If no title/description, get from product database
        if (!title || !description) {
            const productInfo = getProductInfo(productId);
            title = title || productInfo.title;
            description = description || productInfo.description;
            demoLink = demoLink || productInfo.demoLink;
            productLink = productLink || productInfo.productLink;
        }
        
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