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
     * CORRECTED Feature: Expandable Case Study Card
     */
    const expandableCard = document.getElementById('expandable-card');
    const cardToggle = document.getElementById('card-toggle');

    if (expandableCard && cardToggle) {
        cardToggle.addEventListener('click', () => {
            const isOpening = !expandableCard.classList.contains('is-open');
            
            // Toggle the master class on the parent card
            expandableCard.classList.toggle('is-open');

            // Update ARIA for accessibility
            cardToggle.setAttribute('aria-expanded', isOpening);
            
            // Update button text
            const toggleText = cardToggle.querySelector('.toggle-text');
            if (isOpening) {
                toggleText.textContent = 'Hide Full Case Study';
            } else {
                toggleText.textContent = 'Read Full Case Study';
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