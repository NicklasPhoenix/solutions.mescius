/**
 * Form Validation Component
 * Handles real-time form validation with customizable rules
 */

class FormValidator {
    constructor(form, options = {}) {
        this.form = typeof form === 'string' ? document.querySelector(form) : form;
        this.options = {
            validateOnBlur: true,
            validateOnInput: false,
            validateOnSubmit: true,
            showSuccessMessage: true,
            scrollToFirstError: true,
            ...options
        };
        
        this.rules = new Map();
        this.errors = new Map();
        this.isValid = false;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupDefaultRules();
    }

    setupEventListeners() {
        if (this.options.validateOnSubmit) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm().then(isValid => {
                    if (isValid) {
                        this.handleValidSubmission(e);
                    } else {
                        this.handleInvalidSubmission();
                    }
                });
            });
        }

        // Field-level validation
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (this.options.validateOnBlur) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            }

            if (this.options.validateOnInput) {
                field.addEventListener('input', this.debounce(() => {
                    this.validateField(field);
                }, 300));
            }
        });
    }

    setupDefaultRules() {
        // Email validation
        this.addRule('email', (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) || 'Please enter a valid email address';
        });

        // Required field validation
        this.addRule('required', (value) => {
            return (value && value.trim().length > 0) || 'This field is required';
        });

        // Minimum length validation
        this.addRule('minLength', (value, minLength) => {
            return (value.length >= minLength) || `Minimum ${minLength} characters required`;
        });

        // Maximum length validation
        this.addRule('maxLength', (value, maxLength) => {
            return (value.length <= maxLength) || `Maximum ${maxLength} characters allowed`;
        });

        // Number validation
        this.addRule('number', (value) => {
            return (!isNaN(value) && !isNaN(parseFloat(value))) || 'Please enter a valid number';
        });

        // URL validation
        this.addRule('url', (value) => {
            try {
                new URL(value);
                return true;
            } catch {
                return 'Please enter a valid URL';
            }
        });

        // Phone validation
        this.addRule('phone', (value) => {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(value.replace(/\s/g, '')) || 'Please enter a valid phone number';
        });
    }

    addRule(name, validator) {
        this.rules.set(name, validator);
    }

    async validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value;
        const validationRules = this.getFieldRules(field);
        
        this.errors.delete(fieldName);
        
        for (const [ruleName, ruleParams] of validationRules) {
            const rule = this.rules.get(ruleName);
            if (!rule) continue;

            let result;
            if (typeof rule === 'function') {
                result = await rule(value, ruleParams, field);
            } else {
                result = true;
            }

            if (result !== true) {
                this.errors.set(fieldName, result);
                this.displayFieldError(field, result);
                return false;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    getFieldRules(field) {
        const rules = new Map();

        // Required attribute
        if (field.hasAttribute('required')) {
            rules.set('required', true);
        }

        // Type-based rules
        if (field.type === 'email') {
            rules.set('email', true);
        }

        if (field.type === 'url') {
            rules.set('url', true);
        }

        if (field.type === 'tel') {
            rules.set('phone', true);
        }

        if (field.type === 'number') {
            rules.set('number', true);
        }

        // HTML5 validation attributes
        if (field.hasAttribute('minlength')) {
            rules.set('minLength', parseInt(field.getAttribute('minlength')));
        }

        if (field.hasAttribute('maxlength')) {
            rules.set('maxLength', parseInt(field.getAttribute('maxlength')));
        }

        // Custom validation attributes
        if (field.hasAttribute('data-validate')) {
            const customRules = field.getAttribute('data-validate').split(',');
            customRules.forEach(rule => {
                const [ruleName, param] = rule.trim().split(':');
                rules.set(ruleName, param || true);
            });
        }

        return rules;
    }

    async validateForm() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        const validationPromises = Array.from(fields).map(field => this.validateField(field));
        
        const results = await Promise.all(validationPromises);
        this.isValid = results.every(result => result === true);
        
        return this.isValid;
    }

    displayFieldError(field, message) {
        field.classList.add('error', 'invalid');
        field.setAttribute('aria-invalid', 'true');
        
        // Remove existing error message
        this.clearFieldError(field);
        
        // Create error message element
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.id = `${field.id || field.name}-error`;
        
        // Associate error with field
        field.setAttribute('aria-describedby', errorElement.id);
        
        // Insert error message
        const container = field.closest('.form-group, .field-container') || field.parentElement;
        container.appendChild(errorElement);
        
        // Add visual feedback
        this.addFieldErrorStyling(field);
    }

    clearFieldError(field) {
        field.classList.remove('error', 'invalid');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
        
        // Remove error message
        const container = field.closest('.form-group, .field-container') || field.parentElement;
        const existingError = container.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove error styling
        this.removeFieldErrorStyling(field);
        
        // Add success styling if field has value
        if (field.value.trim()) {
            this.addFieldSuccessStyling(field);
        }
    }

    addFieldErrorStyling(field) {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
    }

    removeFieldErrorStyling(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    addFieldSuccessStyling(field) {
        if (this.options.showSuccessMessage) {
            field.style.borderColor = '#28a745';
            field.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
        }
    }

    displayFormFeedback(message, type = 'success') {
        // Remove existing feedback
        const existingFeedback = this.form.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `form-feedback ${type}`;
        feedback.setAttribute('role', type === 'error' ? 'alert' : 'status');
        feedback.textContent = message;

        // Insert feedback
        this.form.appendChild(feedback);

        // Auto-hide after delay
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 5000);
    }

    handleValidSubmission(event) {
        // Show success message
        this.displayFormFeedback('Form submitted successfully!', 'success');
        
        // Trigger custom event
        const submitEvent = new CustomEvent('formValidated', {
            detail: {
                form: this.form,
                isValid: true,
                originalEvent: event
            }
        });
        
        this.form.dispatchEvent(submitEvent);
        
        // Call custom submit handler if provided
        if (this.options.onSubmit) {
            this.options.onSubmit(this.getFormData(), this.form);
        }
    }

    handleInvalidSubmission() {
        // Scroll to first error
        if (this.options.scrollToFirstError) {
            const firstErrorField = this.form.querySelector('.error, .invalid');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstErrorField.focus();
            }
        }

        // Show error message
        this.displayFormFeedback('Please correct the errors below.', 'error');
        
        // Trigger custom event
        const errorEvent = new CustomEvent('formValidated', {
            detail: {
                form: this.form,
                isValid: false,
                errors: Object.fromEntries(this.errors)
            }
        });
        
        this.form.dispatchEvent(errorEvent);
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    reset() {
        this.form.reset();
        this.errors.clear();
        
        // Clear all field errors
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            this.clearFieldError(field);
            this.removeFieldErrorStyling(field);
        });

        // Clear form feedback
        const feedback = this.form.querySelector('.form-feedback');
        if (feedback) {
            feedback.remove();
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public API
    isFormValid() {
        return this.isValid;
    }

    getErrors() {
        return Object.fromEntries(this.errors);
    }

    setFieldValue(fieldName, value) {
        const field = this.form.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (field) {
            field.value = value;
            this.validateField(field);
        }
    }

    addCustomRule(name, validator) {
        this.addRule(name, validator);
    }
}

// Convenience function for creating form validators
function createFormValidator(form, options) {
    return new FormValidator(form, options);
}

// Auto-initialize forms with data-validate attribute
document.addEventListener('DOMContentLoaded', function() {
    const autoForms = document.querySelectorAll('form[data-validate]');
    autoForms.forEach(form => {
        new FormValidator(form);
    });
});

// Export for use in other scripts
window.FormValidator = FormValidator;
window.createFormValidator = createFormValidator;