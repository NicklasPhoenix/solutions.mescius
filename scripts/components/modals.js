/**
 * Modal System Component
 * Handles modal dialogs with accessibility and keyboard navigation
 */

class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.previousFocus = null;
        this.modalStack = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupExistingModals();
    }

    setupEventListeners() {
        // Global escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });

        // Global click handler for modal backdrops
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    setupExistingModals() {
        // Find all modal triggers and set up event handlers
        const triggers = document.querySelectorAll('[data-modal-target]');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal-target');
                this.openModal(modalId);
            });
        });

        // Set up close buttons
        const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn, [data-modal-close]');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        });
    }

    openModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with ID '${modalId}' not found`);
            return;
        }

        // Store previous focus
        this.previousFocus = document.activeElement;

        // Add to modal stack
        this.modalStack.push(modalId);
        this.activeModal = modal;

        // Configure modal
        this.configureModal(modal, options);

        // Show modal
        this.showModal(modal);

        // Handle focus
        this.manageFocus(modal);

        // Prevent body scroll
        this.preventBodyScroll();

        // Trigger event
        this.triggerEvent('modalOpened', { modalId, modal });
    }

    closeModal(modalId = null) {
        let modal;
        
        if (modalId) {
            modal = document.getElementById(modalId);
            // Remove from stack
            const index = this.modalStack.indexOf(modalId);
            if (index > -1) {
                this.modalStack.splice(index, 1);
            }
        } else {
            // Close the topmost modal
            if (this.modalStack.length === 0) return;
            
            const topModalId = this.modalStack.pop();
            modal = document.getElementById(topModalId);
        }

        if (!modal) return;

        // Hide modal
        this.hideModal(modal);

        // Update active modal
        if (this.modalStack.length > 0) {
            const newActiveId = this.modalStack[this.modalStack.length - 1];
            this.activeModal = document.getElementById(newActiveId);
        } else {
            this.activeModal = null;
            // Restore body scroll only if no modals are open
            this.restoreBodyScroll();
            // Restore focus only if no modals are open
            this.restoreFocus();
        }

        // Trigger event
        this.triggerEvent('modalClosed', { modal });
    }

    createModal(id, content, options = {}) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');

        if (options.ariaLabel) {
            modal.setAttribute('aria-label', options.ariaLabel);
        }

        const modalContent = `
            <div class="modal-container ${options.size || 'medium'}">
                <div class="modal-header">
                    ${options.title ? `<h3 class="modal-title">${options.title}</h3>` : ''}
                    <button class="modal-close-btn" aria-label="Close modal">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
            </div>
        `;

        modal.innerHTML = modalContent;
        document.body.appendChild(modal);

        // Set up event handlers for the new modal
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(id));
        }

        return modal;
    }

    destroyModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Close if open
            if (this.modalStack.includes(modalId)) {
                this.closeModal(modalId);
            }
            
            // Remove from DOM
            modal.remove();
        }
    }

    configureModal(modal, options) {
        // Set size
        if (options.size) {
            const container = modal.querySelector('.modal-container');
            if (container) {
                container.className = `modal-container ${options.size}`;
            }
        }

        // Set title
        if (options.title) {
            const titleElement = modal.querySelector('.modal-title');
            if (titleElement) {
                titleElement.textContent = options.title;
            }
        }

        // Configure closable
        if (options.closable === false) {
            const closeBtn = modal.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.style.display = 'none';
            }
        }
    }

    showModal(modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    hideModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // Wait for animation to complete
        setTimeout(() => {
            modal.classList.remove('active');
        }, 300);
    }

    manageFocus(modal) {
        // Find focusable elements
        const focusableElements = this.getFocusableElements(modal);
        
        if (focusableElements.length > 0) {
            // Focus first element
            focusableElements[0].focus();
            
            // Set up focus trap
            this.setupFocusTrap(modal, focusableElements);
        }
    }

    getFocusableElements(container) {
        const focusableSelector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return Array.from(container.querySelectorAll(focusableSelector))
            .filter(el => el.offsetParent !== null); // Only visible elements
    }

    setupFocusTrap(modal, focusableElements) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const trapFocus = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        modal.addEventListener('keydown', trapFocus);
        
        // Store for cleanup
        modal._focusTrap = trapFocus;
    }

    removeFocusTrap(modal) {
        if (modal._focusTrap) {
            modal.removeEventListener('keydown', modal._focusTrap);
            delete modal._focusTrap;
        }
    }

    preventBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    }

    restoreBodyScroll() {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    }

    restoreFocus() {
        if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
            this.previousFocus.focus();
            this.previousFocus = null;
        }
    }

    triggerEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // Public API methods
    isModalOpen(modalId = null) {
        if (modalId) {
            return this.modalStack.includes(modalId);
        }
        return this.modalStack.length > 0;
    }

    getActiveModal() {
        return this.activeModal;
    }

    closeAllModals() {
        while (this.modalStack.length > 0) {
            this.closeModal();
        }
    }

    // Utility methods for common modal types
    showAlert(message, title = 'Alert') {
        const modalId = 'alert-modal-' + Date.now();
        
        const content = `
            <div class="alert-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;

        const footer = `
            <button class="btn btn-primary" onclick="window.modalSystem.closeModal('${modalId}')">OK</button>
        `;

        this.createModal(modalId, content, {
            title: title,
            footer: footer,
            size: 'small'
        });

        this.openModal(modalId);
        return modalId;
    }

    showConfirm(message, title = 'Confirm', callback = null) {
        const modalId = 'confirm-modal-' + Date.now();
        
        const content = `
            <div class="confirm-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="window.modalSystem.closeModal('${modalId}')">Cancel</button>
            <button class="btn btn-primary" id="confirm-ok-${modalId}">OK</button>
        `;

        this.createModal(modalId, content, {
            title: title,
            footer: footer,
            size: 'small'
        });

        this.openModal(modalId);

        // Set up OK button handler
        setTimeout(() => {
            const okBtn = document.getElementById(`confirm-ok-${modalId}`);
            if (okBtn) {
                okBtn.addEventListener('click', () => {
                    this.closeModal(modalId);
                    if (callback) callback(true);
                });
            }
        }, 100);

        return modalId;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize global modal system
window.modalSystem = new ModalSystem();

// Export for use in other scripts
window.ModalSystem = ModalSystem;