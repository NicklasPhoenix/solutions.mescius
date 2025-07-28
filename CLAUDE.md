# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### CSS Linting
- `npm run lint:css` - Lint CSS files using stylelint
- `npm run lint:css:fix` - Automatically fix CSS linting issues

### Development Notes
- No build system or task runner - development involves direct editing of HTML, CSS, and JavaScript files
- Use browser developer tools for debugging
- Testing is manual - verify functionality across pages and components

## Architecture Overview

This is a modern UX design system for the MESCIUS website built with native HTML, CSS, and JavaScript. The codebase follows a token-based design system with clear separation of concerns.

### Directory Structure

**CSS Architecture (styles/)**
- `00-tokens/` - Design system foundations (colors, typography, spacing, shadows)
- `01-base/` - Reset styles, typography base, utilities
- `02-layout/` - Grid systems, containers, sections
- `03-components/` - Reusable UI components (buttons, cards, navigation, etc.)
- `04-pages/` - Page-specific styles (home, pricing, solutions, blueprints, bundles)
- `05-themes/` - Light/dark mode theme definitions

**JavaScript Architecture (scripts/)**
- `main.js` - Core initialization and shared functionality
- `components/` - Modular component scripts (animations, cart, modals, forms)
- Page-specific scripts (home.js, pricing.js, solutions.js, blueprints.js, bundles.js)

**Content Structure**
- `blueprints/` - Specialized business use case pages
- `bundles/` - Product bundle showcase pages
- `solutions/` - Solution detail pages

### Key Integration Points

**CSS Import Chain**: All styles flow through `styles/main.css` which imports files in dependency order (tokens → base → layout → components → pages → themes)

**JavaScript Initialization**: `scripts/main.js` coordinates:
- Theme system initialization
- Navigation setup
- Modal management
- Scroll effects
- Shopping cart functionality
- Animation system startup

**Theme System**: Uses `[data-theme="dark"]` selector for dark mode. All components must have corresponding dark mode styles in `styles/05-themes/dark.css`

## Development Conventions

### CSS
- Follow the token-based design system - use existing CSS custom properties from `00-tokens/`
- New components go in `03-components/` with corresponding dark mode styles
- Page-specific styles go in `04-pages/`
- Use descriptive class names that reflect component purpose

### JavaScript
- Use modular scripts for page-specific functionality
- Avoid inline JavaScript in HTML files
- Components should initialize through the main.js coordination system
- Use modern JavaScript features (ES6+)

### HTML
- Use `data-badge` attribute for pricing card badges (values: "Best Value", "Popular", "Recommended")
- Maintain semantic HTML structure
- Include proper meta tags for SEO and social sharing

### File Organization
- Use descriptive names that reflect file purpose
- Follow existing directory patterns
- Keep related functionality grouped together

## Important Files to Understand

- `styles/main.css:1-50` - CSS import structure and global setup
- `scripts/main.js:1-50` - Application initialization flow
- `.github/copilot-instructions.md` - Extended development guidelines
- Individual component files in `styles/03-components/` and `scripts/components/`