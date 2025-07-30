#!/usr/bin/env python3
"""
MESCIUS Pricing Validator
Consolidates Excel -> pricelist.json -> pricing/index.html validation
Single source of truth system
"""

import pandas as pd
import json
import re
from difflib import SequenceMatcher
from datetime import datetime

def categorize_license_type(product_name, internal_name=''):
    """Categorize product into license type based on name and internal name"""
    name_lower = product_name.lower()
    internal_lower = internal_name.lower() if internal_name else ''
    
    # Check for perpetual licenses
    if 'perpetual' in name_lower:
        return 'perpetual'
    
    # Check for renewals/maintenance
    if any(keyword in name_lower for keyword in ['renewal', 'maintenance']):
        return 'renewal'
    if any(keyword in internal_lower for keyword in ['-r', 'renewal']):
        return 'renewal'
    
    # Check for upgrades
    if 'upgrade' in name_lower:
        return 'upgrade'
    if any(keyword in internal_lower for keyword in ['-u', 'upgrade']):
        return 'upgrade'
    
    # Check for subscription
    if any(keyword in name_lower for keyword in ['subscription', 'annual', 'monthly']):
        return 'subscription'
    
    # Default to new license
    return 'new-license'

def extract_eur_price(eur_value):
    """Extract numeric EUR price from string or number"""
    if eur_value is None or str(eur_value).strip() in ['-', '€ -', '', 'nan']:
        return None
    
    try:
        # Handle if it's already a number
        if isinstance(eur_value, (int, float)):
            return float(eur_value)
        
        # Handle string with currency symbols
        eur_str = str(eur_value).replace('€', '').replace(' ', '').replace(',', '').strip()
        if eur_str and eur_str != '-':
            return float(eur_str)
    except:
        pass
    return None

def extract_usd_price(usd_string):
    """Extract numeric USD price from string"""
    if not usd_string or str(usd_string).strip() in ['-', '$ -', '']:
        return None
    
    try:
        usd_str = str(usd_string).replace('$', '').replace(' ', '').replace(',', '').strip()
        if usd_str and usd_str != '-':
            return float(usd_str)
    except:
        pass
    return None

def similarity_score(a, b):
    """Calculate similarity between two product names"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def normalize_product_name(name):
    """Normalize product name for better matching"""
    if not name:
        return ""
    
    # Convert to lowercase and clean up
    normalized = str(name).lower()
    
    # Remove common variations
    replacements = {
        'componentone': 'component one',
        'activereports': 'active reports',
        'spreadjs': 'spread js',
        'document solutions': 'documents',
        'grapecity documents': 'documents',
        '.net': 'net',
        'developer license': 'developer',
        'new license': '',
        'w/ maintenance': '',
        'with maintenance': '',
        'edition': '',
        'v8': '',
        'v18': '',
        'v19': '',
        'v20': '',
        'v21': '',
        'v22': '',
        'v23': '',
        'v24': '',
        'v25': ''
    }
    
    for old, new in replacements.items():
        normalized = normalized.replace(old, new)
    
    # Remove extra spaces
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    
    return normalized

def load_excel_products(sku_file):
    """Load current products with SKUs from clean SKU.xlsx file"""
    print(f"📊 Loading current products with SKUs from {sku_file}...")
    
    try:
        # Read the clean SKU.xlsx file
        df = pd.read_excel(sku_file)
        
        print(f"SKU.xlsx shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        # Extract products with SKUs
        sku_products = []
        
        for _, row in df.iterrows():
            product_name = row.get('Product name')
            sku = row.get('SKU')
            list_price = row.get('List price')
            
            # Skip if missing essential data
            if pd.isna(product_name) or pd.isna(sku) or pd.isna(list_price):
                continue
            
            # Convert price to float
            try:
                price_usd = float(list_price)
            except (ValueError, TypeError):
                continue
            
            # Clean up product name and SKU
            product_name = str(product_name).strip()
            sku = str(sku).strip()
            
            # Categorize license type and include all types
            license_type = categorize_license_type(product_name, row.get('SKU', ''))
            
            excel_products.append({
                'product_name': product_name,
                'sku': row['SKU'],
                'list_price_usd': list_price,
                'license_type': license_type,
                'comment': row.get('comment', '')
            })
        
        print(f"✅ Loaded {len(sku_products)} current products with SKUs from clean Excel")
        
        # Show first few products for verification
        if sku_products:
            print("First few products:")
            for i, product in enumerate(sku_products[:5]):
                print(f"  {i+1}. {product['name'][:50]}... | SKU: {product['sku']} - ${product['price_usd']}")
        
        return sku_products
        
    except Exception as e:
        print(f"❌ Error loading SKU file: {e}")
        return []

def load_pricelist_json(json_file):
    """Load all products from pricelist.json"""
    print(f"📋 Loading product database from {json_file}...")
    
    try:
        with open(json_file, 'r') as f:
            products = json.load(f)
        
        print(f"✅ Loaded {len(products)} products from pricelist.json")
        return products
        
    except Exception as e:
        print(f"❌ Error loading pricelist.json: {e}")
        return []

def match_products(excel_products, json_products):
    """Match Excel SKU products to pricelist.json using exact SKU matching"""
    print(f"🔍 Matching {len(excel_products)} current SKU products to product database...")
    
    # Create lookup by Internal Name (SKU equivalent)
    pricelist_by_sku = {}
    for product in json_products:
        internal_name = product.get('Internal Name')
        if internal_name:
            pricelist_by_sku[internal_name.strip()] = product
    
    print(f"📋 Pricelist has {len(pricelist_by_sku)} products with Internal Names (SKUs)")
    
    matched_products = []
    unmatched_products = []
    
    for excel_product in excel_products:
        sku = excel_product['sku']
        
        if sku in pricelist_by_sku:
            pricelist_match = pricelist_by_sku[sku]
            
            # Extract EUR price
            eur_price = extract_eur_price(pricelist_match.get('Euro'))
            usd_price = extract_usd_price(pricelist_match.get('U.S. Dollar'))
            
            if eur_price:
                matched_products.append({
                    'excel_name': excel_product['name'],
                    'excel_price_usd': excel_product['price_usd'],
                    'sku': sku,
                    'matched_name': pricelist_match.get('Product Name', ''),
                    'product_id': pricelist_match.get('Internal Product ID'),
                    'price_eur': eur_price,
                    'price_usd_json': usd_price,
                    'match_method': 'exact_sku',
                    'internal_name': pricelist_match.get('Internal Name')
                })
            else:
                unmatched_products.append(excel_product)
        else:
            unmatched_products.append(excel_product)
    
    print(f"✅ SKU matched: {len(matched_products)} products")
    print(f"⚠️  SKU unmatched: {len(unmatched_products)} products")
    
    # Show matching examples
    if matched_products:
        print(f"\n📝 Sample SKU matches:")
        for match in matched_products[:5]:
            print(f"  Excel: {match['excel_name'][:40]}...")
            print(f"  SKU:   {match['sku']}")
            print(f"  JSON:  {match['matched_name'][:40]}...")
            print(f"  ID: {match['product_id']} | EUR: €{match['price_eur']}")
            print()
    
    if unmatched_products:
        print(f"\n❌ Unmatched SKUs (sample):")
        for product in unmatched_products[:5]:
            print(f"  SKU: {product['sku']} | {product['name'][:50]}...")
    
    return matched_products, unmatched_products

def extract_pricing_page_products(pricing_file):
    """Extract products and prices from pricing/index.html"""
    print(f"🌐 Analyzing pricing page {pricing_file}...")
    
    try:
        with open(pricing_file, 'r') as f:
            html_content = f.read()
        
        # Extract product IDs and prices from data-product-id attributes and price displays
        products = {}
        
        # Look for product cards with IDs and prices
        # Pattern: data-product-id="12345" ... €1234
        id_pattern = r'data-product-id=["\'](\d+)["\']'
        price_pattern = r'€(\d{1,3}(?:,\d{3})*|\d+)'
        
        # Find all product IDs
        product_ids = re.findall(id_pattern, html_content)
        
        # For each ID, try to find associated price nearby in the HTML
        for product_id in product_ids:
            # Find the section containing this product ID
            id_pos = html_content.find(f'data-product-id="{product_id}"')
            if id_pos != -1:
                # Look for price in surrounding context (within 1000 chars)
                context_start = max(0, id_pos - 500)
                context_end = min(len(html_content), id_pos + 500)
                context = html_content[context_start:context_end]
                
                prices = re.findall(price_pattern, context)
                if prices:
                    # Take the first valid price found
                    price_str = prices[0].replace(',', '')
                    try:
                        price = float(price_str)
                        products[int(product_id)] = price
                    except:
                        pass
        
        print(f"✅ Found {len(products)} products on pricing page")
        return products
        
    except Exception as e:
        print(f"❌ Error reading pricing page: {e}")
        return {}

def validate_pricing(matched_products, pricing_page_products):
    """Compare matched products against pricing page"""
    print(f"🔍 Validating against pricing page...")
    
    # Create lookup by product ID (normalize to int for comparison)
    matched_by_id = {}
    for p in matched_products:
        if p['product_id']:
            try:
                # Convert to int for consistent comparison
                id_int = int(p['product_id'])
                matched_by_id[id_int] = p
            except (ValueError, TypeError):
                pass
    
    exact_matches = []
    price_mismatches = []
    missing_from_page = []
    unknown_on_page = []
    
    # Check pricing page against matched products
    for product_id, page_price in pricing_page_products.items():
        product_id_int = int(product_id)  # Ensure it's an int
        
        if product_id_int in matched_by_id:
            matched = matched_by_id[product_id_int]
            eur_price = matched['price_eur']
            
            # Allow small differences (rounding, etc.)
            diff = abs(eur_price - page_price)
            if diff <= 10:
                exact_matches.append({
                    'product_id': product_id_int,
                    'name': matched['excel_name'],
                    'price': page_price,
                    'matched_name': matched['matched_name']
                })
            else:
                price_mismatches.append({
                    'product_id': product_id_int,
                    'name': matched['excel_name'],
                    'page_price': page_price,
                    'expected_price': eur_price,
                    'difference': diff,
                    'matched_name': matched['matched_name']
                })
        else:
            unknown_on_page.append({
                'product_id': product_id_int,
                'page_price': page_price
            })
    
    # Check for products missing from pricing page
    pricing_page_ids = set(int(pid) for pid in pricing_page_products.keys())
    for matched in matched_products:
        if matched['product_id']:
            try:
                matched_id_int = int(matched['product_id'])
                if matched_id_int not in pricing_page_ids:
                    missing_from_page.append(matched)
            except (ValueError, TypeError):
                # If ID can't be converted to int, consider it missing
                missing_from_page.append(matched)
    
    return {
        'exact_matches': exact_matches,
        'price_mismatches': price_mismatches,
        'missing_from_page': missing_from_page,
        'unknown_on_page': unknown_on_page
    }

def main():
    print("🔧 MESCIUS Pricing Validator - Single Source of Truth")
    print("=" * 60)
    
    # Configuration
    sku_file = "SKU.xlsx"  # Clean SKU file as source of truth
    json_file = "pricelist.json"
    pricing_file = "pricing/index.html"
    
    # Step 1: Load current products from clean SKU file
    excel_products = load_excel_products(sku_file)
    if not excel_products:
        print("❌ Failed to load Excel products")
        return
    
    # Step 2: Load product database
    json_products = load_pricelist_json(json_file)
    if not json_products:
        print("❌ Failed to load pricelist.json")
        return
    
    # Step 3: Match Excel products to get EUR prices and IDs
    matched_products, unmatched_products = match_products(excel_products, json_products)
    
    # Step 4: Extract products from pricing page
    pricing_page_products = extract_pricing_page_products(pricing_file)
    
    # Step 5: Validate everything
    validation = validate_pricing(matched_products, pricing_page_products)
    
    # Results
    print("\n" + "=" * 60)
    print("📋 VALIDATION RESULTS")
    print("=" * 60)
    
    print(f"Excel products (current catalog): {len(excel_products)}")
    print(f"Successfully matched: {len(matched_products)}")
    print(f"Could not match: {len(unmatched_products)}")
    print(f"Products on pricing page: {len(pricing_page_products)}")
    print()
    
    print(f"✅ Exact matches: {len(validation['exact_matches'])}")
    print(f"⚠️  Price mismatches: {len(validation['price_mismatches'])}")
    print(f"❌ Missing from page: {len(validation['missing_from_page'])}")
    print(f"❓ Unknown on page: {len(validation['unknown_on_page'])}")
    
    # Show details
    if validation['price_mismatches']:
        print(f"\n⚠️  PRICE MISMATCHES:")
        for mismatch in validation['price_mismatches'][:10]:
            print(f"  • {mismatch['name']} (ID: {mismatch['product_id']})")
            print(f"    Page: €{mismatch['page_price']}, Expected: €{mismatch['expected_price']}")
    
    if validation['missing_from_page']:
        print(f"\n❌ MISSING FROM PRICING PAGE:")
        for missing in validation['missing_from_page'][:10]:
            print(f"  • {missing['excel_name']} - €{missing['price_eur']} (ID: {missing['product_id']})")
    
    if unmatched_products:
        print(f"\n🔍 COULD NOT MATCH TO DATABASE:")
        for unmatched in unmatched_products[:10]:
            print(f"  • {unmatched['name']} - ${unmatched['price_usd']}")
    
    # Save consolidated results
    results = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'excel_products': len(excel_products),
            'matched_products': len(matched_products),
            'unmatched_products': len(unmatched_products),
            'pricing_page_products': len(pricing_page_products),
            'exact_matches': len(validation['exact_matches']),
            'price_mismatches': len(validation['price_mismatches']),
            'missing_from_page': len(validation['missing_from_page']),
            'unknown_on_page': len(validation['unknown_on_page'])
        },
        'matched_products': matched_products,
        'unmatched_products': unmatched_products,
        'validation': validation
    }
    
    with open('pricing_validation.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Results saved to pricing_validation.json")

if __name__ == "__main__":
    main()