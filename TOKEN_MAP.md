# CSS TOKEN DEPENDENCY MAP - AGENT REFERENCE

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