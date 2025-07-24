/**
 * Solutions Page JavaScript
 * Handles case study filtering and interactions
 */

// Initialize solutions page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingFilter();
    initializeIntersectionObserver();
    initializeCaseStudyCards();
});

/**
 * Initialize floating filter system
 */
function initializeFloatingFilter() {
    if (typeof FloatingFilter !== 'undefined') {
        const filterConfig = {
            containerId: 'floating-filter',
            targetGridId: 'case-study-grid',
            filters: [
                {
                    type: 'industry',
                    title: 'Industry',
                    icon: 'fas fa-building',
                    options: [
                        { value: 'all', label: 'All Industries', icon: 'fas fa-globe' },
                        { value: 'finance', label: 'Finance', icon: 'fas fa-chart-line' },
                        { value: 'logistics', label: 'Logistics', icon: 'fas fa-truck' },
                        { value: 'healthcare', label: 'Healthcare', icon: 'fas fa-heartbeat' },
                        { value: 'energy', label: 'Energy', icon: 'fas fa-bolt' },
                        { value: 'insurance', label: 'Insurance', icon: 'fas fa-shield-alt' },
                        { value: 'bi', label: 'BI SaaS', icon: 'fas fa-chart-bar' }
                    ]
                },
                {
                    type: 'product',
                    title: 'Technology Stack',
                    icon: 'fas fa-code',
                    options: [
                        { value: 'all', label: 'All Technologies', icon: 'fas fa-layer-group' },
                        { value: 'net', label: '.NET Suite', icon: 'fab fa-microsoft' },
                        { value: 'js', label: 'SpreadJS', icon: 'fab fa-js-square' },
                        { value: 'wijmo', label: 'Wijmo', icon: 'fas fa-chart-area' },
                        { value: 'arjs', label: 'ActiveReports', icon: 'fas fa-file-alt' },
                        { value: 'ds', label: 'Document Solutions', icon: 'fas fa-file-pdf' }
                    ]
                }
            ],
            onFilterChange: handleFilterChange
        };
        
        new FloatingFilter(filterConfig);
        console.log('Floating filter initialized for solutions page');
    } else {
        console.warn('FloatingFilter class not loaded. Please include floating-filter.js');
    }
}

/**
 * Handle filter changes from floating filter
 */
function handleFilterChange(activeFilters) {
    const items = document.querySelectorAll('.case-study-card');
    let visibleCount = 0;
    
    items.forEach(item => {
        let shouldShow = true;
        
        // Check each active filter
        Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
            if (filterValue !== 'all') {
                const itemValue = item.getAttribute(`data-${filterType}`);
                if (itemValue !== filterValue) {
                    shouldShow = false;
                }
            }
        });
        
        if (shouldShow) {
            item.style.display = '';
            item.classList.remove('filtered-out');
            visibleCount++;
        } else {
            item.style.display = 'none';
            item.classList.add('filtered-out');
        }
    });
    
    // Show/hide no results message
    updateNoResultsMessage(visibleCount === 0, activeFilters);
    
    // Animate visible items
    animateFilterResults();
}

/**
 * Update no results message
 */
    function updateNoResultsMessage() {
        const visibleCards = document.querySelectorAll('.case-study-card:not([style*="display: none"])');
        const noResultsMessage = document.getElementById('no-results-message');
        const activeFilters = document.querySelectorAll('.floating-filter .filter-option.active');
        
        if (visibleCards.length === 0 && activeFilters.length > 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    // Clear filters functionality
    document.addEventListener('click', function(e) {
        if (e.target.matches('#clear-filters-btn, .clear-filters-link')) {
            if (floatingFilterInstance) {
                // Clear all active filters
                const activeFilters = document.querySelectorAll('.floating-filter .filter-option.active');
                activeFilters.forEach(filter => {
                    filter.classList.remove('active');
                });
                
                // Show all cards
                const allCards = document.querySelectorAll('.case-study-card');
                allCards.forEach(card => {
                    card.style.display = 'block';
                });
                
                // Hide no results message
                document.getElementById('no-results-message').style.display = 'none';
            }
        }
    });

/**
 * Animate filter results
 */
function animateFilterResults() {
    const visibleItems = document.querySelectorAll('.case-study-card:not([style*="display: none"])');
    
    visibleItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**

/**
 * Initialize search filter functionality
 */
function initializeSearchFilter() {
    const searchInput = document.querySelector('.solutions-search-input, .case-study-search');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                performSearch(this.value.trim());
            }, 300);
        });

        // Clear search
        const clearSearchBtn = document.querySelector('.clear-search-btn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                performSearch('');
            });
        }
    }
}

/**
 * Perform search filtering
 */
function performSearch(searchTerm) {
    const searchableItems = document.querySelectorAll('.case-study-card, .solution-card');
    let visibleCount = 0;

    searchableItems.forEach(item => {
        const searchableText = getSearchableText(item);
        const matches = searchTerm === '' || 
                       searchableText.toLowerCase().includes(searchTerm.toLowerCase());

        if (matches) {
            item.style.display = '';
            item.classList.remove('search-hidden');
            visibleCount++;
        } else {
            item.style.display = 'none';
            item.classList.add('search-hidden');
        }
    });

    // Update search results indicator
    updateSearchResultsIndicator(searchTerm, visibleCount, searchableItems.length);

    // Animate results
    animateSearchResults();
}

/**
 * Get searchable text from a case study item
 */
function getSearchableText(item) {
    const title = item.querySelector('.card-title, .case-study-title')?.textContent || '';
    const description = item.querySelector('.card-description, .case-study-description')?.textContent || '';
    const industry = item.getAttribute('data-industry') || '';
    const product = item.getAttribute('data-product') || '';
    const tags = item.getAttribute('data-tags') || '';
    
    return `${title} ${description} ${industry} ${product} ${tags}`.trim();
}

/**
 * Update search results indicator
 */
function updateSearchResultsIndicator(searchTerm, visibleCount, totalCount) {
    let indicator = document.querySelector('.search-results-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'search-results-indicator';
        
        const container = document.querySelector('.case-studies-grid, .solutions-grid');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(indicator, container);
        }
    }

    if (searchTerm) {
        indicator.innerHTML = `
            <p>Showing ${visibleCount} of ${totalCount} results for "<strong>${escapeHtml(searchTerm)}</strong>"</p>
            ${visibleCount === 0 ? '<p class="no-results">No case studies match your search. Try different keywords.</p>' : ''}
        `;
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

/**
 * Animate search results
 */
function animateSearchResults() {
    const visibleItems = document.querySelectorAll('.case-study-card:not([style*="display: none"]), .solution-card:not([style*="display: none"])');
    
    visibleItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**
 * Update filter metrics display
 */
function updateFilterMetrics(filterData) {
    const metricsElement = document.querySelector('.filter-metrics');
    
    if (metricsElement) {
        const { visibleCount, totalCount, activeFilters } = filterData;
        const filterCount = Object.keys(activeFilters).length;
        
        let metricsText = `Showing ${visibleCount} of ${totalCount} case studies`;
        
        if (filterCount > 0) {
            metricsText += ` with ${filterCount} filter${filterCount > 1 ? 's' : ''} applied`;
        }
        
        metricsElement.textContent = metricsText;
    }
}

/**
 * Track filter usage for analytics
 */
function trackFilterUsage(filterType, filterValue) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'filter_used', {
            'filter_type': filterType,
            'filter_value': filterValue,
            'page_location': window.location.href
        });
    }
    
    console.log(`Filter used: ${filterType} = ${filterValue}`);
}

/**
 * Initialize intersection observer for scroll animations
 */
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe case study cards and other animatable elements
    const animateElements = document.querySelectorAll(
        '.case-study-card, .solution-card, .scroll-animate, .hero-content, .section-header'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize case study card interactions
 */
function initializeCaseStudyCards() {
    const cards = document.querySelectorAll('.case-study-card');
    
    cards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });

        // Handle card clicks
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link or button
            if (e.target.closest('a, button')) return;
            
            const link = this.querySelector('.case-study-link, .solution-link, .card-title a');
            if (link) {
                link.click();
            }
        });

        // Add keyboard navigation
        if (card.querySelector('.case-study-link, .solution-link, .card-title a')) {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = this.querySelector('.case-study-link, .solution-link, .card-title a');
                    if (link) {
                        link.click();
                    }
                }
            });
        }
    });
}

/**
 * Initialize featured solutions carousel if present
 */
function initializeFeaturedCarousel() {
    const carousel = document.querySelector('.featured-solutions-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;

        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Update button states
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                goToSlide(0); // Loop back to start
            }
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start auto-play and pause on hover
    startAutoPlay();
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Initial update
    updateCarousel();
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
 * Initialize all solutions page functionality
 */
function initializeAllSolutionsFeatures() {
    initializeCaseStudyCards();
    initializeFeaturedCarousel();
}

// Initialize additional features after DOM load
document.addEventListener('DOMContentLoaded', initializeAllSolutionsFeatures);

// Export functions for global use
window.SolutionsPage = {
    performSearch,
    trackFilterUsage
};