# COMPONENT DEPENDENCY MAP FOR AGENT

## Token Change Impact Reference

### FLOATING CART (`/styles/03-components/floating-cart.css`)
**JavaScript**: `/scripts/components/cart.js`
**Pages Using**: All pages (global component)
**Current Issues**: 
- `[data-theme="dark"] .cart-total { color: var(--primary); }` should be white
- X button non-functional
- Width inconsistency collapsed vs expanded

**Dependencies**:
- Color tokens: `--primary` (WRONG), `--text-color`, `--bg-color`
- Spacing tokens: `--cart-width`, `--cart-padding`
- If you change these tokens, also affects: buttons, links, accents

### NAVIGATION (`/styles/03-components/navigation.css`)
**JavaScript**: `/scripts/main.js`
**Pages Using**: All pages
**Current Issues**: Theme toggle icon logic backwards

**Dependencies**:
- Color tokens: `--nav-bg`, `--nav-text`, `--nav-hover`
- If you change these tokens, also affects: headers, menu items

### CARDS (`/styles/03-components/cards.css`)
**Pages Using**: pricing/, bundles/, index.html, solutions/
**Current Issues**: 
- Misaligned "Add to cart" buttons
- Dark blue text on dark backgrounds
- Bundle cards missing dark mode

**Dependencies**:
- Color tokens: `--card-bg`, `--card-text`, `--card-border`
- Spacing tokens: `--card-padding`, `--card-margin`
- If you change these tokens, also affects: All card-based layouts

### BUTTONS (`/styles/03-components/buttons.css`)
**Pages Using**: All pages
**Current Issues**: 
- Hero button invisible in light mode
- Dark blue text in dark mode

**Dependencies**:
- Color tokens: `--button-bg`, `--button-text`, `--button-hover`
- Spacing tokens: `--button-padding`, `--button-radius`
- If you change these tokens, also affects: CTAs, form buttons, cart buttons

### FOOTER (`/styles/03-components/footer.css`)
**Pages Using**: All pages
**Current Issues**: Hover effects invisible in both modes

**Dependencies**:
- Color tokens: `--footer-bg`, `--footer-text`, `--footer-hover`
- If you change these tokens, also affects: bottom navigation, social links

## PAGE-SPECIFIC DEPENDENCIES

### PRICING PAGE (`/styles/04-pages/pricing.css`)
**File**: `pricing/index.html`
**JavaScript**: `/scripts/pricing.js`, `/scripts/components/floating-filter.js`
**Issues**: Dark blue text on dark backgrounds, missing hero styling

**Token Dependencies**:
- Inherits from: cards.css, buttons.css, floating-filter.css
- Specific tokens: `--pricing-highlight`, `--pricing-accent`
- **⚠️ Changes to card tokens heavily impact this page**

### BUNDLES PAGE (`/styles/04-pages/bundles.css`)
**File**: `bundles/index.html`
**JavaScript**: `/scripts/bundles.js`
**Issues**: NO dark mode styling, OEM card misalignment

**Token Dependencies**:
- Inherits from: cards.css, buttons.css
- **⚠️ CRITICAL**: Missing complete dark mode token set
- **⚠️ Changes to card/button tokens will heavily impact this page**

### HOME PAGE (`/styles/04-pages/home.css`)
**File**: `index.html`
**JavaScript**: `/scripts/home.js`
**Issues**: Hero button invisible in light mode

**Token Dependencies**:
- Inherits from: buttons.css, cards.css
- Specific tokens: `--hero-bg`, `--hero-text`, `--hero-button-*`
- **⚠️ Changes to button tokens will affect hero section**

### SOLUTIONS PAGE (`/styles/04-pages/solutions.css`)
**File**: `solutions/index.html`
**JavaScript**: `/scripts/solutions.js`, `/scripts/components/floating-filter.js`

**Token Dependencies**:
- Inherits from: cards.css, floating-filter.css
- **⚠️ Changes to card tokens affect solution grid layout**

## JAVASCRIPT COMPONENT DEPENDENCIES

### ShoppingCart (`/scripts/components/cart.js`)
**CSS Dependencies**: floating-cart.css, buttons.css
**Current Issues**: X button logs "hide cart" but doesn't hide
**⚠️ Token changes to cart/button colors may affect JS selectors**

### FloatingFilter (`/scripts/components/floating-filter.js`)
**CSS Dependencies**: floating-filter.css
**Current Issues**: Closes on outside click (should only close on button)
**Used By**: pricing.js, solutions.js

### Theme Toggle (`/scripts/main.js`)
**CSS Dependencies**: theme-toggle.css, light.css, dark.css
**Current Issues**: 
- Page loads "appearing light" but isn't light mode
- Icon logic backwards
- Theme lost on page navigation
**⚠️ Changes to theme tokens directly affect this functionality**

## INTER-COMPONENT IMPACT MAP

### If You Change `--primary` Token:
**Direct Impact**: floating-cart.css, buttons.css, cards.css
**Indirect Impact**: All pages using buttons/cards
**JavaScript Impact**: May affect cart.js selectors

### If You Change `--text-color` Token:
**Direct Impact**: ALL components with text
**Pages**: ALL pages affected
**Risk Level**: VERY HIGH

### If You Change `--bg-color` Token:
**Direct Impact**: All background elements
**Pages**: ALL pages affected  
**Risk Level**: VERY HIGH

### If You Change Spacing Tokens:
**Direct Impact**: Layout of all components using that spacing
**Risk Level**: HIGH (alignment issues across site)

### If You Change Button Tokens:
**Direct Impact**: buttons.css, floating-cart.css, navigation.css
**Critical**: Hero button visibility (current major issue)
**JavaScript**: May affect event listeners on buttons

## AGENT CHANGE PROTOCOL:

### Before Any Token Change:
1. Check this dependency map for impact scope
2. If impact is HIGH/VERY HIGH, list ALL affected components
3. Plan regression testing for each affected component
4. Ensure change won't recreate documented issues

### During Implementation:
1. Change ONLY in token files (`/00-tokens/` or `/05-themes/`)
2. Never add component-specific overrides
3. Test each affected component individually

### After Changes:
1. Run full regression test from REGRESSION_TESTS.md
2. Verify JavaScript functionality still works
3. Test theme switching in both directions
4. Confirm no new pseudo elements created