# CLAUDE CODE PROJECT GUIDELINES

## 🚨 CRITICAL RULES - DO NOT BREAK THESE

### File System Integrity
- **NEVER create new directories** - use existing structure only
- **NEVER rename existing files** - only modify content
- **NEVER delete existing files** - only add or modify
- **NEVER create random utility files** - work within established patterns

### Existing File Structure (DO NOT CHANGE)
```
/
├── index.html
├── pricing/
│   └── index.html
├── solutions/
│   └── index.html
├── bundles/
│   └── index.html
├── blueprints/
│   ├── index.html
│   ├── development/
│   ├── marketing/
│   └── operations/
├── cookie-policy/
│   └── index.html
├── 404.html
├── styles/
│   ├── 00-tokens/         # Design system foundations
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   └── shadows.css
│   ├── 01-base/          # Reset and fundamental styles
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── utilities.css
│   ├── 02-layout/        # Grid systems and containers
│   │   ├── grid.css
│   │   ├── containers.css
│   │   └── sections.css
│   ├── 03-components/    # Reusable UI components
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── navigation.css
│   │   ├── footer.css
│   │   ├── forms.css
│   │   ├── modals.css
│   │   └── animations.css
│   ├── 04-pages/         # Page-specific styles
│   │   ├── home.css
│   │   ├── pricing.css
│   │   ├── solutions.css
│   │   ├── bundles.css
│   │   └── blueprints.css
│   ├── 05-themes/        # Light/Dark mode support
│   │   ├── light.css
│   │   └── dark.css
│   └── main.css          # Imports everything
└── scripts/
    ├── core/
    │   ├── theme-switcher.js
    │   ├── smooth-scroll.js
    │   └── intersection.js
    ├── components/
    │   ├── navigation.js
    │   ├── product-cards.js
    │   ├── pillar-cards.js
    │   ├── stats-counter.js
    │   └── modal.js
    ├── pages/
    │   ├── home.js
    │   ├── pricing.js
    │   └── solutions.js
    └── main.js
```

### CSS Architecture Rules
- **USE EXISTING CSS FILES ONLY** - modify, don't create new ones
- **FOLLOW BEM METHODOLOGY** - existing classes use this pattern
- **RESPECT CSS CASCADE** - imports in main.css are ordered intentionally
- **USE EXISTING CSS CUSTOM PROPERTIES** - defined in 00-tokens/
- **MATCH EXISTING PATTERNS** - copy structures from working pages

### HTML Template Rules
- **COPY EXACT STRUCTURE** from `index.html` when adding missing elements
- **MAINTAIN EXISTING CLASS NAMES** - don't invent new ones
- **PRESERVE ACCESSIBILITY ATTRIBUTES** - aria-labels, roles, etc.
- **KEEP CONSISTENT HTML HIERARCHY** - header > container > content structure

### JavaScript Rules
- **MODIFY EXISTING JS FILES ONLY** - main.js, home.js, solutions.js
- **CREATE MISSING JS FILES** only if they follow the established naming pattern
- **USE EXISTING EVENT PATTERNS** - copy from working implementations
- **MAINTAIN EXISTING FUNCTION STRUCTURES** - don't rewrite working code

## 🎯 SPECIFIC ISSUES TO FIX

### Priority 1: Theme Toggle Missing (SAFE FIX)
**Files to modify:** All HTML files except index.html
**Action:** Copy the exact theme toggle structure from index.html
**Location:** Inside `.header-content` div, before `.menu-toggle`

### Priority 2: Mobile Navigation Positioning (CSS ONLY)
**File to modify:** `styles/03-components/navigation.css`
**Action:** Adjust positioning values only, don't restructure

### Priority 3: Container Standardization (HTML ONLY)
**Files to modify:** Individual HTML files
**Action:** Ensure consistent `.container` class usage (check styles/02-layout/containers.css for proper classes)

### Priority 4: Missing JavaScript Files (FOLLOW PATTERN)
**Missing files to create:** `scripts/pages/bundles.js`, `scripts/pages/blueprints.js`
**Pattern:** Follow exact structure from existing `scripts/pages/*.js` files

## 🔒 WHAT NOT TO TOUCH

### Protected Files (NEVER MODIFY)
- `styles/main.css` (import structure)
- `styles/00-tokens/*.css` (design system foundations)
- Logo and image files
- Any configuration files

### Protected Structures
- CSS Grid layouts (they work)
- Existing working navigation
- Current color system
- Working homepage functionality

## 📋 SAFE MODIFICATION PATTERNS

### Adding Theme Toggle (COPY THIS EXACTLY)
```html
<!-- Copy from index.html between nav and menu-toggle -->
<button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
    <span class="theme-toggle-icon light-icon" aria-hidden="true">☀️</span>
    <span class="theme-toggle-icon dark-icon" aria-hidden="true">🌙</span>
</button>
```

### CSS Modifications (SAFE APPROACH)
- Only modify property values, not selectors
- Add new properties to existing rules, don't create new rules
- Test one property change at a time

### JavaScript Additions (SAFE PATTERN)
- Copy function structures from existing `scripts/pages/*.js` files
- Use existing variable naming conventions from `scripts/core/` and `scripts/components/`
- Follow existing event listener patterns from `scripts/main.js`

## 🚫 DANGER ZONES - AVOID THESE

### Don't Create These
- New CSS architecture files
- Random utility scripts
- New directory structures
- Custom build processes
- New configuration files

### Don't Restructure These
- CSS import order in styles/main.css
- Existing working layouts in styles/02-layout/
- Color token system in styles/00-tokens/
- Navigation HTML structure (just fix positioning in styles/03-components/navigation.css)

## ✅ VALIDATION CHECKLIST

Before any change:
- [ ] Does this modify existing files only?
- [ ] Does this follow established patterns?
- [ ] Does this preserve existing working functionality?
- [ ] Does this maintain the CSS/JS/HTML architecture?
- [ ] Will this work consistently across all affected pages?

## 🎯 SUCCESS CRITERIA

Each fix should:
1. Solve the specific issue identified
2. Not break any existing functionality
3. Maintain consistency across all pages
4. Follow the established code patterns
5. Be minimal and surgical in scope

## 📞 EMERGENCY STOPS

If Claude Code suggests:
- Creating new directories
- Renaming existing files
- Restructuring working layouts
- Adding new build processes
- Creating utility files

**STOP and rephrase the prompt more specifically.**