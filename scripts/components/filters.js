/**
 * Reusable Filter Component
 * Handles filtering functionality across different pages
 */

class FilterSystem {
    constructor(config) {
        this.config = {
            filterContainer: config.filterContainer || '.filter-toolbar',
            itemsContainer: config.itemsContainer || '.filterable-items',
            itemSelector: config.itemSelector || '.filterable-item',
            appliedFiltersContainer: config.appliedFiltersContainer || '.applied-filters-container',
            noResultsSelector: config.noResultsSelector || '.no-results-message',
            animationDuration: config.animationDuration || 300,
            ...config
        };
        
        this.activeFilters = {};
        this.filterButtons = [];
        this.filterableItems = [];
        
        this.init();
    }

    init() {
        this.findElements();
        this.setupEventListeners();
        this.updateUI();
    }

    findElements() {
        this.filterContainer = document.querySelector(this.config.filterContainer);
        this.itemsContainer = document.querySelector(this.config.itemsContainer);
        this.appliedFiltersContainer = document.querySelector(this.config.appliedFiltersContainer);
        this.noResultsElement = document.querySelector(this.config.noResultsSelector);
        
        if (this.filterContainer) {
            this.filterButtons = Array.from(this.filterContainer.querySelectorAll('[data-filter]'));
        }
        
        if (this.itemsContainer) {
            this.filterableItems = Array.from(this.itemsContainer.querySelectorAll(this.config.itemSelector));
        }
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e);
            });
        });

        // Clear all filters button
        const clearButton = document.querySelector('[data-action="clear-filters"]');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    handleFilterClick(event) {
        const button = event.target.closest('[data-filter]');
        if (!button) return;

        const filterType = button.getAttribute('data-filter');
        const filterValue = button.getAttribute('data-value') || 
                          button.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Toggle filter
        if (filterValue === 'all') {
            // Clear this filter type
            delete this.activeFilters[filterType];
        } else {
            // Set filter value
            this.activeFilters[filterType] = filterValue;
        }

        this.updateUI();
        this.applyFilters();
        this.updateURL();
    }

    updateUI() {
        this.updateFilterButtons();
        this.updateAppliedFilters();
        this.updateFilterCounts();
    }

    updateFilterButtons() {
        this.filterButtons.forEach(button => {
            const filterType = button.getAttribute('data-filter');
            const filterValue = button.getAttribute('data-value') || 
                              button.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');

            const isActive = this.activeFilters[filterType] === filterValue ||
                           (filterValue === 'all' && !this.activeFilters[filterType]);

            button.classList.toggle('active', isActive);
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', isActive);
        });
    }

    updateAppliedFilters() {
        if (!this.appliedFiltersContainer) return;

        const appliedFiltersHTML = [];
        
        Object.entries(this.activeFilters).forEach(([type, value]) => {
            const displayName = this.formatFilterDisplayName(value);
            appliedFiltersHTML.push(`
                <span class="applied-filter" data-filter-type="${type}" data-filter-value="${value}">
                    ${displayName}
                    <button class="remove-filter" aria-label="Remove ${displayName} filter" data-filter-type="${type}">×</button>
                </span>
            `);
        });

        this.appliedFiltersContainer.innerHTML = appliedFiltersHTML.join('');
        this.appliedFiltersContainer.style.display = appliedFiltersHTML.length > 0 ? 'block' : 'none';

        // Add event listeners for remove buttons
        this.appliedFiltersContainer.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.getAttribute('data-filter-type');
                delete this.activeFilters[filterType];
                this.updateUI();
                this.applyFilters();
                this.updateURL();
            });
        });
    }

    updateFilterCounts() {
        this.filterButtons.forEach(button => {
            const filterType = button.getAttribute('data-filter');
            const filterValue = button.getAttribute('data-value') || 
                              button.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');

            if (filterValue === 'all') return;

            // Count matching items
            let count = 0;
            this.filterableItems.forEach(item => {
                const itemAttributes = this.getItemFilterAttributes(item);
                if (itemAttributes[filterType] === filterValue) {
                    count++;
                }
            });

            // Update or add count display
            let countElement = button.querySelector('.filter-count');
            if (count > 0) {
                if (!countElement) {
                    countElement = document.createElement('span');
                    countElement.className = 'filter-count';
                    button.appendChild(countElement);
                }
                countElement.textContent = `(${count})`;
            } else if (countElement) {
                countElement.remove();
            }
        });
    }

    applyFilters() {
        let visibleCount = 0;

        this.filterableItems.forEach(item => {
            const shouldShow = this.shouldShowItem(item);
            
            if (shouldShow) {
                this.showItem(item);
                visibleCount++;
            } else {
                this.hideItem(item);
            }
        });

        this.updateNoResultsState(visibleCount === 0);
        this.animateFilterTransitions();
        
        // Trigger custom event
        this.triggerFilterEvent(visibleCount);
    }

    shouldShowItem(item) {
        const itemAttributes = this.getItemFilterAttributes(item);
        
        return Object.entries(this.activeFilters).every(([filterType, filterValue]) => {
            return itemAttributes[filterType] === filterValue;
        });
    }

    getItemFilterAttributes(item) {
        const attributes = {};
        
        // Get all data attributes that might be filters
        Object.keys(item.dataset).forEach(key => {
            if (key !== 'filterable') {
                attributes[key.replace(/([A-Z])/g, '-$1').toLowerCase()] = item.dataset[key];
            }
        });

        return attributes;
    }

    showItem(item) {
        item.style.display = '';
        item.classList.remove('filtered-out');
        item.classList.add('filtered-in');
    }

    hideItem(item) {
        item.style.display = 'none';
        item.classList.add('filtered-out');
        item.classList.remove('filtered-in');
    }

    updateNoResultsState(show) {
        if (this.noResultsElement) {
            this.noResultsElement.style.display = show ? 'block' : 'none';
        }
    }

    animateFilterTransitions() {
        this.filterableItems.forEach(item => {
            if (item.style.display !== 'none') {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    item.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            }
        });
    }

    clearAllFilters() {
        this.activeFilters = {};
        this.updateUI();
        this.applyFilters();
        this.updateURL();
    }

    formatFilterDisplayName(value) {
        return value.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    updateURL() {
        if (!window.history || !window.history.replaceState) return;

        const url = new URL(window.location);
        
        // Clear existing filter parameters
        Array.from(url.searchParams.keys()).forEach(key => {
            if (key.startsWith('filter-')) {
                url.searchParams.delete(key);
            }
        });

        // Add current filters
        Object.entries(this.activeFilters).forEach(([type, value]) => {
            url.searchParams.set(`filter-${type}`, value);
        });

        window.history.replaceState({}, '', url);
    }

    loadFiltersFromURL() {
        const url = new URL(window.location);
        
        url.searchParams.forEach((value, key) => {
            if (key.startsWith('filter-')) {
                const filterType = key.replace('filter-', '');
                this.activeFilters[filterType] = value;
            }
        });

        this.updateUI();
        this.applyFilters();
    }

    triggerFilterEvent(visibleCount) {
        const event = new CustomEvent('filtersApplied', {
            detail: {
                activeFilters: this.activeFilters,
                visibleCount: visibleCount,
                totalCount: this.filterableItems.length
            }
        });
        
        document.dispatchEvent(event);
    }

    // Public API methods
    setFilter(filterType, filterValue) {
        if (filterValue === 'all' || filterValue === null) {
            delete this.activeFilters[filterType];
        } else {
            this.activeFilters[filterType] = filterValue;
        }
        
        this.updateUI();
        this.applyFilters();
        this.updateURL();
    }

    getActiveFilters() {
        return { ...this.activeFilters };
    }

    getVisibleItems() {
        return this.filterableItems.filter(item => item.style.display !== 'none');
    }

    refresh() {
        this.findElements();
        this.updateUI();
        this.applyFilters();
    }

    destroy() {
        // Remove event listeners and clean up
        this.filterButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        if (this.appliedFiltersContainer) {
            this.appliedFiltersContainer.innerHTML = '';
        }
    }
}

// Convenience function for creating filter systems
function createFilterSystem(config) {
    return new FilterSystem(config);
}

// Export for use in other scripts
window.FilterSystem = FilterSystem;
window.createFilterSystem = createFilterSystem;