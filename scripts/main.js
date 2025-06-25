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
     * Feature 2: Expandable Case Study Card (for detail pages)
     */
    const expandableCard = document.getElementById('expandable-card');
    const cardToggle = document.getElementById('card-toggle');

    if (expandableCard && cardToggle) {
        cardToggle.addEventListener('click', () => {
            const isOpening = !expandableCard.classList.contains('is-open');
            expandableCard.classList.toggle('is-open');
            cardToggle.setAttribute('aria-expanded', isOpening);
            const toggleText = cardToggle.querySelector('.toggle-text');
            if (isOpening) {
                toggleText.textContent = 'Hide Full Case Study';
            } else {
                toggleText.textContent = 'Read Full Case Study';
            }
        });
    }

    /**
     * NEW Feature 3: Case Study Grid Filtering (for main page)
     */
    const filterControls = document.getElementById('filter-controls');
    const caseStudyCards = document.querySelectorAll('#case-study-grid .case-study-card');
    const noResultsMessage = document.getElementById('no-results-message');

    if (filterControls && caseStudyCards.length > 0) {
        let currentFilters = {
            industry: 'all',
            product: 'all'
        };

        filterControls.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            const filterGroup = btn.dataset.filterGroup;
            const filterValue = btn.dataset.filter;

            currentFilters[filterGroup] = filterValue;

            document.querySelectorAll(`.filter-btn[data-filter-group="${filterGroup}"]`).forEach(b => {
                b.classList.remove('is-active');
            });
            btn.classList.add('is-active');

            let visibleCount = 0;
            caseStudyCards.forEach(card => {
                const industryMatch = currentFilters.industry === 'all' || card.dataset.industry.includes(currentFilters.industry);
                const productMatch = currentFilters.product === 'all' || card.dataset.product.includes(currentFilters.product);

                if (industryMatch && productMatch) {
                    card.classList.remove('is-hidden');
                    visibleCount++;
                } else {
                    card.classList.add('is-hidden');
                }
            });

            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }


    /**
     * Feature 4: Fade-in Sections on Scroll
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
        }, { threshold: 0.1 });

        fadeInSections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Feature 5: Smooth Scrolling for Anchor Links
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