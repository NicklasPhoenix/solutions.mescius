// Global JavaScript for solutions.mescius.eu

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Feature 1: Responsive Mobile Navigation
     */
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
        });
    }

    /**
     * Feature 2: Expandable Case Study Card (for detail pages)
     */
    const expandableCard = document.getElementById('expandable-card');
    const cardToggle = document.getElementById('card-toggle');

    if (expandableCard && cardToggle) {
        cardToggle.addEventListener('click', () => {
            const isOpening = !expandableCard.classList.contains('is-open');
            expandableCard.classList.toggle('is-open');
            cardToggle.setAttribute('aria-expanded', isOpening);
            const toggleText = cardToggle.querySelector('.toggle-text');
            if (isOpening) {
                toggleText.textContent = 'Hide Full Case Study';
            } else {
                toggleText.textContent = 'Read Full Case Study';
            }
        });
    }

    /**
     * NEW Feature 3: Case Study Grid Filtering (for main page)
     */
    const filterControls = document.getElementById('filter-controls');
    const caseStudyCards = document.querySelectorAll('#case-study-grid .case-study-card');
    const noResultsMessage = document.getElementById('no-results-message');

    if (filterControls && caseStudyCards.length > 0) {
        let currentFilters = {
            industry: 'all',
            product: 'all'
        };

        filterControls.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            const filterGroup = btn.dataset.filterGroup;
            const filterValue = btn.dataset.filter;

            currentFilters[filterGroup] = filterValue;

            document.querySelectorAll(`.filter-btn[data-filter-group="${filterGroup}"]`).forEach(b => {
                b.classList.remove('is-active');
            });
            btn.classList.add('is-active');

            let visibleCount = 0;
            caseStudyCards.forEach(card => {
                const industryMatch = currentFilters.industry === 'all' || card.dataset.industry.includes(currentFilters.industry);
                const productMatch = currentFilters.product === 'all' || card.dataset.product.includes(currentFilters.product);

                if (industryMatch && productMatch) {
                    card.classList.remove('is-hidden');
                    visibleCount++;
                } else {
                    card.classList.add('is-hidden');
                }
            });

            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }


    /**
     * Feature 4: Fade-in Sections on Scroll
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
     * Feature 5: Smooth Scrolling for Anchor Links
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

    console.log('Modern JavaScript features loaded. Site is ready.');

    /**
     * Feature 6: Blueprint Link Handler (Production Fallback)
     * Ensures blueprint cards work correctly on production servers
     */
    const blueprintCards = document.querySelectorAll('.case-study-card[href*="/blueprints/"]');
    if (blueprintCards.length > 0) {
        blueprintCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Ensure we're using clean URLs
                if (href && href.includes('/blueprints/') && !href.endsWith('.html')) {
                    // Force navigation to the clean URL
                    e.preventDefault();
                    window.location.href = href;
                }
            });
        });
    }

    /**
     * Directory Index Fallback Handler
     * Handles cases where the server doesn't automatically serve index.html for directories
     */
    function handleDirectoryIndexFallback() {
        // Add click handlers to navigation and blueprint links
        const navigationLinks = document.querySelectorAll('a[href^="/"]');
        
        navigationLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip external links and anchors
            if (href.startsWith('http') || href.startsWith('#')) return;
            
            link.addEventListener('click', function(e) {
                const targetPath = this.getAttribute('href');
                
                // If it's a directory path (ends with /), add fallback behavior
                if (targetPath.endsWith('/') && targetPath !== '/') {
                    e.preventDefault();
                    
                    // Try the clean URL first
                    fetch(targetPath, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                // Clean URL works, navigate normally
                                window.location.href = targetPath;
                            } else {
                                // Clean URL doesn't work, try with index.html
                                window.location.href = targetPath + 'index.html';
                            }
                        })
                        .catch(() => {
                            // If fetch fails, try with index.html as fallback
                            window.location.href = targetPath + 'index.html';
                        });
                }
            });
        });
    }

    // Initialize the fallback handler
    handleDirectoryIndexFallback();
});