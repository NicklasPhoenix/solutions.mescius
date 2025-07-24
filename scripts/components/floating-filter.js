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
        this.isOpen = false;
        this.isCollapsed = true;
        
        this.init();
    }
    
    // Utility method to check if screen is mobile
    isMobileScreen() {
        return window.innerWidth < 768;
    }
    
    // Method to close other floating components on mobile
    closeOtherFloatingComponents() {
        if (this.isMobileScreen() && window.cart && window.cart.isVisible) {
            window.cart.hideCart();
        }
    }
    
    init() {
        this.createFloatingFilter();
        this.setupEventListeners();
        this.initializeFilters();
    }
    
    createFloatingFilter() {
        // Store references to existing DOM elements with correct class names
        this.filterElement = document.getElementById(this.config.containerId);
        this.toggleBtn = this.filterElement?.querySelector('.floating-filter-toggle');
        this.clearBtn = this.filterElement?.querySelector('.floating-filter-clear');
        this.badge = this.filterElement?.querySelector('.active-filters-badge');
        
        // If filter element doesn't exist, create it with proper class names
        if (!this.filterElement) {
            const filterHTML = `
                <div id="${this.config.containerId}" class="floating-filter is-collapsed">
                    <div class="floating-filter-header">
                        <h3>Filters</h3>
                        <button class="floating-filter-toggle" aria-label="Toggle filters">
                            <i class="fas fa-filter"></i>
                        </button>
                    </div>
                    <div class="floating-filter-content">
                        ${this.renderFilterSections()}
                    </div>
                    <div class="floating-filter-actions">
                        <button class="floating-filter-clear" disabled>Clear All Filters</button>
                    </div>
                    <div class="active-filters-badge" style="display: none;">0</div>
                </div>
            `;
            
            // Insert into DOM
            document.body.insertAdjacentHTML('beforeend', filterHTML);
            
            // Re-store references
            this.filterElement = document.getElementById(this.config.containerId);
            this.toggleBtn = this.filterElement?.querySelector('.floating-filter-toggle');
            this.clearBtn = this.filterElement?.querySelector('.floating-filter-clear');
            this.badge = this.filterElement?.querySelector('.active-filters-badge');
        } else {
            // Update existing content if needed
            const contentElement = this.filterElement.querySelector('.floating-filter-content');
            if (contentElement && this.config.filters.length > 0) {
                contentElement.innerHTML = this.renderFilterSections();
            }
        }
        
        console.log('[FloatingFilter] DOM elements referenced', {
            timestamp: new Date().toISOString(),
            filterElement: !!this.filterElement,
            toggleBtn: !!this.toggleBtn,
            clearBtn: !!this.clearBtn,
            badge: !!this.badge,
            filterElementConnected: this.filterElement?.isConnected,
            toggleBtnConnected: this.toggleBtn?.isConnected,
            toggleBtnBounds: this.toggleBtn?.getBoundingClientRect()
        });
    }
    
    renderFilterSections() {
        return this.config.filters.map(section => {
            const options = section.options.map(option => {
                const isActive = this.activeFilters[section.type] === option.value;
                return `
                    <button class="floating-filter-option ${isActive ? 'active' : ''}"
                            data-filter="${option.value}"
                            data-section="${section.type}"
                            aria-pressed="${isActive}">
                        <span class="floating-filter-option-icon">
                            <i class="${option.icon || 'fas fa-circle'}"></i>
                        </span>
                        <span class="floating-filter-option-text">${option.label}</span>
                        ${isActive ? '<i class="floating-filter-option-check fas fa-check"></i>' : ''}
                    </button>
                `;
            }).join('');
            
            return `
                <div class="floating-filter-section" data-filter-type="${section.type}">
                    <h4 class="floating-filter-section-title">
                        <i class="${section.icon || 'fas fa-filter'}"></i>
                        ${section.title}
                    </h4>
                    <div class="floating-filter-options">
                        ${options}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    setupEventListeners() {
        // Check if required elements exist before adding listeners
        if (!this.toggleBtn) {
            console.error('[FloatingFilter] Toggle button not found. Cannot setup event listeners.');
            return;
        }
        
        if (!this.clearBtn) {
            console.error('[FloatingFilter] Clear button not found. Cannot setup event listeners.');
            return;
        }
        
        // Toggle button with enhanced debugging
        this.toggleBtn.addEventListener('click', (e) => {
            console.log('[FloatingFilter] Toggle button clicked', {
                timestamp: new Date().toISOString(),
                target: e.target,
                currentTarget: e.currentTarget,
                isOpen: this.isOpen,
                isCollapsed: this.isCollapsed,
                buttonElement: this.toggleBtn,
                buttonExists: !!this.toggleBtn,
                buttonConnected: this.toggleBtn?.isConnected,
                filterElement: this.filterElement,
                filterClasses: this.filterElement?.className
            });
            
            // Prevent event bubbling to avoid triggering document click handler
            e.stopPropagation();
            
            this.toggle();
        });
        
        // Add additional click debugging for the entire filter element
        if (this.filterElement) {
            this.filterElement.addEventListener('click', (e) => {
                if (e.target.closest('.floating-filter-toggle')) {
                    console.log('[FloatingFilter] Click detected on toggle area', {
                        timestamp: new Date().toISOString(),
                        clickX: e.clientX,
                        clickY: e.clientY,
                        target: e.target,
                        toggleBounds: this.toggleBtn?.getBoundingClientRect(),
                        computedStyle: window.getComputedStyle(this.toggleBtn || {})
                    });
                }
            });
            
            // Filter options - use event delegation for better performance
            this.filterElement.addEventListener('click', (e) => {
                const filterOption = e.target.closest('.floating-filter-option');
                if (filterOption) {
                    this.handleFilterClick(filterOption);
                }
            });
        }
        
        // Clear filters button
        this.clearBtn.addEventListener('click', () => this.clearAllFilters());
        
        // Note: Outside click to close removed as per UX requirements
        // Filter now only closes when collapse button is clicked or Escape key is pressed
        
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
        const siblings = optionElement.parentElement.querySelectorAll('.floating-filter-option');
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
            const options = sectionElement.querySelectorAll('.floating-filter-option');
            options.forEach(option => {
                option.classList.remove('active');
                option.setAttribute('aria-pressed', 'false');
                if (option.getAttribute('data-filter') === 'all') {
                    option.classList.add('active');
                    option.setAttribute('aria-pressed', 'true');
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
        console.log('[FloatingFilter] Toggle method called', {
            timestamp: new Date().toISOString(),
            currentState: { isOpen: this.isOpen, isCollapsed: this.isCollapsed },
            toggleBtnExists: !!this.toggleBtn,
            toggleBtnConnected: this.toggleBtn?.isConnected,
            filterElementExists: !!this.filterElement,
            filterElementConnected: this.filterElement?.isConnected
        });
        
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        console.log('[FloatingFilter] Opening filter', {
            timestamp: new Date().toISOString(),
            beforeState: { isOpen: this.isOpen, isCollapsed: this.isCollapsed },
            filterClasses: this.filterElement?.className
        });
        
        // Close other floating components on mobile
        this.closeOtherFloatingComponents();
        
        this.isOpen = true;
        this.isCollapsed = false;
        this.filterElement.classList.add('is-open');
        this.filterElement.classList.remove('is-collapsed');
        this.toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        this.toggleBtn.setAttribute('aria-label', 'Close filters');
        
        console.log('[FloatingFilter] Filter opened', {
            timestamp: new Date().toISOString(),
            afterState: { isOpen: this.isOpen, isCollapsed: this.isCollapsed },
            filterClasses: this.filterElement?.className
        });
    }
    
    close() {
        console.log('[FloatingFilter] Closing filter', {
            timestamp: new Date().toISOString(),
            beforeState: { isOpen: this.isOpen, isCollapsed: this.isCollapsed },
            filterClasses: this.filterElement?.className
        });
        
        this.isOpen = false;
        this.isCollapsed = true;
        this.filterElement.classList.remove('is-open');
        this.filterElement.classList.add('is-collapsed');
        this.toggleBtn.innerHTML = '<i class="fas fa-filter"></i>';
        this.toggleBtn.setAttribute('aria-label', 'Open filters');
        
        console.log('[FloatingFilter] Filter closed', {
            timestamp: new Date().toISOString(),
            afterState: { isOpen: this.isOpen, isCollapsed: this.isCollapsed },
            filterClasses: this.filterElement?.className
        });
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
                const options = sectionElement.querySelectorAll('.floating-filter-option');
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
