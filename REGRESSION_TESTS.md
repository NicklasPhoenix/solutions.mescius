# AGENT REGRESSION TESTING PROTOCOL

## MANDATORY TESTING AFTER ANY CSS CHANGES

### THEME SYSTEM TESTING:
- [ ] **Theme Toggle**: Click theme toggle - no flashing, correct mode applied
- [ ] **Initial Load**: Page loads in correct default state (no "appears light but isn't")
- [ ] **Icon Logic**: Light mode shows moon icon, dark mode shows sun icon
- [ ] **Navigation Persistence**: Theme preserved when switching pages
- [ ] **Both Directions**: Light→Dark and Dark→Light both work

### COLOR TOKEN REGRESSION TESTS:

#### If Changed `--primary` token:
- [ ] **Floating Cart**: Text is readable in dark mode (should be white, not primary color)
- [ ] **Buttons**: All buttons still have correct colors
- [ ] **Accents**: Links and highlights still visible
- [ ] **Cards**: Product cards maintain color scheme

#### If Changed `--text-color` token:
- [ ] **All Pages**: Body text readable in both light/dark modes
- [ ] **Cards**: Pricing cards, bundle cards, product cards readable
- [ ] **Navigation**: Menu items visible
- [ ] **Footer**: Footer text visible

#### If Changed `--button-*` tokens:
- [ ] **Hero Button**: Visible in BOTH light and dark modes (critical issue)
- [ ] **Cart Buttons**: Add to cart, quantity controls work
- [ ] **Pricing Buttons**: New Licenses, Renewals buttons properly styled
- [ ] **Navigation**: Menu buttons and theme toggle

#### If Changed `--bg-color` token:
- [ ] **Page Backgrounds**: All pages have correct backgrounds
- [ ] **Card Backgrounds**: Cards stand out from page background
- [ ] **Modal Backgrounds**: Overlays and popups visible

### LAYOUT TOKEN REGRESSION TESTS:

#### If Changed Spacing Tokens:
- [ ] **Card Alignment**: "Add to cart" buttons at same level across all cards
- [ ] **Cart Layout**: "Your Cart" text and "-" button have proper spacing
- [ ] **Cart Width**: Collapsed cart same width as expanded cart
- [ ] **OEM Cards**: "Contact for OEM Quote" buttons aligned consistently

#### If Changed Card Tokens:
- [ ] **Pricing Page**: All pricing cards properly aligned
- [ ] **Bundle Page**: Bundle cards maintain structure
- [ ] **Product Cards**: Homepage product showcase cards aligned

### COMPONENT-SPECIFIC TESTS:

#### Floating Cart:
- [ ] **Visibility**: Cart text readable in dark mode
- [ ] **Functionality**: X button hides cart (not just console log)
- [ ] **Reopening**: Header cart button reopens hidden cart
- [ ] **Width**: Collapsed and expanded widths consistent
- [ ] **Spacing**: Proper space between "Your Cart" and "-" button

#### Floating Filter:
- [ ] **Close Behavior**: Only closes on collapse button click, not outside clicks
- [ ] **Functionality**: Filter options work correctly
- [ ] **Styling**: Filter maintains visual consistency

#### Navigation:
- [ ] **Theme Toggle**: Works correctly with proper icons
- [ ] **Menu Items**: All navigation links visible and functional
- [ ] **Mobile Menu**: Responsive navigation works

#### Cards (All Types):
- [ ] **Pricing Cards**: No dark blue on dark blue text
- [ ] **Bundle Cards**: Have dark mode styling (major issue if missing)
- [ ] **Product Cards**: Maintain alignment and readability
- [ ] **OEM Cards**: Consistently aligned across page

### PAGE-SPECIFIC TESTS:

#### Homepage (`index.html`):
- [ ] **Hero Button**: Visible and functional in both modes
- [ ] **Product Showcase**: Cards properly styled
- [ ] **Theme Toggle**: Works without page flash

#### Pricing Page (`pricing/index.html`):
- [ ] **Card Text**: No dark blue on dark backgrounds
- [ ] **Button Alignment**: "Add to cart" buttons level
- [ ] **License Buttons**: "New Licenses"/"Renewals" properly sized
- [ ] **Info Buttons**: "i" buttons functional (should open modals)
- [ ] **Hero Section**: Has proper styling

#### Bundles Page (`bundles/index.html`):
- [ ] **Dark Mode**: Bundle cards have dark mode styling
- [ ] **OEM Alignment**: Quote cards properly aligned
- [ ] **Custom Pricing**: Text readable in dark mode

#### Solutions Page (`solutions/index.html`):
- [ ] **Filter Integration**: Floating filter works with solutions
- [ ] **Card Grid**: Solution cards maintain layout

### PSEUDO ELEMENT CHECK:
- [ ] **Product Cards**: NO `.product-card::before` thin lines
- [ ] **Floating Cart**: NO pseudo element decorations
- [ ] **Hover States**: NO pseudo elements on hover
- [ ] **Default States**: NO unwanted pseudo element lines

### CROSS-BROWSER TESTING:
- [ ] **Chrome**: All functionality works
- [ ] **Firefox**: Theme switching and cart work
- [ ] **Safari**: No layout breaks
- [ ] **Mobile**: Responsive design maintained

### PERFORMANCE CHECKS:
- [ ] **No New Issues**: Changes don't slow page load
- [ ] **CSS Size**: No unnecessary duplication added
- [ ] **Theme Switch Speed**: Toggle remains fast

## CRITICAL FAILURE INDICATORS:
If ANY of these occur, changes must be reverted immediately:
- ❌ Hero button becomes invisible in either mode
- ❌ Theme toggle stops working or causes flashing
- ❌ Cart text becomes unreadable in dark mode
- ❌ Cards lose alignment across any page
- ❌ Theme doesn't persist across page navigation
- ❌ Bundle cards lose dark mode styling
- ❌ Any text becomes dark blue on dark backgrounds

## AGENT REPORTING REQUIREMENTS:
After testing, report:
1. Which tokens were changed
2. Which components were affected
3. Which tests passed/failed
4. Any unexpected side effects observed
5. Confirmation that documented issues weren't recreated