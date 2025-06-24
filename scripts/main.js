// Global JavaScript for solutions.mescius.eu

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Feature 1: Responsive Mobile Navigation
     */
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            // Toggles the 'is-active' class on both the hamburger icon and the menu
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
        });
    }

    /**
     * NEW Feature: Collapsible "At a Glance" Container
     * Toggles the visibility of the key case study info.
     */
    const collapsibleContainer = document.getElementById('collapsible-container');
    const collapsibleHeader = document.getElementById('collapsible-header');

    if (collapsibleContainer && collapsibleHeader) {
        collapsibleHeader.addEventListener('click', () => {
            const isOpening = !collapsibleContainer.classList.contains('is-open');
            
            // Toggle the master class
            collapsibleContainer.classList.toggle('is-open');

            // Update ARIA for accessibility
            collapsibleHeader.setAttribute('aria-expanded', isOpening);
        });
    }

    /**
     * Feature 2: Fade-in Sections on Scroll (Restored from original)
     * Uses the Intersection Observer API for better performance.
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
        }, {
            threshold: 0.1 // Triggers when 10% of the element is visible
        });

        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Feature 3: Smooth Scrolling for Anchor Links (Restored from original)
     * Applies to any link starting with '#'
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
});