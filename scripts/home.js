/**
 * Homepage Specific JavaScript
 * Handles homepage interactions and product ecosystem
 */

// Product data for the ecosystem section
const productData = {
    net: [
        {
            name: "ComponentOne",
            description: "Complete UI control collection for .NET applications with 100+ controls for WinForms, WPF, UWP, and .NET MAUI.",
            color: "#D93E3A",
            logo: "../logos/C1_prod_logo_ICON_2023.svg",
            features: ["Data Grids", "Charts & Graphs", "Input Controls", "Navigation", "Reporting"]
        },
        {
            name: "ActiveReports",
            description: "Powerful .NET reporting solution for creating pixel-perfect reports with advanced formatting and data visualization.",
            color: "#F4812F", 
            logo: "../logos/AR_prod_logo_ICON_2023.svg",
            features: ["Report Designer", "Dashboard Builder", "Export Options", "Data Sources", "Custom Controls"]
        },
        {
            name: "Spread.NET",
            description: "High-performance .NET spreadsheet component for creating Excel-compatible applications with advanced calculation engine.",
            color: "#6F9E42",
            logo: "../logos/SP_prod_logo_ICON_2023.svg",
            features: ["Excel Compatibility", "Formula Engine", "WinForms/WPF", "No Dependencies", "High Performance"]
        },
        {
            name: "Documents",
            description: "High-performance document APIs for .NET to create, edit, and convert Excel, Word, and PDF files without dependencies.",
            color: "#0083B6",
            logo: "../logos/DS_prod_logo_ICON_2023.svg", 
            features: ["Excel API", "Word API", "PDF API", "No Dependencies", "High Performance"]
        }
    ],
    js: [
        {
            name: "SpreadJS",
            description: "JavaScript spreadsheet component that delivers true Excel-like functionality for web applications.",
            color: "#6F9E42",
            logo: "../logos/SP_prod_logo_ICON_2023.svg",
            features: ["Excel Compatibility", "Formula Engine", "Charts", "Pivot Tables", "Import/Export"]
        },
        {
            name: "Wijmo",
            description: "Complete JavaScript UI control collection with 60+ controls for building responsive web applications.",
            color: "#0084C3",
            logo: "../logos/WJ_prod_logo_ICON_2023.svg", 
            features: ["Data Grids", "Input Controls", "Charts", "Navigation", "Mobile Support"]
        },
        {
            name: "ActiveReports JS",
            description: "JavaScript reporting component for creating dynamic reports and dashboards in web applications.",
            color: "#F4812F",
            logo: "../logos/AR_prod_logo_ICON_2023.svg",
            features: ["Report Designer", "Dashboard Builder", "Web-based", "Export Options", "Data Visualization"]
        }
    ]
};

// Initialize homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProductTabs();
    initializeStatsAnimation();
    initializePillarsAnimation();
    
    // Wait for page ready signal before starting hero animations
    if (document.body.classList.contains('page-ready')) {
        initializeHeroAnimations();
    } else {
        // Listen for page ready event
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' &&
                    document.body.classList.contains('page-ready')) {
                    initializeHeroAnimations();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

/**
 * Product tabs functionality
 */
function initializeProductTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const productGrids = document.querySelectorAll('.product-grid');

    // Create product cards
    createProductCards();

    // Tab switching
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            
            // Update active tab
            tabLinks.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active grid
            productGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === `${platform}-products`) {
                    grid.classList.add('active');
                }
            });
        });
    });
}

/**
 * Create product cards dynamically
 */
function createProductCards() {
    const netGrid = document.getElementById('net-products');
    const jsGrid = document.getElementById('js-products');

    if (netGrid) {
        netGrid.innerHTML = productData.net.map(product => createProductCard(product)).join('');
    }

    if (jsGrid) {
        jsGrid.innerHTML = productData.js.map(product => createProductCard(product)).join('');
    }
}

/**
 * Create individual product card HTML
 */
function createProductCard(product) {
    return `
        <div class="product-card" style="--product-color: ${product.color}; --product-color-light: ${product.color}20;">
            <div class="product-card-icon">
                <img src="${product.logo}" alt="${product.name} Logo" onerror="this.style.display='none'">
            </div>
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-description">${product.description}</p>
            <ul class="product-card-features">
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;
}

/**
 * Stats counter animation
 */
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    // Create intersection observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

/**
 * Animate counter with easing
 */
function animateCounter(element) {
    const target = element.getAttribute('data-target');
    const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
    const suffix = target.replace(/[\d]/g, '');
    
    let current = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = numericTarget / steps;
    const stepDuration = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericTarget) {
            current = numericTarget;
            clearInterval(timer);
        }
        
        // Format number with suffix
        let displayValue = Math.floor(current);
        if (suffix.includes('K')) {
            displayValue = (displayValue / 1000).toFixed(displayValue >= 1000 ? 0 : 1) + 'K';
        } else if (suffix.includes('M')) {
            displayValue = (displayValue / 1000000).toFixed(1) + 'M';
        } else {
            displayValue = displayValue.toString();
        }
        
        // Add any remaining suffix characters
        const cleanSuffix = suffix.replace(/[KM]/g, '');
        element.textContent = displayValue + cleanSuffix;
        
        // Add pulse animation during counting
        element.parentElement.classList.add('counting');
        
        if (current >= numericTarget) {
            setTimeout(() => {
                element.parentElement.classList.remove('counting');
            }, 500);
        }
    }, stepDuration);
}

/**
 * Hero section animations
 */
function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelectorAll('.hero-cta-button');

    // Start animations immediately since page is already ready
    // Stagger animations for hero elements
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }

    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s ease-out';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 200);
    }

    heroButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            button.style.transition = 'all 0.8s ease-out';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });

    // Add floating animation to hero elements after main animation completes
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('animate-float');
        }, 800);
    }
}

/**
 * Pillars section animations
 */
function initializePillarsAnimation() {
    const pillars = document.querySelectorAll('.pillar');
    
    // Create staggered animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-scale-in');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    pillars.forEach((pillar, index) => {
        // Set initial state
        pillar.style.opacity = '0';
        pillar.style.transform = 'translateY(30px)';
        pillar.style.transition = 'all 0.6s ease-out';
        
        observer.observe(pillar);
    });

    // Add hover sound effect (optional)
    pillars.forEach(pillar => {
        pillar.addEventListener('mouseenter', function() {
            // Could add subtle sound effect here
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        pillar.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Logo strip animation
 */
function initializeLogoStrip() {
    const logoItems = document.querySelectorAll('.logo-item');
    
    // Infinite scroll effect for logos (optional enhancement)
    const logoStrip = document.querySelector('.logo-strip');
    if (logoStrip && logoItems.length > 0) {
        // Clone logos for seamless scrolling
        const clonedLogos = [...logoItems].map(logo => logo.cloneNode(true));
        clonedLogos.forEach(logo => logoStrip.appendChild(logo));
        
        // Add CSS for infinite scroll (if desired)
        logoStrip.style.animation = 'scroll-logos 20s linear infinite';
    }
}

/**
 * Enhanced interactions
 */
function initializeEnhancedInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .hero-cta-button, .challenge-card');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple effect
const rippleCSS = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
        z-index: 1;
    }
    
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize enhanced interactions after DOM load
document.addEventListener('DOMContentLoaded', initializeEnhancedInteractions);

// Export for use in other scripts
window.HomepageJS = {
    productData,
    initializeProductTabs,
    initializeStatsAnimation,
    initializeHeroAnimations,
    initializePillarsAnimation,
    createProductCard,
    animateCounter
};