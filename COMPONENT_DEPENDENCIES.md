# MESCIUS SOLUTIONS WEBSITE - COMPONENT DEPENDENCIES

## Component Architecture Overview

The MESCIUS Solutions website uses a sophisticated **token-based design system** following the **ITCSS (Inverted Triangle CSS)** methodology. All styling changes must flow through the design tokens to maintain consistency and prevent conflicts.

### Design System Structure
```
styles/
├── 00-tokens/          # Design system foundations (CRITICAL LAYER)
├── 01-base/           # Reset and fundamental styles
├── 02-layout/         # Grid systems and containers
├── 03-components/     # Reusable UI components
├── 04-pages/          # Page-specific styles
└── 05-themes/         # Light/Dark mode overrides (CRITICAL LAYER)
```

**🚨 CRITICAL RULE**: All styling changes must go through `00-tokens/` or `05-themes/` only. Never modify component files directly.

---

## Core JavaScript Components

### FloatingCart Class (`scripts/components/cart.js`)
**CSS Dependencies**: [`floating-cart.css`](styles/03-components/floating-cart.css), [`buttons.css`](styles/03-components/buttons.css)
**Pages Using**: All pages (global component)
**Key Features**:
- localStorage persistence for cart state
- Mobile-responsive design with collision detection
- Integration with checkout system
- Dynamic cart badge updates
- Minimize/expand functionality

**Dependencies**:
- **Tokens**: `--primary`, `--text-primary`, `--bg-secondary`, `--border-color`
- **Theme Integration**: Full dark mode support via [`dark.css`](styles/05-themes/dark.css)
- **Component Interaction**: Closes [`FloatingFilter`](scripts/components/floating-filter.js) on mobile
- **Event System**: Document-level click handling with event delegation

**Impact Analysis**: Changes to cart tokens affect all purchase-related interactions across the site.

### FloatingFilter Class (`scripts/components/floating-filter.js`)
**CSS Dependencies**: [`floating-filter.css`](styles/03-components/floating-filter.css)
**Pages Using**: [`pricing/index.html`](pricing/index.html), [`solutions/index.html`](solutions/index.html)
**Key Features**:
- Unified filtering system for pricing and solutions
- State management with active filter tracking
- Mobile-responsive with collision detection
- Event delegation for performance

**Dependencies**:
- **Tokens**: `--bg-tertiary`, `--border-color`, `--primary`, `--text-secondary`
- **Component Interaction**: Closes [`FloatingCart`](scripts/components/cart.js) on mobile
- **State Management**: Maintains filter state across page interactions
- **Callback System**: Triggers page-specific filter functions

**Impact Analysis**: Filter styling changes affect content discovery on key conversion pages.

### Theme System (`scripts/main.js`)
**CSS Dependencies**: [`theme-toggle.css`](styles/03-components/theme-toggle.css), [`light.css`](styles/05-themes/light.css), [`dark.css`](styles/05-themes/dark.css)
**Pages Using**: All pages (global system)
**Key Features**:
- localStorage persistence for theme preference
- System preference detection
- Smooth theme transitions
- CSS custom property management

**Dependencies**:
- **Token System**: Overrides all color tokens in dark mode
- **CSS Custom Properties**: Uses `data-theme` attribute for theming
- **Component Integration**: Affects all visual components
- **Performance**: Applies theme immediately on page load

**Impact Analysis**: Theme token changes affect the entire visual system across all pages.

### Navigation Component (`scripts/main.js`)
**CSS Dependencies**: [`navigation.css`](styles/03-components/navigation.css)
**Pages Using**: All pages (global component)
**Key Features**:
- Mobile menu toggle with hamburger animation
- Smooth scroll for anchor links
- Header scroll effects
- Theme toggle integration

**Dependencies**:
- **Tokens**: `--bg-primary`, `--text-secondary`, `--primary`
- **Layout System**: Uses container and grid tokens
- **Animation System**: Scroll-triggered animations
- **Accessibility**: Focus management and ARIA support

**Impact Analysis**: Navigation token changes affect site-wide user experience and accessibility.

---

## CSS Component Dependencies

### Design Tokens (`00-tokens/`)
**Core Token Files**:
- [`colors.css`](styles/00-tokens/colors.css) - Primary, accent, product, and semantic colors
- [`typography.css`](styles/00-tokens/typography.css) - Font scales, weights, and spacing
- [`spacing.css`](styles/00-tokens/spacing.css) - 8px-based spacing scale
- [`shadows.css`](styles/00-tokens/shadows.css) - Shadow system and border radius

**Token Categories**:
- **Primary Colors**: `--primary` (#2E5984), `--primary-hover`, `--primary-active`
- **Product Colors**: `--componentone`, `--spread`, `--activereports`, `--documents`, `--wijmo`
- **Text Hierarchy**: `--text-primary`, `--text-secondary`, `--text-muted`
- **Background System**: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- **Spacing Scale**: `--space-1` through `--space-96` (4px to 384px)

**Impact Analysis**: Token changes cascade through all components. Always check component usage before modifying.

### Base Styles (`01-base/`)
**Dependencies**:
- [`reset.css`](styles/01-base/reset.css) - Modern CSS reset
- [`typography.css`](styles/01-base/typography.css) - Base typography using design tokens
- [`utilities.css`](styles/01-base/utilities.css) - Utility classes

**Token Dependencies**: All typography and spacing tokens
**Impact Analysis**: Base changes affect fundamental styling across all pages.

### Layout Systems (`02-layout/`)
**Dependencies**:
- [`containers.css`](styles/02-layout/containers.css) - Responsive container system
- [`grid.css`](styles/02-layout/grid.css) - CSS Grid and Flexbox utilities
- [`sections.css`](styles/02-layout/sections.css) - Section patterns and backgrounds

**Token Dependencies**: Spacing tokens, breakpoint tokens
**Impact Analysis**: Layout changes affect page structure and responsive behavior.

### Theme System (`05-themes/`)
**Critical Override Layer**:
- [`light.css`](styles/05-themes/light.css) - Light mode (default)
- [`dark.css`](styles/05-themes/dark.css) - Dark mode overrides

**Override Pattern**: Uses `[data-theme="dark"]` selectors to override token values
**Token Overrides**: All color tokens, shadow tokens, and component-specific colors
**Impact Analysis**: Theme changes affect all visual components simultaneously.

---

## Component Interaction Map

### Cart Integration
**Primary Component**: [`FloatingCart`](scripts/components/cart.js)
**Integrates With**:
- Product cards (add to cart buttons)
- Pricing tables (purchase flows)
- Bundle configurators (multi-product selection)
- Checkout system (external integration)

**Data Flow**: Product data → Cart state → localStorage → Checkout URL generation

### Filter System Integration
**Primary Component**: [`FloatingFilter`](scripts/components/floating-filter.js)
**Integrates With**:
- [`pricing.js`](scripts/pricing.js) - Product filtering
- [`solutions.js`](scripts/solutions.js) - Solution category filtering
- URL state management (filter persistence)

**Data Flow**: Filter selection → State update → Content filtering → URL update

### Theme System Integration
**Primary Component**: Theme toggle in [`main.js`](scripts/main.js)
**Affects All Components**:
- Visual appearance of all UI elements
- Color scheme consistency
- Accessibility contrast ratios
- User preference persistence

**Data Flow**: User toggle → localStorage → CSS custom properties → Visual update

### Navigation Integration
**Primary Component**: Navigation in [`main.js`](scripts/main.js)
**Integrates With**:
- Theme toggle (header actions)
- Cart button (header actions)
- Mobile menu system
- Scroll-triggered effects

**Data Flow**: User interaction → State change → Visual feedback → Navigation action

---

## Critical Dependencies

### 🚨 STYLING RULE: Token-Only Changes
**Allowed Locations for Style Changes**:
- `styles/00-tokens/` - Design system foundations
- `styles/05-themes/` - Theme-specific overrides

**Forbidden Locations**:
- Component files (`03-components/`) - Never modify directly
- Page files (`04-pages/`) - Never modify directly
- Base files (`01-base/`) - Only modify utilities

**Rationale**: Maintains design system consistency and prevents cascade conflicts.

### Token Change Impact Levels

#### 🔴 VERY HIGH IMPACT
**Tokens**: `--primary`, `--text-primary`, `--bg-primary`
**Affected Components**: ALL components across ALL pages
**Testing Required**: Full regression testing
**Risk**: Site-wide visual breaking changes

#### 🟡 HIGH IMPACT
**Tokens**: `--text-secondary`, `--bg-secondary`, spacing tokens
**Affected Components**: Most components across multiple pages
**Testing Required**: Component-level testing
**Risk**: Layout shifts and readability issues

#### 🟢 MEDIUM IMPACT
**Tokens**: Product colors, accent colors, specific component tokens
**Affected Components**: Specific component families
**Testing Required**: Targeted component testing
**Risk**: Localized visual inconsistencies

#### 🔵 LOW IMPACT
**Tokens**: Shadow tokens, border radius, transition timings
**Affected Components**: Visual enhancements only
**Testing Required**: Visual verification
**Risk**: Minor aesthetic changes

---

## Impact Analysis by Page

### Homepage (`index.html`)
**JavaScript**: [`home.js`](scripts/home.js), [`main.js`](scripts/main.js)
**Key Components**: Hero section, product showcase, stats section, testimonials
**Critical Dependencies**:
- Hero button styling (primary tokens)
- Product card grid (layout tokens)
- Animation system (timing tokens)
**Impact Level**: HIGH - Primary conversion page

### Pricing Page (`pricing/index.html`)
**JavaScript**: [`pricing.js`](scripts/pricing.js), [`floating-filter.js`](scripts/components/floating-filter.js)
**Key Components**: Pricing tables, filter system, comparison tools
**Critical Dependencies**:
- Filter component styling
- Pricing card layouts
- CTA button prominence
**Impact Level**: VERY HIGH - Primary conversion page

### Solutions Page (`solutions/index.html`)
**JavaScript**: [`solutions.js`](scripts/solutions.js), [`floating-filter.js`](scripts/components/floating-filter.js)
**Key Components**: Solution cards, filter system, case studies
**Critical Dependencies**:
- Card grid layouts
- Filter functionality
- Content categorization
**Impact Level**: HIGH - Content discovery page

### Bundles Page (`bundles/index.html`)
**JavaScript**: [`bundles.js`](scripts/bundles.js)
**Key Components**: Bundle cards, pricing calculators, comparison tools
**Critical Dependencies**:
- Bundle card styling
- Price calculation displays
- Multi-product selection
**Impact Level**: HIGH - Conversion page

### Blueprint Pages (`blueprints/*/index.html`)
**JavaScript**: [`blueprints.js`](scripts/blueprints.js)
**Key Components**: Technical diagrams, code examples, resource downloads
**Critical Dependencies**:
- Technical content styling
- Code syntax highlighting
- Resource card layouts
**Impact Level**: MEDIUM - Technical content pages

---

## Change Protocol

### Before Making Changes
1. **Identify Impact Level**: Check token usage across components
2. **Review Dependencies**: Understand which components will be affected
3. **Plan Testing**: Prepare regression test plan based on impact level
4. **Backup Current State**: Document current token values

### During Implementation
1. **Token-Only Changes**: Modify only `00-tokens/` or `05-themes/` files
2. **Incremental Testing**: Test each component as changes are made
3. **Cross-Browser Verification**: Test in multiple browsers
4. **Theme Consistency**: Ensure both light and dark modes work

### After Changes
1. **Full Regression Testing**: Test all affected components
2. **JavaScript Functionality**: Verify all interactive features work
3. **Theme Switching**: Test theme toggle in both directions
4. **Performance Check**: Ensure no performance degradation
5. **Accessibility Audit**: Verify contrast ratios and focus states

### Emergency Rollback
If issues are discovered:
1. **Immediate Revert**: Restore previous token values
2. **Issue Documentation**: Record what went wrong
3. **Root Cause Analysis**: Understand why the change caused issues
4. **Improved Testing**: Enhance testing procedures for next attempt

---

## Component Testing Checklist

### Visual Components
- [ ] All color combinations meet WCAG AA contrast requirements
- [ ] Components render correctly in both light and dark themes
- [ ] Responsive behavior works across all breakpoints
- [ ] Hover and focus states are clearly visible
- [ ] Loading states and animations perform smoothly

### Interactive Components
- [ ] All click/touch interactions work as expected
- [ ] Keyboard navigation follows logical tab order
- [ ] Screen reader announcements are appropriate
- [ ] Error states provide clear feedback
- [ ] Success states confirm user actions

### Integration Testing
- [ ] Components interact correctly with each other
- [ ] State management works across page navigation
- [ ] localStorage persistence functions properly
- [ ] External integrations (checkout, analytics) work
- [ ] Performance remains within acceptable limits

This dependency map serves as the definitive guide for understanding component relationships and the impact of changes within the MESCIUS Solutions website design system.