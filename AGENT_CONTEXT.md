# FOR GITHUB COPILOT AGENT - CRITICAL SYSTEM RULES

## 🚨 MANDATORY READING BEFORE ANY CSS CHANGES

This solutions.mescius codebase uses a STRICT ITCSS token-based CSS architecture. Based on documented regression patterns, ANY violation of these rules will break multiple components simultaneously.

### REPOSITORY CSS ARCHITECTURE:
styles/
├── main.css (entry point - imports all files)
├── 00-tokens/ (CSS custom properties - CHANGE THESE ONLY)
│   ├── colors.css (color palette variables)
│   ├── typography.css (font system)
│   ├── spacing.css (spacing scale)
│   └── shadows.css (elevation system)
├── 01-base/ (reset, typography, utilities)
├── 02-layout/ (containers, grid, sections)
├── 03-components/ (all UI components)
├── 04-pages/ (page-specific styles)
└── 05-themes/ (light.css, dark.css)

### ABSOLUTE FORBIDDEN ACTIONS:
- ❌ Component-specific CSS overrides (`.cart-total { color: white; }`)
- ❌ Inline styles (`style="color: white"`) 
- ❌ !important declarations (`color: white !important`)
- ❌ New CSS properties outside the token system in `/00-tokens/`
- ❌ Duplicate color/spacing/layout definitions
- ❌ Dark blue fonts on dark backgrounds (documented visibility crisis)
- ❌ Adding pseudo elements (`.product-card::before` - these must be REMOVED)
- ❌ Modifying files outside your assigned component scope

### DOCUMENTED CRITICAL ISSUES (DO NOT RECREATE):

#### Theme System Crisis:
- **Three-Mode Conflict**: Currently has default, light, AND dark modes causing conflicts
- **Page Load Problem**: "Page loads appearing light, then clicking theme toggle (showing light icon) makes page flash and get lighter"
- **Backwards Icons**: Light mode shows light icon (should show moon), dark mode shows dark icon (should show sun)
- **Theme Loss**: "When switching pages darkmode gets lost and we are in default mode"

#### Color Token Disasters:
- **Cart Color Bug**: `[data-theme="dark"] .cart-total { color: var(--primary); }` should be white font
- **Hero Button Crisis**: "in light mode its not visible at all since its color does not exist"
- **Pricing Cards**: "font of the cards are Darkblue on darkblue so not visible in darkmode"
- **Footer Invisible**: "hover animation not visible because its a blue color on dark blue"
- **Bundle Cards**: "have no darkmode styling at all"

#### Layout Token Problems:
- **Card Misalignment**: "Add to cart buttons are not always on the same level for each card"
- **Cart Width**: "collapsed cart should maintain the same size as the uncollapsed cart"
- **OEM Cards**: "Contact for OEM Quote are on different levels compared to each other"

#### JavaScript Functionality Breaks:
- **Cart Hide**: "X button has no functionality... console logs show 'hide cart' but nothing happens"
- **Filter Behavior**: "floating filter closes on click outside making it confusing"

### REQUIRED INVESTIGATION PROCESS:
1. **READ TOKEN_MAP.md FIRST** - Understand token dependencies
2. **IDENTIFY EXACT TOKEN FILE** - Find which file in `/00-tokens/` contains your target
3. **MAP ALL USAGE** - Find every component using the same token
4. **ANALYZE CASCADE** - Predict what breaks when you change this token
5. **IMPLEMENT SURGICALLY** - Change ONLY in `/00-tokens/` or `/05-themes/`
6. **TEST REGRESSION LIST** - Follow REGRESSION_TESTS.md checklist

### TOKEN CHANGE RULES:
- **Colors**: Only change in `/00-tokens/colors.css` or `/05-themes/light.css|dark.css`
- **Spacing**: Only change in `/00-tokens/spacing.css`
- **Typography**: Only change in `/00-tokens/typography.css`
- **Shadows**: Only change in `/00-tokens/shadows.css`
- **Component Files**: NEVER add custom colors/spacing - use tokens only

### SUCCESS CRITERIA FOR ALL CHANGES:
- [ ] Problem fixed using token system only
- [ ] No new component-specific CSS added
- [ ] All related components still work (list them)
- [ ] Theme switching works in both directions
- [ ] No visual regressions in light/dark modes
- [ ] Cart functionality preserved
- [ ] Navigation theme persistence maintained

### EMERGENCY STOP CONDITIONS:
If you encounter ANY of these, STOP immediately and ask for guidance:
- Need to add `!important` to override something
- Want to add component-specific colors/spacing
- Token change affects more than 5 components
- Can't find the right token to modify
- Solution requires new CSS properties outside token system

## AGENT MUST READ: TOKEN_MAP.md, REGRESSION_TESTS.md, COMPONENT_DEPENDENCIES.md

File 2: TOKEN_MAP.md (Place in Repository Root)
markdown# CSS TOKEN DEPENDENCY MAP - AGENT REFERENCE

## Token File Locations:
- **Color Tokens**: `/styles/00-tokens/colors.css`
- **Typography Tokens**: `/styles/00-tokens/typography.css`  
- **Spacing Tokens**: `/styles/00-tokens/spacing.css`
- **Shadow Tokens**: `/styles/00-tokens/shadows.css`
- **Theme Overrides**: `/styles/05-themes/light.css` and `/styles/05-themes/dark.css`

## CRITICAL TOKEN DEPENDENCIES:

### Color System (colors.css):
**⚠️ DOCUMENTED PROBLEM TOKENS:**
- `--primary`: MISUSED for text color in `.cart-total` (should use `--text-color`)
- `--text-color`: Missing proper dark mode definition
- `--button-bg`: Missing in light mode (hero button invisible)
- `--button-text`: Wrong value in dark mode (dark blue on dark)

**Components Using Color Tokens:**
- **Floating Cart**: Uses `--primary` (WRONG), needs `--text-color`
- **Hero Button**: Uses `--button-bg`, `--button-text` (BROKEN in both modes)
- **Pricing Cards**: Uses `--text-color` (BROKEN in dark mode)
- **Footer**: Uses hover color tokens (INVISIBLE in both modes)
- **Bundle Cards**: NO dark mode tokens at all

### Spacing System (spacing.css):
**Components Using Spacing Tokens:**
- **Floating Cart**: `--cart-width`, `--cart-padding`, `--cart-spacing`
- **Card Components**: `--card-padding`, `--card-margin`, `--card-gap`
- **Button Alignment**: `--button-spacing`, `--element-gap`

**⚠️ DOCUMENTED PROBLEMS:**
- Cart collapsed/expanded width inconsistency
- "Add to cart" buttons at different levels
- "Your Cart" text and "-" button spacing

### Typography System (typography.css):
**Global Typography Tokens:**
- `--font-primary`: Montserrat (all headings)
- `--font-body`: System fonts (all body text)
- `--font-size-*`: Size scale
- `--font-weight-*`: Weight scale
- `--line-height-*`: Line height scale

### Theme System (light.css / dark.css):
**⚠️ CRITICAL THEME PROBLEMS:**
- **Three-Mode Conflict**: Default + Light + Dark creating conflicts
- **Token Inheritance**: `:root` → `[data-theme="light"]` → `[data-theme="dark"]`
- **Missing Tokens**: Bundle cards have NO dark mode tokens
- **Wrong Values**: Dark blue fonts in dark mode

## COMPONENT-TOKEN USAGE MAP:

### Floating Cart (`/styles/03-components/floating-cart.css`):
- **Colors**: `--primary` (WRONG - should be `--text-color`), `--bg-color`, `--border-color`
- **Spacing**: `--cart-width`, `--cart-padding`, `--cart-item-spacing`
- **Typography**: `--font-size-body`, `--font-weight-medium`

### Navigation (`/styles/03-components/navigation.css`):
- **Colors**: `--nav-bg`, `--nav-text`, `--nav-hover`
- **Spacing**: `--nav-padding`, `--nav-item-spacing`

### Cards (`/styles/03-components/cards.css`):
- **Colors**: `--card-bg`, `--card-text`, `--card-border`
- **Spacing**: `--card-padding`, `--card-margin`, `--card-radius`
- **Shadows**: `--shadow-card`, `--shadow-card-hover`

### Buttons (`/styles/03-components/buttons.css`):
- **Colors**: `--button-bg`, `--button-text`, `--button-hover-bg`
- **Spacing**: `--button-padding`, `--button-radius`
- **Typography**: `--button-font-size`, `--button-font-weight`

### Footer (`/styles/03-components/footer.css`):
- **Colors**: `--footer-bg`, `--footer-text`, `--footer-hover` (BROKEN)
- **Spacing**: `--footer-padding`, `--footer-item-spacing`

## PAGE-SPECIFIC TOKEN USAGE:

### Pricing Page (`/styles/04-pages/pricing.css`):
- Uses card tokens + `--pricing-highlight`, `--pricing-accent`
- **⚠️ PROBLEM**: Dark blue text on dark backgrounds

### Bundles Page (`/styles/04-pages/bundles.css`):
- **⚠️ CRITICAL**: NO dark mode tokens defined at all
- Uses: `--bundle-bg`, `--bundle-text`, `--bundle-accent`

### Home Page (`/styles/04-pages/home.css`):
- Hero section: `--hero-bg`, `--hero-text`, `--hero-button-*`
- **⚠️ PROBLEM**: Hero button invisible in light mode

## TOKEN CHANGE IMPACT MATRIX:

### High-Risk Tokens (Affect 5+ Components):
- `--primary`: Cart, buttons, accents, links
- `--text-color`: All text, cards, navigation, footer
- `--bg-color`: Page backgrounds, card backgrounds, modals
- `--spacing-*`: All layout components

### Medium-Risk Tokens (Affect 2-4 Components):
- `--button-*`: All button types, CTAs
- `--card-*`: Product cards, pricing cards, bundle cards
- `--nav-*`: Header navigation, mobile menu

### Low-Risk Tokens (Component-Specific):
- `--hero-*`: Only hero section
- `--footer-*`: Only footer component
- `--cart-*`: Only floating cart

## AGENT SAFETY CHECKLIST:
Before changing ANY token:
- [ ] Identify which risk category (high/medium/low)
- [ ] List ALL components using this token
- [ ] Check if change affects theme switching
- [ ] Verify no pseudo elements will be created
- [ ] Confirm change is in correct token file location