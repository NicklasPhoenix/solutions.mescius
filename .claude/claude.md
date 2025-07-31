# CLAUDE CODE PROJECT COORDINATION

## 🎯 PROJECT CONTEXT
Multi-page website with established architecture. Make surgical fixes while preserving all existing functionality and structure.

## 🤖 AVAILABLE SUB-AGENTS

### @code-reviewer
**Expertise:** Code quality, security, performance, best practices  
**Use when:** Reviewing implementations, debugging, optimization  
**Example:** `@code-reviewer analyze this function for potential issues`

### @content-marketer  
**Expertise:** Copywriting, messaging, conversion optimization, user engagement  
**Use when:** Creating website copy, product descriptions, marketing materials  
**Example:** `@content-marketer write compelling homepage hero text`

### @context-manager
**Expertise:** Project coordination, requirements tracking, progress monitoring  
**Use when:** Need project overview, planning next steps, managing scope  
**Example:** `@context-manager what should we prioritize next?`

### @mescius-expert
**Expertise:** Strategic planning for all 9 MESCIUS products, architecture decisions, cross-product integration  
**Use when:** Planning MESCIUS integrations, product selection, licensing strategy  
**Example:** `@mescius-expert plan integration for web app with spreadsheet and reporting needs`

### @spreadjs-developer  
**Expertise:** Technical SpreadJS implementation, React/Angular/Vue integration, performance optimization  
**Use when:** Building spreadsheet functionality, Excel import/export, formula engines  
**Example:** `@spreadjs-developer implement real-time collaborative spreadsheet in React`

## 🚨 CRITICAL PROJECT RULES - NEVER BREAK THESE

### File System Integrity
- **NEVER create new directories** - use existing structure only
- **NEVER rename existing files** - only modify content
- **NEVER delete existing files** - only add or modify
- **NEVER create random utility files** - work within established patterns

### Architecture Constraints
- **USE EXISTING CSS FILES ONLY** - modify, don't create new ones
- **FOLLOW BEM METHODOLOGY** - existing classes use this pattern
- **COPY EXACT STRUCTURE** from `index.html` when adding missing elements
- **MODIFY EXISTING JS FILES ONLY** - or create following established naming patterns

## 📁 EXISTING FILE STRUCTURE (DO NOT CHANGE)
```
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

## 🎯 COORDINATION LOGIC WITH PROJECT CONSTRAINTS

### Automatic Sub-Agent Invocation
I will automatically invoke sub-agents when:
- **Code changes** → @code-reviewer validates against project architecture rules
- **Content creation** → @content-marketer creates copy, then @code-reviewer checks implementation
- **Project planning** → @context-manager ensures scope respects file structure constraints

### Multi-Agent Workflows (Project-Safe)
For complex tasks, coordinate while respecting constraints:
1. **@context-manager** → Clarify requirements within project boundaries
2. **@content-marketer** or implementation → Execute using existing files only
3. **@code-reviewer** → Final validation against architecture rules

## 🛠️ PROJECT-SPECIFIC WORKFLOWS

### Adding Missing Elements (Safe Pattern)
```
1. @context-manager confirm what's missing and why
2. @code-reviewer identify which existing file to copy structure from
3. Implement by copying exact patterns from working pages
4. @code-reviewer verify no architecture rules violated
```

### Content Updates
```
1. @content-marketer create compelling copy
2. @code-reviewer ensure implementation uses existing CSS classes
3. Test across all pages for consistency
```

### Bug Fixes
```
1. @code-reviewer diagnose issue within existing file structure
2. Implement fix by modifying existing files only
3. @code-reviewer verify solution maintains architecture integrity
```

## 🔒 PROTECTED AREAS - DO NOT MODIFY

### Protected Files (NEVER MODIFY)
- `styles/main.css` (import structure)
- `styles/00-tokens/*.css` (design system foundations)
- Logo and image files

### Protected Structures
- CSS Grid layouts (they work)
- Existing working navigation HTML structure
- Current color system and CSS custom properties

## 📋 SAFE MODIFICATION PATTERNS

### Theme Toggle Addition (COPY EXACTLY)
```html
<!-- From index.html, place in .header-content before .menu-toggle -->
<button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
    <span class="theme-toggle-icon light-icon" aria-hidden="true">☀️</span>
    <span class="theme-toggle-icon dark-icon" aria-hidden="true">🌙</span>
</button>
```

### CSS Changes (SAFE APPROACH)
- Only modify property values in existing files
- Add properties to existing rules, don't create new selectors
- Use existing CSS custom properties from 00-tokens/

### JavaScript Additions (SAFE PATTERN)
- Copy function structures from existing `scripts/pages/*.js` files
- Follow existing variable naming from `scripts/core/` and `scripts/components/`
- Create missing page JS only if following established naming pattern

## 🎛️ USAGE PATTERNS

### Explicit Invocation (Recommended)
- `@code-reviewer check this CSS change against our architecture rules`
- `@content-marketer improve this copy while keeping existing HTML structure`
- `@context-manager what can we safely fix without breaking architecture?`

### Let Me Coordinate (Architecture-Aware)
- "Fix the mobile navigation" → I'll start with @code-reviewer to ensure safe CSS-only changes
- "Improve the pricing page" → I'll coordinate @content-marketer + @code-reviewer within constraints
- "Add missing theme toggles" → I'll manage the safe copy-paste workflow

## ✅ VALIDATION CHECKLIST

Before any change:
- [ ] Does this modify existing files only?
- [ ] Does this follow established patterns exactly?
- [ ] Does this preserve existing working functionality?
- [ ] Have I involved @code-reviewer for architecture validation?
- [ ] Will this work consistently across all affected pages?

## 🚫 EMERGENCY STOPS

If any agent suggests:
- Creating new directories or CSS files
- Renaming existing files
- Restructuring working layouts
- Adding new build processes

**STOP and rephrase the prompt more specifically within project constraints.**

## 🎯 SUCCESS CRITERIA

Every change must:
1. **Solve the specific issue** without side effects
2. **Maintain architecture integrity** - no new files/directories
3. **Follow established patterns** exactly
4. **Pass @code-reviewer validation** against project rules
5. **Work across all pages** and themes consistently
