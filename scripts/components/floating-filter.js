/**
 * Floating Filter Component
 * Unified filtering system for pricing and solutions pages
 */

class FloatingFilter {
    constructor(config) {
        this.config = {
            containerId: 'floating-filter',
            targetGridId: '',
            filters: [],
            onFilterChange: null,
            ...config
        };
        
        this.activeFilters = {};
        this.isOpen = true;
        this.isCollapsed = false;
        
        this.init();
    }
    
    init() {
        this.createFloatingFilter();
        this.setupEventListeners();
        this.initializeFilters();
    }
    
    createFloatingFilter() {
        // Remove existing filter if present
        const existingFilter = document.getElementById(this.config.containerId);
        if (existingFilter) {
            existingFilter.remove();
        }
        
        // Create filter HTML
        const filterHTML = `
            <div id="${this.config.containerId}" class="floating-filter is-open">
                <div class="filter-header">
                    <h3>Filters</h3>
                    <button class="filter-toggle" aria-label="Toggle filters">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                </div>
                <div class="filter-content">
                    ${this.renderFilterSections()}
                </div>
                <div class="filter-clear">
                    <button class="filter-clear-btn" disabled>Clear All Filters</button>
                </div>
                <div class="active-filters-badge" style="display: none;">0</div>
            </div>
        `;
        
        // Insert into DOM
        document.body.insertAdjacentHTML('beforeend', filterHTML);
        
        // Store references
        this.filterElement = document.getElementById(this.config.containerId);
        this.toggleBtn = this.filterElement.querySelector('.filter-toggle');
        this.clearBtn = this.filterElement.querySelector('.filter-clear-btn');
        this.badge = this.filterElement.querySelector('.active-filters-badge');
    }
    
    renderFilterSections() {
        return this.config.filters.map(section => {
            const options = section.options.map(option => {
                const isActive = this.activeFilters[section.type] === option.value;
                return `
                    <button class="filter-option ${isActive ? 'active' : ''}"
                            data-filter="${option.value}"
                            data-section="${section.type}"
                            aria-pressed="${isActive}">
                        <span class="filter-option-icon">
                            <i class="${option.icon || 'fas fa-circle'}"></i>
                        </span>
                        <span class="filter-option-text">${option.label}</span>
                        ${isActive ? '<i class="filter-option-check fas fa-check"></i>' : ''}
                    </button>
                `;
            }).join('');
            
            return `
                <div class="filter-section" data-filter-type="${section.type}">
                    <h4 class="filter-section-title">
                        <i class="${section.icon || 'fas fa-filter'}"></i>
                        ${section.title}
                    </h4>
                    <div class="filter-options-grid">
                        ${options}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    setupEventListeners() {
        // Toggle button
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Filter options - use event delegation for better performance
        this.filterElement.addEventListener('click', (e) => {
            const filterOption = e.target.closest('.filter-option');
            if (filterOption) {
                this.handleFilterClick(filterOption);
            }
        });
        
        // Clear filters button
        this.clearBtn.addEventListener('click', () => this.clearAllFilters());
        
        // Close on outside click (desktop only)
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 1024 &&
                this.isOpen &&
                !this.filterElement.contains(e.target)) {
                this.close();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    initializeFilters() {
        // Initialize all filters with 'all' selected
        this.config.filters.forEach(section => {
            this.activeFilters[section.type] = 'all';
        });
        this.updateUI();
    }
    
    handleFilterClick(optionElement) {
        const filterValue = optionElement.getAttribute('data-filter');
        const sectionType = optionElement.getAttribute('data-section');
        
        // Remove active class from siblings
        const siblings = optionElement.parentElement.querySelectorAll('.filter-option');
        siblings.forEach(sibling => {
            sibling.classList.remove('active');
            sibling.setAttribute('aria-pressed', 'false');
        });
        
        // Add active class to clicked option
        optionElement.classList.add('active');
        optionElement.setAttribute('aria-pressed', 'true');
        
        // Update active filters
        this.activeFilters[sectionType] = filterValue;
        
        // Update UI and trigger callback
        this.updateUI();
        this.triggerFilterChange();
    }
    
    clearAllFilters() {
        // Reset all filters to 'all'
        this.config.filters.forEach(section => {
            this.activeFilters[section.type] = 'all';
            
            // Update UI for each section
            const sectionElement = this.filterElement.querySelector(`[data-filter-type="${section.type}"]`);
            const options = sectionElement.querySelectorAll('.filter-option');
            options.forEach(option => {
                option.classList.remove('is-active');
                if (option.getAttribute('data-filter') === 'all') {
                    option.classList.add('is-active');
                }
            });
        });
        
        this.updateUI();
        this.triggerFilterChange();
    }
    
    updateUI() {
        // Count active filters (excluding 'all')
        const activeCount = Object.values(this.activeFilters).filter(value => value !== 'all').length;
        
        // Update badge
        if (activeCount > 0) {
            this.badge.textContent = activeCount;
            this.badge.style.display = 'flex';
        } else {
            this.badge.style.display = 'none';
        }
        
        // Update clear button
        this.clearBtn.disabled = activeCount === 0;
    }
    
    triggerFilterChange() {
        if (typeof this.config.onFilterChange === 'function') {
            this.config.onFilterChange(this.activeFilters);
        }
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.filterElement.classList.add('is-open');
        this.filterElement.classList.remove('is-collapsed');
        this.toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        this.toggleBtn.setAttribute('aria-label', 'Close filters');
    }
    
    close() {
        this.isOpen = false;
        this.filterElement.classList.remove('is-open');
        this.filterElement.classList.add('is-collapsed');
        this.toggleBtn.innerHTML = '<i class="fas fa-filter"></i>';
        this.toggleBtn.setAttribute('aria-label', 'Open filters');
    }
    
    // Public methods for external control
    getActiveFilters() {
        return { ...this.activeFilters };
    }
    
    setFilter(sectionType, value) {
        if (this.activeFilters.hasOwnProperty(sectionType)) {
            this.activeFilters[sectionType] = value;
            
            // Update UI
            const sectionElement = this.filterElement.querySelector(`[data-filter-type="${sectionType}"]`);
            if (sectionElement) {
                const options = sectionElement.querySelectorAll('.filter-option');
                options.forEach(option => {
                    const isActive = option.getAttribute('data-filter') === value;
                    option.classList.toggle('active', isActive);
                    option.setAttribute('aria-pressed', isActive.toString());
                });
            }
            
            this.updateUI();
            this.triggerFilterChange();
        }
    }
    
    destroy() {
        if (this.filterElement) {
            this.filterElement.remove();
        }
    }
}

// Export for use in other scripts
window.FloatingFilter = FloatingFilter;
