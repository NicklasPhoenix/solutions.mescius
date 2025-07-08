document.addEventListener('DOMContentLoaded', function () {
    // --- Data for our products ---
    const products = {
        net: [
            {
                logo: 'C1_prod_logo_full_2023',
                name: 'ComponentOne',
                description: 'The most comprehensive UI toolkit for .NET, with controls for WinForms, WPF, Blazor, and more.',
                link: 'pricing/'
            },
            {
                logo: 'SP_prod_logo_full_2023',
                name: 'Spread.NET',
                description: 'The industry-leading spreadsheet solution to create Excel-like experiences in desktop and web apps.',
                link: 'pricing/'
            },
            {
                logo: 'AR_prod_logo_full_2023',
                name: 'ActiveReports.NET',
                description: 'Flexible reporting tools for developers to create, view, and export interactive reports.',
                link: 'pricing/'
            },
            {
                logo: 'DS_prod_logo_full_2023',
                name: 'Document Solutions for .NET',
                description: 'A suite of powerful APIs for PDF, Excel, and Word processing to automate document workflows.',
                link: 'pricing/'
            }
        ],
        js: [
            {
                logo: 'SP_prod_logo_full_2023',
                name: 'SpreadJS',
                description: 'High-performance JavaScript spreadsheets and data visualization for modern, Excel-like web apps.',
                link: 'pricing/'
            },
            {
                logo: 'AR_prod_logo_full_2023',
                name: 'ActiveReportsJS',
                description: 'A fast, lightweight, and powerful client-side reporting solution for modern web applications.',
                link: 'pricing/'
            },
            {
                logo: 'WJ_prod_logo_full_2023',
                name: 'Wijmo',
                description: 'A complete library of fast, flexible, and lightweight JavaScript UI components for the enterprise.',
                link: 'pricing/'
            },
            {
                logo: 'DS_prod_logo_full_2023',
                name: 'Document Solutions for JS',
                description: 'Server-side and client-side APIs for PDF, Excel, and barcode processing in JavaScript.',
                link: 'pricing/'
            }
        ]
    };

    // --- Function to create and inject product cards ---
    function renderProductCards() {
        const netGrid = document.getElementById('net-products');
        const jsGrid = document.getElementById('js-products');

        // Clear existing cards
        netGrid.innerHTML = '';
        jsGrid.innerHTML = '';

        // Create .NET cards
        products.net.forEach(product => {
            // IMPORTANT: Adjust this path to where your logos are stored
            const logoPath = `logos/${product.logo}.svg`;
            const cardHTML = `
                <div class="product-card">
                    <img src="${logoPath}" alt="${product.name} Logo" class="product-logo">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <a href="${product.link}" class="product-card-link">Learn More</a>
                </div>
            `;
            netGrid.innerHTML += cardHTML;
        });

        // Create JavaScript cards
        products.js.forEach(product => {
            const logoPath = `logos/${product.logo}.svg`;
            const cardHTML = `
                <div class="product-card">
                    <img src="${logoPath}" alt="${product.name} Logo" class="product-logo">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <a href="${product.link}" class="product-card-link">Learn More</a>
                </div>
            `;
            jsGrid.innerHTML += cardHTML;
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
        });
    });

    // --- Initial render of the cards on page load ---
    renderProductCards();
});