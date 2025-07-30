# MESCIUS Price Update Workflow

## Overview
This document describes the complete workflow for updating prices in the MESCIUS pricing system, including validation, implementation, and reporting processes.

## Prerequisites
- Access to the MESCIUS codebase
- Python 3.x installed
- Updated `pricelist.json` file with current pricing data
- Browser access for testing implementation

## File Structure
The pricing system consists of these key files:
- `pricelist.json` - Master pricing data source (3,696 SKU mappings)
- `create_complete_validation.py` - Validation data generator
- `complete_pricing_validation.json` - Generated validation data
- `pricing_implementation_tool.html` - Implementation interface
- `pricing_report.html` - Validation report interface

## Workflow Steps

### 1. Update Master Pricing Data

#### 1.1 Update pricelist.json
Replace the existing `pricelist.json` file with the latest pricing data. Ensure it contains:
- `Internal Name` (SKU identifier)
- `Product ID` (numeric product identifier)
- `Euro` (EUR price amount)

**Example structure:**
```json
[
  {
    "Internal Name": "ESD-ENT-STUDIO-R",
    "Product ID": "277382",
    "Euro": 4055,
    "Description": "Product description..."
  }
]
```

### 2. Generate Validation Data

#### 2.1 Run the Validation Generator
```bash
python3 create_complete_validation.py
```

**Expected output:**
```
📋 Loaded 3696 SKU to Product ID and price mappings
✅ Loaded existing enhanced validation data
🔧 Fixed 184 missing products with correct Product IDs
💰 Updated prices from pricelist.json where available
📋 Fixed missing_by_license_type section as well
✅ Created complete_pricing_validation.json
```

#### 2.2 Verify Generated Data
The script creates `complete_pricing_validation.json` with:
- Missing products with correct Product IDs
- EUR prices from pricelist.json
- License type categorization
- Price mismatch analysis

### 3. Validation and Analysis

#### 3.1 Use the Pricing Report Tool
Open `pricing_report.html` in a browser to:
- View comprehensive validation results
- Check missing products by license type
- Identify price mismatches
- Review implementation statistics

**Key metrics to check:**
- Total SKU products: 316
- Missing products: 184
- License type breakdown:
  - Renewals: 60
  - Upgrades: 55
  - Perpetual: 51
  - Other: 12
  - New-license: 5
  - Subscription: 1

#### 3.2 Price Mismatch Analysis
Review any price mismatches reported, such as:
- **Product:** Document Solutions Imaging
- **Expected:** €2,275
- **Actual:** €1,905
- **Difference:** €370

### 4. Implementation

#### 4.1 Use the Implementation Tool
Open `pricing_implementation_tool.html` in a browser for:

**Features available:**
- **License Type Filtering:** Filter products by renewal, upgrade, perpetual, etc.
- **Product Family Selection:** Choose target product family (e.g., ComponentOne, SpreadJS)
- **Tab Management:** Select existing tabs or create new ones
- **HTML Generation:** Generate implementation-ready HTML code

**Implementation process:**
1. Select license type filter (e.g., "renewal")
2. Choose target product family from dropdown
3. Select destination tab or create new tab
4. Review filtered products with correct formatting:
   ```
   ID: 277382 | €4,055 | SKU: ESD-ENT-STUDIO-R
   ```
5. Click "Generate HTML" for implementation code
6. Copy generated HTML to target page

#### 4.2 Product Display Format
The tool ensures correct product information display:
- **Product ID:** Numeric identifier (e.g., 277382)
- **Price:** EUR amount from pricelist.json (e.g., €4,055)
- **SKU:** Internal name identifier (e.g., ESD-ENT-STUDIO-R)
- **License Badge:** Visual indicator for license type

### 5. Page Updates

#### 5.1 Target Pages for Implementation
Update pricing on these pages:
- `pricing/index.html` - Main pricing page
- `bundles/index.html` - Product bundles
- Blueprint pages in `blueprints/*/index.html`
- Solution pages in `solutions/index.html`

#### 5.2 Implementation Guidelines
- Use the generated HTML from the implementation tool
- Maintain consistent product card structure
- Ensure license badges are properly displayed
- Verify EUR prices match pricelist.json data

### 6. Quality Assurance

#### 6.1 Validation Checklist
- [ ] All prices reflect pricelist.json data
- [ ] No "Quote" prices displayed
- [ ] Product IDs are numeric (not SKUs)
- [ ] License type badges are correct
- [ ] EUR formatting is consistent (€X,XXX)

#### 6.2 Testing Process
1. **Load pricing pages** in browser
2. **Verify product displays** match validation data
3. **Check price calculations** for bundles
4. **Test filtering functionality** if applicable
5. **Validate responsive design** on mobile/tablet

### 7. Troubleshooting

#### 7.1 Common Issues

**Problem:** "Quote" prices displayed instead of EUR amounts
**Solution:** Regenerate validation data with updated pricelist.json

**Problem:** SKUs displayed as Product IDs
**Solution:** Check SKU mapping in pricelist.json, ensure Product ID field is populated

**Problem:** Missing products not showing in implementation tool
**Solution:** Verify complete_pricing_validation.json contains missing_from_page data

**Problem:** Price mismatches reported
**Solution:** Update page prices to match pricelist.json values, or verify pricelist.json is correct

#### 7.2 Debug Commands
```bash
# Check validation data structure
python3 -c "import json; print(json.load(open('complete_pricing_validation.json'))['metadata'])"

# Verify pricelist.json format
python3 -c "import json; data=json.load(open('pricelist.json')); print(f'Records: {len(data)}, Sample: {data[0]}')"

# Count missing products by license type
python3 -c "import json; data=json.load(open('complete_pricing_validation.json')); print([(k,len(v)) for k,v in data['missing_by_license_type'].items()])"
```

### 8. Maintenance

#### 8.1 Regular Updates
- **Monthly:** Update pricelist.json with latest pricing
- **Quarterly:** Review missing products for implementation
- **As needed:** Address price mismatches

#### 8.2 File Management
Keep these files synchronized:
- `pricelist.json` (source data)
- `complete_pricing_validation.json` (generated validation)
- Implementation pages (HTML updates)

## Command Reference

### Essential Commands
```bash
# Generate validation data
python3 create_complete_validation.py

# Quick validation check
python3 -c "import json; data=json.load(open('complete_pricing_validation.json')); print(f'Missing: {len(data[\"missing_from_page\"])}, Mismatches: {len(data[\"price_mismatches\"])}')"

# Count products by license type
python3 -c "import json; data=json.load(open('complete_pricing_validation.json')); [print(f'{k}: {len(v)}') for k,v in data['missing_by_license_type'].items()]"
```

### File Operations
```bash
# Backup current validation
cp complete_pricing_validation.json complete_pricing_validation.json.backup

# Validate JSON syntax
python3 -m json.tool pricelist.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Check file sizes
ls -la *.json | grep -E "(pricelist|complete_pricing_validation)"
```

## Integration Points

### HTML Implementation
- Use `data-badge` attribute for license type badges
- Implement consistent pricing card structure
- Maintain responsive design patterns

### CSS Classes
- `.pricing-card` for product containers
- `.license-badge` for license type indicators
- `.price-display` for EUR amount formatting

### JavaScript Integration
- Use existing pricing calculation scripts
- Maintain cart functionality integration
- Preserve existing filtering mechanisms

## Success Metrics

### Validation Success
- Zero "Quote" prices in implementation
- All Product IDs are numeric
- EUR prices match pricelist.json
- License types properly categorized

### Implementation Success
- Pages load without JavaScript errors
- Pricing displays consistently
- Mobile responsiveness maintained
- Cart integration functional

---

**Last Updated:** July 30, 2025  
**Version:** 1.0  
**Maintainer:** MESCIUS Development Team
