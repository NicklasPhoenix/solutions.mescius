document.addEventListener('DOMContentLoaded', function () {
    // --- Data for our products ---
    const products = {
        net: [
            {
                logo: 'C1_prod_logo_full_2023',
                name: 'ComponentOne',
                tagline: 'Complete .NET UI Toolkit',
                description: 'Comprehensive UI controls for WinForms, WPF, and Blazor development.',
                link: 'pricing/',
                color: '#D93E3A' // ComponentOne Red
            },
            {
                logo: 'SP_prod_logo_full_2023',
                name: 'Spread',
                tagline: 'Excel-like .NET Controls',
                description: 'Industry-leading spreadsheet controls for desktop and web applications.',
                link: 'pricing/',
                color: '#6F9E42' // Spread Green
            },
            {
                logo: 'AR_prod_logo_full_2023',
                name: 'ActiveReports',
                tagline: 'Enterprise .NET Reporting',
                description: 'Flexible reporting tools for creating interactive business reports.',
                link: 'pricing/',
                color: '#F4812F' // ActiveReports Orange
            },
            {
                logo: 'DS_prod_logo_full_2023',
                name: 'Document Solutions',
                tagline: 'Document Automation APIs',
                description: 'Powerful APIs for PDF, Excel, and Word document processing.',
                link: 'pricing/',
                color: '#0083B6' // Document Solutions Blue
            }
        ],
        js: [
            {
                logo: 'SP_prod_logo_full_2023',
                name: 'Spread',
                tagline: 'Excel-like Web Controls',
                description: 'High-performance JavaScript spreadsheets for modern web applications.',
                link: 'pricing/',
                color: '#6F9E42' // Spread Green
            },
            {
                logo: 'AR_prod_logo_full_2023',
                name: 'ActiveReports',
                tagline: 'Client-Side Reporting',
                description: 'Fast, lightweight reporting solution for modern web applications.',
                link: 'pricing/',
                color: '#F4812F' // ActiveReports Orange
            },
            {
                logo: 'WJ_prod_logo_full_2023',
                name: 'Wijmo',
                tagline: 'Enterprise JavaScript UI Library',
                description: 'Complete library of fast, flexible JavaScript UI components.',
                link: 'pricing/',
                color: '#0084C3' // Wijmo Blue
            },
            {
                logo: 'DS_prod_logo_full_2023',
                name: 'Document Solutions',
                tagline: 'Document APIs for JavaScript',
                description: 'Server-side and client-side APIs for PDF, Excel, and barcode processing.',
                link: 'pricing/',
                color: '#0083B6' // Document Solutions Blue
            }
        ]
    };

    // --- Function to create and inject product cards ---
    function renderProductCards(platform = 'net') {
        const activeGrid = document.getElementById(`${platform}-products`);
        const inactiveGrid = document.getElementById(platform === 'net' ? 'js-products' : 'net-products');

        // Clear both grids
        activeGrid.innerHTML = '';
        inactiveGrid.innerHTML = '';

        // Create cards for the active platform only
        products[platform].forEach(product => {
            const logoPath = `logos/${product.logo}.svg`;
            const cardHTML = `
                <div class="product-card" style="--product-color: ${product.color};">
                    <div class="logo-section">
                        <img src="${logoPath}" alt="${product.name} Logo" class="product-logo">
                    </div>
                    <div class="title-section">
                        <p class="product-tagline">${product.tagline}</p>
                    </div>
                    <div class="action-section">
                        <a href="${product.link}" class="product-cta">Learn More</a>
                    </div>
                </div>
            `;
            activeGrid.innerHTML += cardHTML;
        });
    }
    
    // --- Logic for the interactive tabs ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const productGrids = document.querySelectorAll('.product-grid');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.platform;

            // Update active state on tabs
            tabLinks.forEach(link => link.classList.remove('active'));
            tab.classList.add('active');

            // Show the correct product grid
            productGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === `${platform}-products`) {
                    grid.classList.add('active');
                }
            });

            // Re-render cards for the selected platform
            renderProductCards(platform);
        });
    });

    // --- Initial render of the cards on page load ---
    renderProductCards('net'); // Start with .NET products
});
// =========================================================
// STATS SECTION: METRIC ANIMATION
// =========================================================

const statItems = document.querySelectorAll('.stat-item');
if (statItems.length > 0) {
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueDiv = entry.target.querySelector('.stat-number');
                const targetString = valueDiv.dataset.target; // e.g., "250K+", "1.2M+"

                if (!targetString) {
                    console.warn('No data-target found for stat animation');
                    return;
                }

                // 1. Parse the target number and identify suffixes (K, M)
                let numericTarget = parseFloat(targetString); // Extracts 40, 250, 1.2, 175
                if (targetString.toLowerCase().includes('k')) {
                    numericTarget *= 1000;
                }
                if (targetString.toLowerCase().includes('m')) {
                    numericTarget *= 1000000;
                }
                
                // If parsing fails, just set the text and exit
                if (isNaN(numericTarget)) {
                    valueDiv.textContent = targetString;
                    return;
                }

                const duration = 3500; // ms
                const startTime = performance.now();

                const updateCount = (timestamp) => {
                    const elapsedTime = timestamp - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    if (progress < 1) {
                        const currentCount = Math.floor(progress * numericTarget);
                        // Use toLocaleString() to add commas automatically
                        valueDiv.textContent = currentCount.toLocaleString('en-US');
                        requestAnimationFrame(updateCount);
                    } else {
                        // Once animation is done, set the final text to the original target string
                        // This ensures "250K+", "1.2M+", etc., are displayed correctly.
                        valueDiv.textContent = targetString;
                    }
                };
                
                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const statObserver = new IntersectionObserver(animateStats, {
        root: null,
        threshold: 0.5 // Trigger when 50% of the item is visible
    });

    statItems.forEach(item => {
        statObserver.observe(item);
    });
}