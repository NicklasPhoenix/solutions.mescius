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
     * NEW Feature: Collapsible Case Study Text
     * Toggles the visibility of the main story content.
     */
    const storyContainer = document.getElementById('story-container');
    const storyToggleBtn = document.getElementById('story-toggle');

    if (storyContainer && storyToggleBtn) {
        storyToggleBtn.addEventListener('click', () => {
            const isOpening = !storyContainer.classList.contains('is-open');
            
            // Toggle the master class on the container
            storyContainer.classList.toggle('is-open');

            // Update ARIA for accessibility
            storyToggleBtn.setAttribute('aria-expanded', isOpening);

            // Update button text
            const buttonText = storyToggleBtn.querySelector('.button-text');
            if (isOpening) {
                buttonText.textContent = 'Hide Full Case Study';
            } else {
                buttonText.textContent = 'Read Full Case Study';
            }
        });
    }


    /**
     * Feature 2: Fade-in Sections on Scroll (Restored from original)
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
            threshold: 0.1
        });

        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Feature 3: Smooth Scrolling for Anchor Links (Restored from original)
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