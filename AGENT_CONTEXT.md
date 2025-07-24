# MESCIUS Solutions Website - Agent Context & Development Guide

## 🏢 PROJECT OVERVIEW

### Project Context
This is a sophisticated **B2B e-commerce platform** for MESCIUS developer tools and solutions. The website serves as a comprehensive digital storefront featuring:

- **Advanced Shopping Cart System**: Full e-commerce functionality with localStorage persistence and checkout integration
- **Dynamic Product Filtering**: Advanced filtering system for pricing and solutions pages with real-time updates
- **Professional Theme System**: Sophisticated light/dark mode with system preference detection
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Animation Framework**: Scroll-based animations and interactive effects using Intersection Observer

### Business Purpose
- Showcase MESCIUS developer tools (SpreadJS, ComponentOne, ActiveReports, etc.)
- Provide solution blueprints for various industries (healthcare, finance, logistics)
- Enable direct product purchases and bundle configurations
- Support enterprise sales with OEM and SaaS options

## 🏗️ TECHNICAL ARCHITECTURE

### Design System Foundation
**Token-Based ITCSS Methodology**:
```
styles/
├── 00-tokens/     ← CSS custom properties (CHANGE THESE ONLY)
├── 01-base/       ← Reset, typography, utilities
├── 02-layout/     ← Containers, grid, sections
├── 03-components/ ← UI components
├── 04-pages/      ← Page-specific styles
└── 05-themes/     ← Light/dark theme overrides
```

### JavaScript Architecture
**Component-Driven Development**:
- **Vanilla JavaScript**: No frameworks, pure ES6+ classes
- **Class-Based Components**: Modular, reusable component system
- **Event Delegation**: Performance-optimized event handling
- **Intersection Observer**: Efficient scroll-based animations
- **localStorage Integration**: Cart persistence and user preferences

### Performance Optimizations
- **Lazy Loading**: Images and components load on demand
- **Event Delegation**: Minimized event listeners
- **CSS Custom Properties**: Dynamic theming without JavaScript
- **Intersection Observer**: Efficient scroll detection
- **Component Caching**: Reusable component instances

## 🛒 CORE CAPABILITIES

### Shopping Cart System
**Location**: [`scripts/components/cart.js`](scripts/components/cart.js), [`styles/03-components/floating-cart.css`](styles/03-components/floating-cart.css)
- **Persistent Storage**: localStorage-based cart state
- **Dynamic Updates**: Real-time price calculations
- **Checkout Integration**: Direct purchase flow
- **Responsive Design**: Mobile-optimized interface
- **Bundle Support**: Complex product configurations

### Advanced Filtering System
**Location**: [`scripts/components/floating-filter.js`](scripts/components/floating-filter.js), [`styles/03-components/floating-filter.css`](styles/03-components/floating-filter.css)
- **Multi-Criteria Filtering**: Price, category, features
- **Real-Time Updates**: Instant results without page reload
- **URL State Management**: Shareable filtered views
- **Mobile Optimization**: Touch-friendly interface

### Theme System
**Location**: [`styles/05-themes/`](styles/05-themes/), [`scripts/main.js`](scripts/main.js)
- **Three-Mode Support**: System, light, dark preferences
- **System Detection**: Automatic OS preference detection
- **Persistent State**: Theme choice saved across sessions
- **Component Integration**: All components theme-aware

### Animation Framework
**Location**: [`scripts/components/animations.js`](scripts/components/animations.js), [`styles/03-components/animations.css`](styles/03-components/animations.css)
- **Scroll Animations**: Intersection Observer-based
- **Performance Optimized**: Hardware acceleration
- **Accessibility Compliant**: Respects reduced motion preferences
- **Modular System**: Reusable animation classes

## 🚨 DEVELOPMENT CONSTRAINTS

### STRICT ITCSS COMPLIANCE
**ABSOLUTE FORBIDDEN ACTIONS**:
- ❌ Component-specific CSS overrides (`.cart-total { color: white; }`)
- ❌ Inline styles (`style="color: white"`) 
- ❌ !important declarations (`color: white !important`)
- ❌ New CSS properties outside [`/00-tokens/`](styles/00-tokens/)
- ❌ Duplicate color/spacing/layout definitions
- ❌ Adding pseudo elements without token system
- ❌ Modifying files outside assigned component scope

### Token System Rules
**ONLY MODIFY**:
- **Colors**: [`/00-tokens/colors.css`](styles/00-tokens/colors.css) or [`/05-themes/light.css|dark.css`](styles/05-themes/)
- **Spacing**: [`/00-tokens/spacing.css`](styles/00-tokens/spacing.css)
- **Typography**: [`/00-tokens/typography.css`](styles/00-tokens/typography.css)
- **Shadows**: [`/00-tokens/shadows.css`](styles/00-tokens/shadows.css)

### Mandatory Process
1. **READ [`TOKEN_MAP.md`](TOKEN_MAP.md) FIRST** - Understand token dependencies
2. **IDENTIFY EXACT TOKEN FILE** - Find correct token location
3. **MAP ALL USAGE** - Find every component using the token
4. **ANALYZE CASCADE** - Predict impact of changes
5. **IMPLEMENT SURGICALLY** - Change only in token files
6. **TEST REGRESSION** - Follow [`REGRESSION_TESTS.md`](REGRESSION_TESTS.md) checklist

## 🐛 CURRENT CRITICAL ISSUES

### Theme System Conflicts
**Three-Mode Issue**:
- Default, light, AND dark modes causing conflicts
- Page loads in wrong theme state
- Theme toggle icons display backwards
- Theme loss when navigating between pages

### Color Visibility Problems
**Dark Mode Issues**:
- Dark blue fonts on dark backgrounds (pricing cards)
- Cart total text using wrong color token
- Footer hover animations invisible
- Hero buttons invisible in light mode
- Bundle cards missing dark mode styling entirely

### Cart Functionality Issues
**JavaScript Problems**:
- X button logs 'hide cart' but doesn't close cart
- Cart width inconsistency between collapsed/expanded states
- Add to cart buttons misaligned across product cards

### Layout Token Problems
**Spacing Issues**:
- Card button alignment inconsistencies
- OEM quote cards at different levels
- Cart spacing and padding irregularities

## 🤖 AGENT CAPABILITIES

### What the Agent CAN Do
**Token-Level Changes**:
- Modify CSS custom properties in [`/00-tokens/`](styles/00-tokens/)
- Update theme definitions in [`/05-themes/`](styles/05-themes/)
- Adjust component behavior through token system

**JavaScript Component Modifications**:
- Update component logic in [`/scripts/components/`](scripts/components/)
- Fix event handling and state management
- Improve performance and accessibility

**HTML Content Updates**:
- Modify page content and structure
- Update component markup
- Improve semantic HTML

**Documentation Maintenance**:
- Update technical documentation
- Maintain component dependencies
- Track regression test results

### What the Agent SHOULD Do
**Quality Assurance**:
- Always test changes across light/dark themes
- Verify cart functionality after modifications
- Check responsive behavior on mobile
- Validate accessibility compliance

**Regression Testing**:
- Follow [`REGRESSION_TESTS.md`](REGRESSION_TESTS.md) protocol
- Test all related components after token changes
- Verify theme switching works bidirectionally
- Confirm no visual regressions introduced

## 📋 QUALITY STANDARDS

### CSS Linting
**Stylelint Configuration**: [`.stylelintrc.json`](.stylelintrc.json)
- ITCSS order enforcement
- Custom property validation
- No duplicate selectors
- Performance rule compliance

### Testing Protocols
**Comprehensive Testing Required**:
- **Cross-Theme Testing**: Light/dark mode verification
- **Responsive Testing**: Mobile, tablet, desktop breakpoints
- **Cart Functionality**: Add, remove, persist, checkout flow
- **Filter System**: All filter combinations and edge cases
- **Animation Performance**: 60fps requirement, reduced motion support

### Accessibility Compliance
**WCAG 2.1 AA Standards**:
- Color contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Reduced motion preferences

### Performance Requirements
**Core Web Vitals**:
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **JavaScript Bundle**: < 100KB compressed

## 🔧 EMERGENCY PROTOCOLS

### Stop Conditions
**STOP IMMEDIATELY if**:
- Need to add `!important` to override something
- Want to add component-specific colors/spacing
- Token change affects more than 5 components
- Can't find the right token to modify
- Solution requires new CSS properties outside token system

### Recovery Process
1. **Revert Changes**: Return to last known good state
2. **Analyze Impact**: Review [`COMPONENT_DEPENDENCIES.md`](COMPONENT_DEPENDENCIES.md)
3. **Consult Documentation**: Check [`TOKEN_MAP.md`](TOKEN_MAP.md) for alternatives
4. **Request Guidance**: Ask for architectural review

## 📚 REQUIRED READING

**Before ANY modifications, agents must read**:
- [`TOKEN_MAP.md`](TOKEN_MAP.md) - Token dependency mapping
- [`REGRESSION_TESTS.md`](REGRESSION_TESTS.md) - Testing protocols
- [`COMPONENT_DEPENDENCIES.md`](COMPONENT_DEPENDENCIES.md) - Component relationships
- [`DESIGN_SYSTEM_ANALYSIS.md`](DESIGN_SYSTEM_ANALYSIS.md) - Architecture overview

## ✅ SUCCESS CRITERIA

**All changes must meet these requirements**:
- [ ] Problem fixed using token system only
- [ ] No new component-specific CSS added
- [ ] All related components still work
- [ ] Theme switching works in both directions
- [ ] No visual regressions in light/dark modes
- [ ] Cart functionality preserved
- [ ] Navigation theme persistence maintained
- [ ] Performance metrics maintained
- [ ] Accessibility standards met
- [ ] Mobile responsiveness verified

---

**This document serves as the definitive guide for understanding the MESCIUS Solutions website project architecture, constraints, and development protocols. All modifications must comply with these standards to maintain system integrity and user experience quality.**