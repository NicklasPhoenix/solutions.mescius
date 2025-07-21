# Copilot Instructions for MESCIUS Codebase

## Overview
This document provides essential guidelines for AI coding agents to be productive in the MESCIUS codebase. It outlines the architecture, workflows, conventions, and integration points specific to this project.

## Big Picture Architecture
The MESCIUS project is a modern UX design system for a website. It is structured around reusable components, tokenized design foundations, and page-specific styles. Key directories include:

- `styles/`: Contains CSS files organized into tokens, base styles, layout systems, components, pages, and themes.
- `scripts/`: JavaScript files for dynamic functionality, including blueprint navigation, pricing calculations, and solution-specific logic.
- `blueprints/`: Specialized pages for different business use cases.
- `bundles/`: Pages showcasing product bundles.
- `solutions/`: Pages detailing solutions offered.

### Key Files
- `index.html`: Main entry point for the website.
- `styles/main.css`: Aggregates all CSS files.
- `scripts/main.js`: Central JavaScript file for shared functionality.

## Developer Workflows
### Build and Debug
This project does not include a build system or task runner. Development involves direct editing of HTML, CSS, and JavaScript files. Use browser developer tools for debugging.

### Testing
No automated tests are defined. Testing is manual and involves verifying functionality across pages and components.

## Project-Specific Conventions
- **CSS Architecture**: Follow the token-based design system outlined in `DESIGN_SYSTEM_ANALYSIS.md`. Ensure new styles fit within the existing structure.
- **Dark Mode Implementation**: Use `[data-theme="dark"]` selector for dark mode styles in `styles/05-themes/dark.css`. All components should have corresponding dark mode styles.
- **Pricing Cards**: Use `data-badge` attribute for pricing card badges. Supported values: "Best Value", "Popular", "Recommended".
- **JavaScript Patterns**: Use modular scripts for page-specific functionality. Avoid inline JavaScript in HTML files.
- **File Naming**: Use descriptive names for files and directories to reflect their purpose.

## Integration Points
- **External Dependencies**: None specified. All functionality is implemented using native HTML, CSS, and JavaScript.
- **Cross-Component Communication**: Ensure consistency between styles and scripts across pages. For example, navigation styles in `styles/03-components/navigation.css` should align with functionality in `scripts/solutions.js`.

## Examples
### Adding a New Component
1. Create a new CSS file in `styles/03-components/`.
2. Add corresponding JavaScript functionality in `scripts/components/`.
3. Update relevant HTML files to include the new component.

### Updating a Page
1. Modify the HTML file in the appropriate directory (e.g., `blueprints/` for blueprint pages).
2. Update styles in `styles/04-pages/`.
3. Add or update JavaScript functionality in `scripts/`.

## References
- `DESIGN_SYSTEM_ANALYSIS.md`: Detailed implementation guide for the design system.
- `styles/`: CSS architecture.
- `scripts/`: JavaScript functionality.

---

Feedback is welcome to improve these instructions.
