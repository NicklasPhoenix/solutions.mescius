// Simple debug script to test bundle functionality
console.log("Debug: Testing bundle functionality");

document.addEventListener('DOMContentLoaded', () => {
    console.log("Debug: DOM Content Loaded");
    
    // Check if bundle cards exist
    const bundleCards = document.querySelectorAll('.bundle-card[data-base-price]');
    console.log("Debug: Found bundle cards:", bundleCards.length);
    
    bundleCards.forEach((card, index) => {
        console.log(`Debug: Card ${index + 1}:`, card.id);
        console.log("  - data-base-price:", card.dataset.basePrice);
        console.log("  - data-product-id:", card.dataset.productId);
        
        const cardId = card.id.replace('card-', '');
        console.log("  - cardId:", cardId);
        
        const quantityInput = card.querySelector('.quantity-input');
        console.log("  - quantityInput:", quantityInput ? quantityInput.id : 'NOT FOUND');
        
        const yearRadios = card.querySelectorAll(`input[type="radio"][name="years-${cardId}"]`);
        console.log("  - yearRadios count:", yearRadios.length);
        
        const priceEl = card.querySelector(`#price-${cardId}`);
        console.log("  - priceEl:", priceEl ? priceEl.id : 'NOT FOUND');
        
        const priceSummaryContainer = card.querySelector(`#price-summary-${cardId}`);
        console.log("  - priceSummaryContainer:", priceSummaryContainer ? priceSummaryContainer.id : 'NOT FOUND');
        
        const stepperButtons = card.querySelectorAll('.quantity-btn');
        console.log("  - stepperButtons count:", stepperButtons.length);
        
        if (stepperButtons.length > 0) {
            stepperButtons.forEach((btn, btnIndex) => {
                console.log(`    - Button ${btnIndex}: action=${btn.dataset.action}`);
            });
        }
    });
});