/**
 * Enhanced Animations Component
 * Provides advanced scroll animations and interactive effects
 */

class AnimationSystem {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            animationDuration: 600,
            staggerDelay: 100,
            enableParallax: true,
            enableCounters: true,
            enableProgressBars: true,
            ...options
        };
        
        this.observers = new Map();
        this.counters = new Set();
        this.progressBars = new Set();
        this.parallaxElements = new Set();
        
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.initializeScrollAnimations();
        this.initializeParallaxEffects();
        this.initializeProgressBars();
        this.initializeCounters();
        this.setupScrollHandler();
    }

    setupIntersectionObservers() {
        // Main animation observer
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });

        this.observers.set('animation', animationObserver);

        // Counter observer
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        this.observers.set('counter', counterObserver);

        // Progress bar observer
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        this.observers.set('progress', progressObserver);
    }

    initializeScrollAnimations() {
        // Find all elements with animation classes
        const animatedElements = document.querySelectorAll(`
            .scroll-animate,
            .scroll-animate-left,
            .scroll-animate-right,
            .scroll-animate-up,
            .scroll-animate-down,
            .scroll-animate-scale,
            .scroll-animate-fade,
            .stagger-children,
            [data-animate]
        `);

        animatedElements.forEach(element => {
            this.prepareElement(element);
            this.observers.get('animation').observe(element);
        });
    }

    initializeParallaxEffects() {
        if (!this.options.enableParallax) return;

        const parallaxElements = document.querySelectorAll('.parallax, [data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || -0.5;
            element._parallaxSpeed = speed;
            this.parallaxElements.add(element);
        });
    }

    initializeProgressBars() {
        if (!this.options.enableProgressBars) return;

        const progressBars = document.querySelectorAll('.progress-bar, [data-progress]');
        progressBars.forEach(bar => {
            this.progressBars.add(bar);
            this.observers.get('progress').observe(bar);
        });
    }

    initializeCounters() {
        if (!this.options.enableCounters) return;

        const counters = document.querySelectorAll('[data-target], .counter');
        counters.forEach(counter => {
            this.counters.add(counter);
            this.observers.get('counter').observe(counter);
        });
    }

    prepareElement(element) {
        // Set initial state based on animation type
        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'left':
                element.style.transform = 'translateX(-50px)';
                element.style.opacity = '0';
                break;
            case 'right':
                element.style.transform = 'translateX(50px)';
                element.style.opacity = '0';
                break;
            case 'up':
                element.style.transform = 'translateY(50px)';
                element.style.opacity = '0';
                break;
            case 'down':
                element.style.transform = 'translateY(-50px)';
                element.style.opacity = '0';
                break;
            case 'scale':
                element.style.transform = 'scale(0.8)';
                element.style.opacity = '0';
                break;
            case 'fade':
                element.style.opacity = '0';
                break;
            default:
                // Default bottom up animation
                element.style.transform = 'translateY(30px)';
                element.style.opacity = '0';
        }

        // Set transition
        element.style.transition = `all ${this.options.animationDuration}ms ease-out`;
    }

    getAnimationType(element) {
        if (element.classList.contains('scroll-animate-left')) return 'left';
        if (element.classList.contains('scroll-animate-right')) return 'right';
        if (element.classList.contains('scroll-animate-up')) return 'up';
        if (element.classList.contains('scroll-animate-down')) return 'down';
        if (element.classList.contains('scroll-animate-scale')) return 'scale';
        if (element.classList.contains('scroll-animate-fade')) return 'fade';
        
        const dataAnimate = element.getAttribute('data-animate');
        if (dataAnimate) return dataAnimate;
        
        return 'default';
    }

    triggerAnimation(element) {
        // Handle staggered children
        if (element.classList.contains('stagger-children')) {
            this.animateStaggeredChildren(element);
            return;
        }

        // Add in-view class
        element.classList.add('in-view');
        
        // Reset transforms and opacity
        element.style.transform = 'none';
        element.style.opacity = '1';

        // Add completion class after animation
        setTimeout(() => {
            element.classList.add('animation-complete');
        }, this.options.animationDuration);

        // Trigger custom event
        const event = new CustomEvent('elementAnimated', { detail: { element } });
        element.dispatchEvent(event);
    }

    animateStaggeredChildren(container) {
        const children = container.children;
        
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                this.triggerAnimation(child);
            }, index * this.options.staggerDelay);
        });
    }

    animateCounter(element) {
        const target = element.getAttribute('data-target');
        if (!target) return;

        const { number, suffix } = this.parseCounterValue(target);
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const easing = element.getAttribute('data-easing') || 'easeOutQuart';
        
        this.countUp(element, 0, number, suffix, duration, easing);
    }

    parseCounterValue(value) {
        const numericMatch = value.match(/[\d.]+/);
        const number = numericMatch ? parseFloat(numericMatch[0]) : 0;
        const suffix = value.replace(/[\d.]/g, '');
        
        return { number, suffix };
    }

    countUp(element, start, end, suffix, duration, easing) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing
            const easedProgress = this.applyEasing(progress, easing);
            const current = start + (end - start) * easedProgress;
            
            // Format and display value
            const formattedValue = this.formatCounterValue(current, suffix);
            element.textContent = formattedValue;
            
            // Add visual effect during counting
            element.classList.add('counting');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.classList.remove('counting');
                element.classList.add('counted');
            }
        };
        
        requestAnimationFrame(animate);
    }

    formatCounterValue(value, suffix) {
        let formatted = Math.floor(value);
        
        if (suffix.includes('K') || suffix.includes('k')) {
            if (value >= 1000) {
                formatted = (value / 1000).toFixed(value >= 10000 ? 0 : 1) + 'k';
            } else {
                formatted = Math.floor(value).toString();
            }
        } else if (suffix.includes('M')) {
            if (value >= 1000000) {
                formatted = (value / 1000000).toFixed(1) + 'M';
            } else {
                formatted = Math.floor(value).toString();
            }
        } else if (suffix.includes('%')) {
            formatted = Math.floor(value) + '%';
        } else if (suffix.includes('€')) {
            formatted = '€' + Math.floor(value).toLocaleString();
        } else {
            formatted = Math.floor(value) + suffix;
        }
        
        return formatted;
    }

    animateProgressBar(element) {
        const progress = element.getAttribute('data-progress') || '100';
        const duration = parseInt(element.getAttribute('data-duration')) || 1500;
        
        // Find progress fill element
        const progressFill = element.querySelector('.progress-fill') || element;
        
        // Animate width
        setTimeout(() => {
            progressFill.style.transition = `width ${duration}ms ease-out`;
            progressFill.style.width = progress + '%';
            
            // Add completion class
            setTimeout(() => {
                element.classList.add('progress-complete');
            }, duration);
        }, 100);
    }

    setupScrollHandler() {
        let ticking = false;
        
        const handleScroll = () => {
            if (this.options.enableParallax && this.parallaxElements.size > 0) {
                this.updateParallaxElements();
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }

    updateParallaxElements() {
        const scrollY = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = element._parallaxSpeed;
            
            // Only update if element is in viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = scrollY * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    applyEasing(t, easing) {
        switch (easing) {
            case 'easeOutQuart':
                return 1 - Math.pow(1 - t, 4);
            case 'easeOutCubic':
                return 1 - Math.pow(1 - t, 3);
            case 'easeOutQuad':
                return 1 - (1 - t) * (1 - t);
            case 'easeInOutQuad':
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 'easeInOutCubic':
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            default:
                return t; // linear
        }
    }

    // Public API methods
    animateElement(element, animationType = 'default') {
        element.className += ` scroll-animate-${animationType}`;
        this.prepareElement(element);
        
        // Trigger immediately
        setTimeout(() => {
            this.triggerAnimation(element);
        }, 100);
    }

    addParallaxElement(element, speed = -0.5) {
        element._parallaxSpeed = speed;
        element.classList.add('parallax');
        this.parallaxElements.add(element);
    }

    removeParallaxElement(element) {
        this.parallaxElements.delete(element);
        element.style.transform = '';
    }

    addProgressBar(element, progress = 100) {
        element.setAttribute('data-progress', progress);
        this.progressBars.add(element);
        this.observers.get('progress').observe(element);
    }

    addCounter(element, target, duration = 2000) {
        element.setAttribute('data-target', target);
        element.setAttribute('data-duration', duration);
        this.counters.add(element);
        this.observers.get('counter').observe(element);
    }

    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clear sets
        this.counters.clear();
        this.progressBars.clear();
        this.parallaxElements.clear();
    }
}

// Initialize global animation system
let animationSystem;

document.addEventListener('DOMContentLoaded', function() {
    animationSystem = new AnimationSystem();
});

// Export for use in other scripts
window.AnimationSystem = AnimationSystem;
window.getAnimationSystem = () => animationSystem;