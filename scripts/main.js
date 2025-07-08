// =============================
// PRODUCT LOGO INJECTION
// =============================
document.addEventListener('DOMContentLoaded', function() {
    // This map connects the data-attribute to the correct SVG file name.
    const logoFileMap = {
        'componentone': 'C1_prod_logo_full_2023',
        'spreadjs': 'SP_prod_logo_full_2023',
        'spread-net': 'SP_prod_logo_full_2023',
        'wijmo': 'WJ_prod_logo_full_2023',
        'activereports-js': 'AR_prod_logo_full_2023',
        'activereports-net': 'AR_prod_logo_full_2023',
        'document-solutions': 'DS_prod_logo_full_2023'
    };

    // Find all product sections that have a logo name.
    const products = document.querySelectorAll('[data-logo-name]');

    products.forEach(product => {
        const logoName = product.dataset.logoName;
        const header = product.querySelector('.product-header');

        // Find the info button to get the proper title for the alt text.
        const infoTrigger = product.querySelector('.product-info-trigger');
        const altText = infoTrigger ? infoTrigger.dataset.title : 'Product Logo';

        if (logoName && logoFileMap[logoName] && header) {
            // 1. Create the link (<a>) element
            const logoLink = document.createElement('a');
            logoLink.href = infoTrigger && infoTrigger.dataset.productlink ? infoTrigger.dataset.productlink : '#'; // Link to the product page
            logoLink.tabIndex = 0;
            logoLink.setAttribute('aria-label', altText);

            // 2. Create the image (<img>) element
            const logoImg = document.createElement('img');
            logoImg.className = 'product-logo';
            logoImg.src = `../logos/${logoFileMap[logoName]}.svg`;
            logoImg.alt = altText;

            // 3. Put the image inside the link
            logoLink.appendChild(logoImg);

            // 4. Put the complete link into the header
            header.prepend(logoLink);
        }
    });
});
// Comprehensive JavaScript for solutions.mescius.eu
// Unified script for all pages: home, blueprints, pricing, bundles, cookie-policy

// =========================================================
// IMMEDIATE THEMING - PREVENT FOUC FOR ALL THEMED PAGES
// =========================================================
// This runs immediately to prevent Flash of Unstyled Content
(function() {
    const root = document.documentElement;
    const pageContent = document.documentElement.innerHTML.toLowerCase();
    
    // Detect if this page has theming elements (tags, product content)
    const hasThemeElements = 
        pageContent.includes('net-tag') || 
        pageContent.includes('js-tag') || 
        pageContent.includes('ar-tag') || 
        pageContent.includes('ds-tag') || 
        pageContent.includes('wijmo-tag') ||
        pageContent.includes('blazor-tag') ||
        window.location.pathname.includes('/blueprints/');
    
    // Only apply theming if this page has theme-able content
    if (!hasThemeElements) return;
    
    // Detect product from page content
    let detectedProduct = 'wijmo'; // default
    
    if (pageContent.includes('componentone') || pageContent.includes('winforms') || pageContent.includes('wpf') || pageContent.includes('blazor')) {
        detectedProduct = 'net';
    } else if (pageContent.includes('spreadjs') || pageContent.includes('spread.net')) {
        detectedProduct = 'js';
    } else if (pageContent.includes('activereports')) {
        detectedProduct = 'arjs';
    } else if (pageContent.includes('document solutions') || pageContent.includes('documents for')) {
        detectedProduct = 'ds';
    }
    
    // Apply theming immediately using actual CSS custom property values
    switch (detectedProduct) {
        case 'wijmo':
            root.style.setProperty('--accent-color', '#48A9C5');
            break;
        case 'js':
            root.style.setProperty('--accent-color', '#809B59');
            break;
        case 'net':
            root.style.setProperty('--accent-color', '#D6564C');
            break;
        case 'arjs':
            root.style.setProperty('--accent-color', '#EA8939');
            break;
        case 'ds':
            root.style.setProperty('--accent-color', '#5A7E9E');
            break;
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // SHARED UTILITIES AND ICONS
    // =========================================================
    
    const iconMinus = '<svg viewBox="0 0 24 24"><line x1="6" y1="12" x2="18" y2="12"></line></svg>';
    const iconPlus = '<svg viewBox="0 0 24 24"><line x1="12" y1="6" x2="12" y2="18"></line><line x1="6" y1="12" x2="18" y2="12"></line></svg>';

    // =========================================================
    // UNIVERSAL NAVIGATION AND MOBILE MENU
    // =========================================================
    
    const navToggle = document.getElementById('nav-toggle') || document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
            mainNav.classList.toggle('is-open');
            this.setAttribute('aria-expanded', mainNav.classList.contains('is-active') || mainNav.classList.contains('is-open'));
        });

        // Close menu when a navigation link is clicked (for smoother mobile experience)
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('is-open', 'is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================
    // NEWSLETTER MODAL (FOOTER)
    // =========================================================
    
    const newsletterModal = document.getElementById('newsletter-modal');
    const openNewsletterModalBtn = document.getElementById('open-newsletter-modal');
    const closeNewsletterModalBtn = document.getElementById('close-newsletter-modal');

    if (openNewsletterModalBtn && newsletterModal && closeNewsletterModalBtn) {
        openNewsletterModalBtn.addEventListener('click', () => {
            newsletterModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        closeNewsletterModalBtn.addEventListener('click', () => {
            newsletterModal.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Close modal if user clicks outside of modal content
        window.addEventListener('click', (event) => {
            if (event.target === newsletterModal) {
                newsletterModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && newsletterModal.style.display === 'flex') {
                newsletterModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================================
    // BLUEPRINT PAGES: EXPANDABLE CASE STUDY CARD
    // =========================================================
    
    const expandableCard = document.getElementById('expandable-card');
    const cardToggle = document.getElementById('card-toggle');

    if (expandableCard && cardToggle) {
        cardToggle.addEventListener('click', () => {
            const isOpening = !expandableCard.classList.contains('is-open');
            const collapsibleContent = expandableCard.querySelector('.card-collapsible-content');
            
            if (isOpening) {
                // Opening: First set max-height to auto to measure, then animate
                collapsibleContent.style.maxHeight = 'auto';
                const contentHeight = collapsibleContent.scrollHeight;
                collapsibleContent.style.maxHeight = '0';
                
                // Force reflow, then set the target height
                requestAnimationFrame(() => {
                    collapsibleContent.style.maxHeight = contentHeight + 'px';
                    expandableCard.classList.add('is-open');
                });
                
                // Clean up after animation
                setTimeout(() => {
                    if (expandableCard.classList.contains('is-open')) {
                        collapsibleContent.style.maxHeight = 'none';
                    }
                }, 300);
            } else {
                // Closing: Set current height then animate to 0
                const contentHeight = collapsibleContent.scrollHeight;
                collapsibleContent.style.maxHeight = contentHeight + 'px';
                
                requestAnimationFrame(() => {
                    collapsibleContent.style.maxHeight = '0';
                    expandableCard.classList.remove('is-open');
                });
            }
            
            cardToggle.setAttribute('aria-expanded', isOpening);
            const toggleText = cardToggle.querySelector('.toggle-text');
            if (isOpening) {
                toggleText.textContent = 'Hide Implementation Details';
            } else {
                toggleText.textContent = 'View Implementation Details';
            }
        });
    }

    // =========================================================
    // HOME PAGE: CASE STUDY FILTERING (RESTORED FROM BACKUP)
    // =========================================================
    
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const noResultsMessage = document.getElementById('no-results-message');
    const filterToolbar = document.querySelector('.filter-toolbar');
    const appliedFiltersContainer = document.getElementById('applied-filters-container');

    // Only run filtering if on main page with case studies
    if (filterToolbar && caseStudyCards.length > 0) {
        const currentFilters = {
            industry: 'all',
            product: 'all'
        };

        // Map data-filter values to human-readable labels for chips
        const filterLabels = {
            'all': 'All',
            'finance': 'Finance',
            'logistics': 'Logistics',
            'healthcare': 'Healthcare',
            'energy': 'Energy',
            'insurance': 'Insurance',
            'bi': 'BI SaaS',
            'net': '.NET Suite',
            'js': 'SpreadJS',
            'wijmo': 'Wijmo',
            'arjs': 'ActiveReports',
            'ds': 'Document Solutions'
        };

        /**
         * Renders the filter chips based on current active filters.
         */
        function renderFilterChips() {
            if (!appliedFiltersContainer) return;
            
            appliedFiltersContainer.innerHTML = '';

            const addChip = (type, value) => {
                if (value !== 'all') {
                    const chip = document.createElement('div');
                    chip.classList.add('filter-chip');
                    chip.setAttribute('data-filter-type', type);
                    chip.setAttribute('data-filter-value', value);
                    chip.innerHTML = `<span class="filter-chip-text">${filterLabels[value] || value}</span>
                                     <button class="filter-chip-remove" aria-label="Remove filter ${filterLabels[value] || value}">×</button>`;
                    
                    appliedFiltersContainer.appendChild(chip);

                    // Add click listener to remove button
                    chip.querySelector('.filter-chip-remove').addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeFilterByChip(type);
                    });
                }
            };

            addChip('industry', currentFilters.industry);
            addChip('product', currentFilters.product);
        }

        /**
         * Removes a filter by chip click
         */
        function removeFilterByChip(type) {
            currentFilters[type] = 'all';

            // Update button states
            document.querySelectorAll(`.filter-set[data-filter-type="${type}"] .filter-btn`).forEach(btn => {
                btn.classList.remove('is-active');
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('is-active');
                }
            });

            applyFilters();
            renderFilterChips();
        }

        /**
         * Apply current filters to cards
         */
        function applyFilters() {
            let visibleCount = 0;

            caseStudyCards.forEach(card => {
                const cardIndustry = card.dataset.industry;
                const cardProduct = card.dataset.product;

                const industryMatch = currentFilters.industry === 'all' || 
                                    (cardIndustry && cardIndustry.includes(currentFilters.industry));
                const productMatch = currentFilters.product === 'all' || 
                                   (cardProduct && cardProduct.includes(currentFilters.product));

                if (industryMatch && productMatch) {
                    card.classList.remove('is-hidden');
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.classList.add('is-hidden');
                    card.style.display = 'none';
                }
            });

            // Show/hide no results message
            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'flex' : 'none';
            }
        }

        // Handle filter button clicks
        filterToolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            const filterSet = btn.closest('.filter-set');
            const filterType = filterSet.dataset.filterType;
            const filterValue = btn.dataset.filter;

            // Check if this button is already active and not the "all" button
            const isAlreadyActive = btn.classList.contains('is-active');
            const isAllButton = filterValue === 'all';

            // If clicking an already active non-"all" button, deselect it (toggle to "all")
            if (isAlreadyActive && !isAllButton) {
                currentFilters[filterType] = 'all';
                
                // Update button states - activate "all" button
                filterSet.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('is-active');
                    if (b.dataset.filter === 'all') {
                        b.classList.add('is-active');
                    }
                });
            } else {
                // Normal filter selection
                currentFilters[filterType] = filterValue;

                // Update button states within the same filter set
                filterSet.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('is-active');
                });
                btn.classList.add('is-active');
            }

            // Apply filters and render chips
            applyFilters();
            renderFilterChips();
        });

        // Handle clear filters button
        const clearFiltersBtn = document.querySelector('.clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                currentFilters.industry = 'all';
                currentFilters.product = 'all';

                // Reset all buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('is-active');
                    if (btn.dataset.filter === 'all') {
                        btn.classList.add('is-active');
                    }
                });

                applyFilters();
                renderFilterChips();
            });
        }

        // Initial filter application
        applyFilters();
        renderFilterChips();
    }

    // =========================================================
    // PRICING PAGE: COMPREHENSIVE CART AND PRODUCT FUNCTIONALITY
    // =========================================================
    
    // Element references for pricing page
    const pricingFilterToolbar = document.querySelector('.filter-toolbar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productSections = document.querySelectorAll('.product-pricing-section');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    const cartUI = document.getElementById('floating-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutLink = document.getElementById('checkout-link');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartHeader = cartUI ? cartUI.querySelector('.cart-header') : null;
    const pricingAppliedFiltersContainer = document.getElementById('applied-filters-container');

    const modalOverlay = document.getElementById('product-info-modal');
    const modalContainer = document.querySelector('.modal-container');
    const modalBody = document.getElementById('modal-body-content');
    const modalCloseBtn = document.getElementById('modal-close');
    const infoTriggers = document.querySelectorAll('.product-info-trigger');

    // Pricing page state
    let cart = JSON.parse(localStorage.getItem('mesciusCart')) || [];
    const currentFilters = {
        platform: 'all',
        product: 'all'
    };

    // Map data-filter values to human-readable labels for chips
    const filterLabels = {
        'all': 'All Products',
        'net': '.NET',
        'js': 'JavaScript',
        'componentone': 'ComponentOne',
        'spreadjs': 'SpreadJS',
        'spread-net': 'Spread.NET',
        'wijmo': 'Wijmo',
        'activereports-js': 'ActiveReportsJS',
        'activereports-net': 'ActiveReports.NET',
        'document-solutions': 'Document Solutions'
    };

    // Cart logic functions
    const saveCart = () => {
        localStorage.setItem('mesciusCart', JSON.stringify(cart));
    };

    const addItemToCart = (productId, productName, price) => {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: parseFloat(price), quantity: 1 });
        }
        updateCart();
        saveCart();
    };

    const decreaseItemQuantity = (productId) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                cart.splice(itemIndex, 1);
            }
        }
        updateCart();
        saveCart();
    };
    
    const increaseItemQuantity = (productId) => {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        }
        updateCart();
        saveCart();
    };

    const removeItemFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        saveCart();
    };

    const updateCart = () => {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            if (cartUI) cartUI.classList.remove('is-visible');
            if (checkoutLink) checkoutLink.classList.add('is-disabled');
            if (cartUI) cartUI.classList.remove('is-minimized');
            if (cartToggleBtn) cartToggleBtn.innerHTML = iconMinus;
            return;
        }
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-header">
                    <div class="cart-item-info">
                        <button class="cart-item-remove remove-item-btn" data-product-id="${item.id}" title="Remove item">×</button>
                        <span class="cart-item-name">${item.name}</span>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-product-id="${item.id}" title="Decrease quantity">-</button>
                        <input class="quantity-input" type="number" min="1" value="${item.quantity}" data-product-id="${item.id}" readonly />
                        <button class="quantity-btn increase-btn" data-product-id="${item.id}" title="Increase quantity">+</button>
                    </div>
                    <span class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `€${totalPrice.toFixed(2)}`;
        if (checkoutLink) {
            checkoutLink.href = generateCleverbridgeLink();
            checkoutLink.classList.remove('is-disabled');
        }
        if (cartUI) cartUI.classList.add('is-visible');
    };

    const generateCleverbridgeLink = () => {
        const baseURL = 'https://checkout.mescius.eu/1878/purl-shop';
        const uniqueProductIds = cart.map(item => `i${item.id}`);
        const quantityParams = cart.map(item => `quantity_i${item.id}=${item.quantity}`);
        const cartString = `cart=${uniqueProductIds.join(',')}`;
        const quantityString = quantityParams.join('&');
        return `${baseURL}?${cartString}&${quantityString}`;
    };

    const generateCleverbridgeRenewalLink = (productId, quantity, oldKeys) => {
        const baseURL = 'https://checkout.mescius.eu/1878/purl-shop'; 
        return `${baseURL}?cart=i${productId}&quantity_i${productId}=${quantity}&x-oldkeys_i${productId}=${encodeURIComponent(oldKeys)}`;
    };
    
    const openModal = (trigger) => {
        if (!modalContainer || !modalBody || !modalOverlay) return;
        const productSection = trigger.closest('.product-pricing-section');
        const accentColor = window.getComputedStyle(productSection).getPropertyValue('--accent-color');
        modalContainer.style.setProperty('--accent-color', accentColor.trim());
        const title = trigger.dataset.title || 'Product Details';
        const description = trigger.dataset.description || 'No description available.';
        const demoLink = trigger.dataset.demolink;
        const productLink = trigger.dataset.productlink;
        let modalHTML = `<h2 class="modal-title" id="modal-title">${title}</h2>`;
        modalHTML += `<div class="modal-content-area">${description}</div>`; 
        // Use modal-demo-links for button group
        modalHTML += `<div class="modal-demo-links">`;
        if (demoLink && demoLink !== '#') {
            modalHTML += `<a href="${demoLink}" target="_blank" class="cta-button cta-primary" rel="noopener noreferrer">Download Trial</a>`;
        }
        if (productLink && productLink !== '#') {
            modalHTML += `<a href="${productLink}" target="_blank" class="cta-button cta-secondary" rel="noopener noreferrer">Visit Product Page</a>`;
        }
        modalHTML += `</div>`;

        modalBody.innerHTML = modalHTML;
        modalOverlay.style.display = 'flex';
        modalOverlay.setAttribute('aria-hidden', 'false');
        modalContainer.focus();
    };
    
    const closeModal = () => {
        if (!modalOverlay || !modalBody) return;
        modalOverlay.style.display = 'none';
        modalOverlay.setAttribute('aria-hidden', 'true');
        modalBody.innerHTML = '';
    };

    // Pricing page event listeners
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                addItemToCart(button.dataset.productId, button.dataset.productName, button.dataset.price);
            });
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const productId = target.closest('.quantity-btn, .remove-item-btn')?.dataset.productId;
            if (!productId) return;

            if (target.matches('.increase-btn')) increaseItemQuantity(productId);
            else if (target.matches('.decrease-btn')) decreaseItemQuantity(productId);
            else if (target.matches('.remove-item-btn')) removeItemFromCart(productId);
        });
    }

    const toggleCart = () => {
        if (!cartUI || !cartToggleBtn) return;
        const isMinimized = cartUI.classList.toggle('is-minimized');
        cartToggleBtn.innerHTML = isMinimized ? iconPlus : iconMinus;
        cartToggleBtn.setAttribute('aria-expanded', !isMinimized);
    };

    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            toggleCart(); 
        });
    }

    if (cartHeader) {
        cartHeader.addEventListener('click', toggleCart);
    }
    
    // Initialize cart toggle button icon based on state
    if (cartUI && cartToggleBtn) {
        if (cartUI.classList.contains('is-minimized')) {
            cartToggleBtn.innerHTML = iconPlus;
            cartToggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            cartToggleBtn.innerHTML = iconMinus;
            cartToggleBtn.setAttribute('aria-expanded', 'true');
        }
    }

    if (infoTriggers.length > 0) {
        infoTriggers.forEach(trigger => trigger.addEventListener('click', () => openModal(trigger)));
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => { 
            if (e.target === modalOverlay) closeModal(); 
        });
    }

    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && modalOverlay && modalOverlay.style.display === 'flex') closeModal(); 
    });

    // Pricing page filtering logic
    const renderFilterChips = () => {
        if (!pricingAppliedFiltersContainer) return;
        pricingAppliedFiltersContainer.innerHTML = '';

        Object.entries(currentFilters).forEach(([filterType, filterValue]) => {
            if (filterValue !== 'all') {
                const chip = document.createElement('span');
                chip.className = 'filter-chip';
                chip.innerHTML = `
                    ${filterLabels[filterValue] || filterValue}
                    <button class="chip-remove-btn" data-filter-type="${filterType}" aria-label="Remove ${filterLabels[filterValue] || filterValue} filter">×</button>
                `;
                pricingAppliedFiltersContainer.appendChild(chip);
            }
        });

        // Remove existing event listeners to prevent duplicates
        const existingChips = pricingAppliedFiltersContainer.querySelectorAll('.chip-remove-btn');
        existingChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filterType;
                currentFilters[filterType] = 'all';
                
                // Reset the corresponding filter button to "all"
                const filterSet = document.querySelector(`[data-filter-type="${filterType}"]`);
                if (filterSet) {
                    filterSet.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('is-active');
                        btn.setAttribute('aria-selected', 'false');
                    });
                    const allBtn = filterSet.querySelector('[data-filter="all"]');
                    if (allBtn) {
                        allBtn.classList.add('is-active');
                        allBtn.setAttribute('aria-selected', 'true');
                    }
                }
                
                applyFilters();
                renderFilterChips();
            });
        });
    };

    const setupFilterControls = (toolbar) => {
        if (!toolbar) return;
        toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            // Use data-filter-type as in the HTML
            const filterSet = btn.closest('.filter-set');
            const filterType = filterSet ? filterSet.dataset.filterType : null;
            const filterValue = btn.dataset.filter;
            if (!filterType) return;
            currentFilters[filterType] = filterValue;
            // Remove is-active from all in this group
            filterSet.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            applyFilters();
            renderFilterChips();
        });
    };

    const applyFilters = () => {
        if (!productSections.length) return;
        
        productSections.forEach(section => {
            const sectionPlatform = section.dataset.platform;
            const sectionProduct = section.dataset.productFamily;
            
            const platformMatch = currentFilters.platform === 'all' || currentFilters.platform === sectionPlatform;
            const productMatch = currentFilters.product === 'all' || currentFilters.product === sectionProduct;
            
            const shouldShow = platformMatch && productMatch;
            section.style.display = shouldShow ? 'block' : 'none';
        });
    };

    // Pricing page tab functionality (restored from backup)
    const setupTabs = () => {
        const allTabsContainers = document.querySelectorAll('.product-pricing-section');
        
        allTabsContainers.forEach(container => {
            const tabs = container.querySelectorAll('.tab-btn');
            const panes = container.querySelectorAll('.tab-pane');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => {
                        t.classList.remove('is-active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    tab.classList.add('is-active');
                    tab.setAttribute('aria-selected', 'true');
                    
                    const targetPaneId = tab.dataset.tab + '-pane'; // Append '-pane' to match IDs
                    
                    panes.forEach(pane => {
                        pane.classList.toggle('is-active', pane.id === targetPaneId);
                        if (pane.id === targetPaneId) {
                            pane.removeAttribute('hidden');
                            pane.setAttribute('aria-hidden', 'false');
                            
                            // Check if there's only one price-card in this tab-pane, and hide badges if so
                            const priceCardsInPane = pane.querySelectorAll('.price-card');
                            if (priceCardsInPane.length <= 1) {
                                priceCardsInPane.forEach(card => {
                                    const badge = card.querySelector('.promo-badge');
                                    if (badge) badge.style.display = 'none';
                                    card.classList.remove('featured');
                                });
                            } else {
                                // Re-show badges and 'featured' class if multiple cards
                                priceCardsInPane.forEach(card => {
                                    const badge = card.querySelector('.promo-badge');
                                    if (badge && card.dataset.badge) { // Only show if it has a data-badge
                                        badge.textContent = card.dataset.badge; // Set badge text
                                        badge.style.display = 'inline-block';
                                        card.classList.add('featured'); // Re-add featured class
                                    }
                                });
                            }
                        } else {
                            pane.classList.remove('is-active');
                            pane.setAttribute('hidden', 'true');
                            pane.setAttribute('aria-hidden', 'true');
                        }
                    });
                });
            });
        });
    };

    // Pricing page renewal forms
    const setupRenewalForms = () => {
        document.querySelectorAll('.renewal-form').forEach(form => {
            const productName = form.dataset.productName;
            const renewalProductIds = JSON.parse(form.dataset.renewalProductIds || '[]');
            
            const productSelect = form.querySelector('select');
            const quantityInput = form.querySelector('input[type="number"]');
            
            if (productSelect && renewalProductIds.length > 0) {
                productSelect.innerHTML = renewalProductIds.map(product => 
                    `<option value="${product.id}">${product.name}</option>`
                ).join('');
            }

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const selectedProductId = productSelect ? productSelect.value : null;
                const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
                const emailInput = form.querySelector('.renewal-email-input');
                const keysTextarea = form.querySelector('.renewal-keys-textarea');
                const feedbackDiv = form.querySelector('.form-feedback');
                
                const email = emailInput.value.trim();
                const keys = keysTextarea.value.trim().split(/[\n,]+/).map(key => key.trim()).filter(key => key !== '').join(',');
                
                if (!selectedProductId || !quantity || !email || !keys) {
                    feedbackDiv.textContent = 'Please select a product, specify quantity, and fill out email and product key fields.';
                    feedbackDiv.style.color = 'var(--brand-c1)'; 
                    return;
                }
                
                feedbackDiv.textContent = '';

                const cleverbridgeRenewalUrl = generateCleverbridgeRenewalLink(selectedProductId, quantity, keys);
                window.location.href = cleverbridgeRenewalUrl;

                feedbackDiv.textContent = 'Redirecting to Cleverbridge for renewal...';
                feedbackDiv.style.color = 'var(--brand-spread)'; 
            });
        });
    };

    // Initialize pricing page functionality
    if (pricingFilterToolbar) {
        setupFilterControls(pricingFilterToolbar);
        applyFilters();
        renderFilterChips();
    }
    
    setupTabs();
    setupRenewalForms();
    updateCart();

    // =========================================================
    // BUNDLES PAGE: DISCOUNT CALCULATOR
    // =========================================================
    
    // Helper function to get the correct accent color for a card based on its tags/IDs
    const getCardAccentColor = (card) => {
        if (card.classList.contains('highlight')) {
            return 'var(--brand-net)';
        } else if (card.classList.contains('highlight-blue')) {
            return 'var(--brand-ds)';
        } else if (card.querySelector('.net-tag')) {
            return 'var(--brand-net)';
        } else if (card.querySelector('.js-tag')) {
            return 'var(--brand-spread)';
        } else if (card.querySelector('.ar-tag') || card.querySelector('.reporting-tag')) {
            return 'var(--brand-ar)';
        } else if (card.querySelector('.ds-tag')) {
            return 'var(--brand-ds)';
        } else if (card.querySelector('.blazor-tag')) {
            return '#512BD4';
        }
        return 'var(--brand-header)';
    };

    // Helper function for consistent currency formatting
    const formatCurrency = (value) => {
        return `€${Math.round(value).toLocaleString('de-DE')}`;
    };

    // Discount Calculator Logic for Bundles
    const discountCards = document.querySelectorAll('.bundle-card[data-base-price]');

    discountCards.forEach(card => {
        const cardId = card.id.replace('card-', '');
        const productId = card.dataset.productId;
        const basePrice = parseFloat(card.dataset.basePrice);
        const listPrice = parseFloat(card.dataset.listPrice);
        const quantityInput = card.querySelector('.quantity-input');
        const yearRadios = card.querySelectorAll(`input[type="radio"][name="years-${cardId}"]`); 
        const priceEl = card.querySelector(`#price-${cardId}`);
        const savingsEl = card.querySelector(`#savings-${cardId}`);
        const ctaButton = card.querySelector(`#cta-${cardId}`);

        const priceSummaryContainer = card.querySelector(`#price-summary-${cardId}`);
        const totalActualCostEl = priceSummaryContainer ? priceSummaryContainer.querySelector('.total-actual-cost') : null;
        const totalPriceSubtleEl = priceSummaryContainer ? priceSummaryContainer.querySelector('.total-price-subtle') : null;
        const discountPerDevEl = priceEl ? priceEl.querySelector('.discount-per-dev') : null;

        const totalListValueElement = card.querySelector(`#total-list-value-${cardId}`);
        const inclusionItems = card.querySelectorAll('.inclusions-list li:not(.total-value)');

        let previousVolumeDiscountPercentage = 0;
        let previousYearsSelected = 1;
        let previousQuantity = 1;

        if (!quantityInput || !yearRadios.length || !priceEl || !ctaButton || !totalPriceSubtleEl || !totalListValueElement || !totalActualCostEl || !priceSummaryContainer || !discountPerDevEl) {
            console.warn(`Missing elements for pricing card with product ID: ${productId}. Skipping calculator for this card.`);
            return;
        }

        // Initialize original names and prices for inclusion items on first load
        inclusionItems.forEach(item => {
            const itemNameSpan = item.querySelector('span:first-child');
            const itemPriceSpan = item.querySelector('span:last-child');
            
            // Store the original component name cleanly
            item.dataset.originalName = itemNameSpan.textContent.trim();
            
            // Store the original single-unit price
            if (!item.dataset.originalPrice) {
                item.dataset.originalPrice = parseFloat(itemPriceSpan.textContent.replace(/[^0-9,-]+/g, '').replace(',', '.'));
            }
        });

        // Add stepper button functionality for volume control
        const stepperButtons = card.querySelectorAll('.quantity-btn');
        stepperButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const currentValue = parseInt(quantityInput.value) || 1;
                
                if (action === 'increase') {
                    quantityInput.value = currentValue + 1;
                } else if (action === 'decrease' && currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
                
                // Update button states
                const decreaseBtn = card.querySelector('.quantity-btn[data-action="decrease"]');
                const newValue = parseInt(quantityInput.value);
                decreaseBtn.disabled = newValue <= 1;
                
                // Trigger recalculation
                recalculate(true);
            });
        });

        // Update stepper button states initially
        const decreaseBtn = card.querySelector('.quantity-btn[data-action="decrease"]');
        decreaseBtn.disabled = parseInt(quantityInput.value) <= 1;

        const recalculate = (isUserInteraction) => {
            const quantity = parseInt(quantityInput.value) || 1;
            const selectedYearRadio = card.querySelector(`input[type="radio"][name="years-${cardId}"]:checked`);
            const years = parseInt(selectedYearRadio ? selectedYearRadio.value : '1');

            let currentVolumeDiscountPercentage = 0;
            if (quantity >= 10) {
                currentVolumeDiscountPercentage = 0.10;
            } else if (quantity >= 5) {
                currentVolumeDiscountPercentage = 0.05;
            }

            let yearDiscount = 0;
            if (years === 2) {
                yearDiscount = 0.10;
            } else if (years === 3) {
                yearDiscount = 0.15;
            }

            const priceAfterVolumePerDev = basePrice * (1 - currentVolumeDiscountPercentage);
            const finalPricePerDev = priceAfterVolumePerDev * (1 - yearDiscount);
            
            const discountPerDevAmount = basePrice - finalPricePerDev;
            
            const totalActualCost = finalPricePerDev * quantity;
            const totalCurrentPriceForYears = totalActualCost * years; // Total cost includes both quantity and years
            
            // Calculate total list price for the current quantity and years
            let currentTotalListPriceRaw = 0;
            inclusionItems.forEach(item => {
                const originalItemPrice = parseFloat(item.dataset.originalPrice);
                if (!isNaN(originalItemPrice)) {
                    currentTotalListPriceRaw += originalItemPrice;
                }
            });
            currentTotalListPriceRaw = currentTotalListPriceRaw * quantity * years; // Total list price also includes both quantity and years

            const totalSavingsAmount = currentTotalListPriceRaw - totalCurrentPriceForYears;

            priceEl.innerHTML = `${formatCurrency(finalPricePerDev)}<span class="price-term">per developer / year</span>`;
            
            // Only show the small per-dev discount as a subtle note, not the large text
            if (discountPerDevAmount > 0) {
                discountPerDevEl.textContent = `Save ${formatCurrency(discountPerDevAmount)} per dev`;
                discountPerDevEl.style.display = 'block';
            } else {
                discountPerDevEl.style.display = 'none';
            }
            priceEl.appendChild(discountPerDevEl);

            totalActualCostEl.innerHTML = `Total Cost: <strong>${formatCurrency(totalActualCost)}</strong> (for ${quantity} dev${quantity > 1 ? 's' : ''})`;
            totalPriceSubtleEl.innerHTML = `Grand Total: <strong>${formatCurrency(totalCurrentPriceForYears)}</strong> (for ${years} year${years > 1 ? 's' : ''})`;
            
            if(savingsEl) {
                savingsEl.textContent = `Save ${formatCurrency(totalSavingsAmount)}`;
            }

            // Update individual component names and prices
            inclusionItems.forEach(item => {
                const originalItemName = item.dataset.originalName;
                const originalItemPrice = parseFloat(item.dataset.originalPrice);
                const itemNameSpan = item.querySelector('span:first-child');
                const itemPriceSpan = item.querySelector('span:last-child');

                if (isNaN(originalItemPrice) || originalItemPrice === 0) { 
                    itemNameSpan.textContent = originalItemName; 
                    itemPriceSpan.textContent = `€0,00`; 
                } else {
                    // CRUCIAL: Multiplied price now also accounts for years
                    const multipliedPrice = originalItemPrice * quantity * years; 
                    
                    // Update the text content of the name span with the multiplier
                    if (quantity > 1) {
                        itemNameSpan.textContent = `${quantity}x ${originalItemName}`;
                    } else {
                        itemNameSpan.textContent = originalItemName;
                    }
                    
                    // Always update the price span with the calculated multiplied price
                    itemPriceSpan.textContent = formatCurrency(multipliedPrice);
                }
            });
            // Update total list value with quantity and years
            totalListValueElement.innerHTML = `<del>${formatCurrency(currentTotalListPriceRaw)}</del>`;

            const volumeDiscountChanged = currentVolumeDiscountPercentage !== previousVolumeDiscountPercentage;
            const yearsChanged = years !== previousYearsSelected;
            
            const quantityCrossedThreshold = (previousQuantity < 5 && quantity >= 5) ||
                                            (previousQuantity >= 5 && quantity < 5) ||
                                            (previousQuantity < 10 && quantity >= 10) ||
                                            (previousQuantity >= 10 && quantity < 10);

            if (isUserInteraction && (volumeDiscountChanged || yearsChanged || quantityCrossedThreshold || (discountPerDevAmount > 0 && priceEl.classList.contains('price-updated')))) {
                priceEl.classList.add('price-updated');
                discountPerDevEl.classList.add('price-updated');
                totalActualCostEl.classList.add('price-updated'); 
                totalPriceSubtleEl.classList.add('price-updated'); 
                totalListValueElement.classList.add('price-updated');
                if (savingsEl) savingsEl.classList.add('savings-updated');

                setTimeout(() => {
                    priceEl.classList.remove('price-updated');
                    discountPerDevEl.classList.remove('price-updated');
                    totalActualCostEl.classList.remove('price-updated'); 
                    totalPriceSubtleEl.classList.remove('price-updated'); 
                    totalListValueElement.classList.remove('price-updated');
                    if (savingsEl) savingsEl.classList.remove('savings-updated');
                }, 300); // Reduced from 600ms to match new animation duration
            }
            
            previousVolumeDiscountPercentage = currentVolumeDiscountPercentage;
            previousYearsSelected = years;
            previousQuantity = quantity; 

            // CORRECTED LOGIC FOR CONTACT SALES / BUY NOW BUTTON
            if (years > 1) { // Only contact sales if term is greater than 1 year
                ctaButton.textContent = 'Contact Sales';
                const subject = encodeURIComponent(`Inquiry for ${years}-Year Subscription, ${quantity} Licenses: ${card.querySelector('.card-title').textContent.trim()} (Product ID: ${productId})`);
                ctaButton.href = `mailto:eu.sales@mescius.com?subject=${subject}`;
                ctaButton.classList.add('contact-sales'); 
                ctaButton.style.backgroundColor = getCardAccentColor(card); 
                ctaButton.style.color = 'white'; 
            } else { // Otherwise, it's always "Buy Now" for 1-year term (regardless of quantity)
                ctaButton.textContent = 'Buy Now';
                const baseURL = 'https://checkout.mescius.eu/1878/purl-shop';
                const cartString = `cart=i${productId}`;
                const quantityString = `quantity_i${productId}=${quantity}`;
                ctaButton.href = `${baseURL}?${cartString}&${quantityString}`;
                ctaButton.classList.remove('contact-sales'); 

                // Set background color for 'Buy Now' buttons based on card type
                ctaButton.style.backgroundColor = getCardAccentColor(card);
                ctaButton.style.color = 'white'; 
            }
        };

        // Event listeners
        quantityInput.addEventListener('input', () => recalculate(true));
        yearRadios.forEach(radio => radio.addEventListener('change', () => recalculate(true)));
        
        // Initial recalculation on page load
        recalculate(false); 
    });

    // Mailto links for Custom Pricing Cards (non-calculator)
    document.querySelectorAll('.pricing-card:not([data-base-price]) .cta-button').forEach(button => {
        const card = button.closest('.pricing-card');
        const cardTitle = card.querySelector('.card-title').textContent.trim();
        const subject = encodeURIComponent(`Inquiry about ${cardTitle}`);
        button.href = `mailto:eu.sales@mescius.com?subject=${subject}`;
        
        // Set background color for these buttons based on their highlight class or product tag
        const cardAccentColor = getCardAccentColor(card);
        button.style.backgroundColor = cardAccentColor;
        button.style.color = 'white'; 
    });

    // =========================================================
    // UNIVERSAL FEATURES FOR ALL PAGES
    // =========================================================

    /**
     * Fade-in Sections on Scroll
     */
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Smooth Scrolling for Anchor Links
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================
    // BLUEPRINT PAGES: DYNAMIC THEMING
    // =========================================================
    
    const applyBlueprintTheming = () => {
        // Only apply theming on blueprint pages
        if (!window.location.pathname.includes('/blueprints/')) return;
        
        const body = document.body;
        const pageContent = document.documentElement.innerHTML.toLowerCase();
        
        // Define product detection patterns
        const productPatterns = {
            'wijmo': /wijmo|flexgrid/,
            'js': /spreadjs|spread js/,
            'net': /componentone|\.net suite/,
            'arjs': /activereports|active reports/,
            'ds': /document solutions|docio|gcpdf/
        };
        
        // Detect primary product based on content frequency
        let productScores = {};
        let detectedProduct = 'wijmo'; // default fallback
        
        for (const [product, pattern] of Object.entries(productPatterns)) {
            const matches = pageContent.match(pattern) || [];
            productScores[product] = matches.length;
        }
        
        // Find the product with the highest score
        const maxScore = Math.max(...Object.values(productScores));
        if (maxScore > 0) {
            detectedProduct = Object.keys(productScores).find(key => productScores[key] === maxScore);
        }
        
        // Apply the theme by setting CSS custom properties
        const root = document.documentElement;
        
        switch (detectedProduct) {
            case 'wijmo':
                root.style.setProperty('--accent-color', 'var(--brand-wijmo)');
                body.classList.add('theme-wijmo');
                break;
            case 'js':
                root.style.setProperty('--accent-color', 'var(--brand-js)');
                body.classList.add('theme-js');
                break;
            case 'net':
                root.style.setProperty('--accent-color', 'var(--brand-net)');
                body.classList.add('theme-net');
                break;
            case 'arjs':
                root.style.setProperty('--accent-color', 'var(--brand-arjs)');
                body.classList.add('theme-arjs');
                break;
            case 'ds':
                root.style.setProperty('--accent-color', 'var(--brand-ds)');
                body.classList.add('theme-ds');
                break;
        }
    };
    
    // Apply theming on page load
    applyBlueprintTheming();
    
    // =========================================================
    // BLUEPRINT PAGES: METRIC ANIMATION
    // =========================================================
    
    const metricItems = document.querySelectorAll('.metric-item');
    if (metricItems.length > 0) {
        const animateMetrics = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const valueSpan = entry.target.querySelector('.metric-value');
                    const targetValue = valueSpan.dataset.target; // Get as string
                    
                    // Validate targetValue exists
                    if (!targetValue) {
                        console.warn('No target value found for metric animation');
                        return;
                    }
                    
                    let currentValue = 0;
                    const duration = 1500; // ms
                    const startTime = performance.now();

                    const updateCount = (timestamp) => {
                        const progress = (timestamp - startTime) / duration;
                        if (progress < 1) {
                            if (targetValue.includes('k')) { // Handle 'k' for thousands
                                // Check if it has a currency symbol
                                const currencyMatch = targetValue.match(/^([€$£¥])/);
                                const currencySymbol = currencyMatch ? currencyMatch[1] : '';
                                const numericPart = targetValue.replace(/[€$£¥]/, '').replace('k', '');
                                const numericTarget = parseFloat(numericPart);
                                if (isNaN(numericTarget)) {
                                    valueSpan.textContent = targetValue;
                                    return;
                                }
                                const targetNum = numericTarget * 1000;
                                currentValue = Math.min(targetNum, Math.floor(progress * targetNum));
                                valueSpan.textContent = currencySymbol + (currentValue / 1000).toFixed(0) + 'k';
                            } else if (targetValue.includes('%')) { // Handle '%'
                                const numericTarget = parseInt(targetValue.replace('%', ''));
                                if (isNaN(numericTarget)) {
                                    valueSpan.textContent = targetValue;
                                    return;
                                }
                                currentValue = Math.min(numericTarget, Math.floor(progress * numericTarget));
                                valueSpan.textContent = currentValue + '%';
                            } else if (targetValue.includes('<')) { // Handle '<' for "less than"
                                // Extract the number after '<' - e.g., "<8" becomes 8
                                const numericPart = targetValue.replace('<', '');
                                const numericTarget = parseInt(numericPart);
                                if (isNaN(numericTarget)) {
                                    valueSpan.textContent = targetValue;
                                    return;
                                }
                                // Animate to the number minus 1, then show final value
                                const animateTarget = Math.max(1, numericTarget - 1);
                                currentValue = Math.min(animateTarget, Math.floor(progress * animateTarget));
                                valueSpan.textContent = progress < 0.9 ? currentValue : targetValue;
                            } else { // Assume integer if no special chars
                                const numericTarget = parseInt(targetValue);
                                if (isNaN(numericTarget)) {
                                    valueSpan.textContent = targetValue;
                                    return;
                                }
                                currentValue = Math.min(numericTarget, Math.floor(progress * numericTarget));
                                valueSpan.textContent = currentValue;
                            }
                            requestAnimationFrame(updateCount);
                        } else {
                            // Ensure final value is accurate
                            valueSpan.textContent = targetValue;
                        }
                    };
                    requestAnimationFrame(updateCount);
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        };

        const metricObserver = new IntersectionObserver(animateMetrics, {
            root: null, // viewport
            threshold: 0.5 // Trigger when 50% of the item is visible
        });

        metricItems.forEach(item => {
            metricObserver.observe(item);
        });
    }

    // =========================================================
    // BLUEPRINT PAGES: PRODUCT INFO MODALS
    // =========================================================
    
    const productModalOverlay = document.getElementById('product-info-modal');
    if (productModalOverlay) {
        const modalBody = document.getElementById('modal-body-content');
        const modalCloseBtn = document.getElementById('modal-close');
        const infoTriggers = document.querySelectorAll('.product-info-trigger');

        const openModal = (productId) => {
            const template = document.getElementById(`${productId}-modal-content`);
            if (template) {
                modalBody.innerHTML = ''; // Clear previous content
                modalBody.appendChild(template.content.cloneNode(true));
                
                // Apply product-specific theming
                const modalContainer = productModalOverlay.querySelector('.modal-container');
                if (modalContainer) {
                    // Remove any existing product classes
                    modalContainer.classList.remove('product-componentone', 'product-wijmo', 'product-activereports', 'product-spread', 'product-ds');
                    
                    // Add the appropriate product class based on productId
                    if (productId.includes('componentone-studio')) {
                        modalContainer.classList.add('product-componentone');
                    } else if (productId.includes('wijmo')) {
                        modalContainer.classList.add('product-wijmo');
                    } else if (productId.includes('activereports')) {
                        modalContainer.classList.add('product-activereports');
                    } else if (productId.includes('spread')) {
                        modalContainer.classList.add('product-spread');
                    } else if (productId.includes('ds') || productId.includes('document')) {
                        modalContainer.classList.add('product-ds');
                    }
                }
                
                productModalOverlay.style.display = 'flex';
            } else {
                console.error(`Template for product ID "${productId}" not found.`);
            }
        };
        
        const closeModal = () => {
            productModalOverlay.style.display = 'none';
            modalBody.innerHTML = ''; // Clear content when closing
            
            // Remove product classes when closing
            const modalContainer = productModalOverlay.querySelector('.modal-container');
            if (modalContainer) {
                modalContainer.classList.remove('product-componentone', 'product-wijmo', 'product-activereports', 'product-spread', 'product-ds');
            }
        };

        infoTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault(); 
                const productId = trigger.dataset.productId;
                if (productId) {
                    openModal(productId);
                }
            });
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }
        
        productModalOverlay.addEventListener('click', (e) => {
            if (e.target === productModalOverlay) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && productModalOverlay.style.display === 'flex') closeModal();
        });
    }
});