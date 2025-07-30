#!/usr/bin/env python3
"""
MESCIUS Complete Pricing Validation Generator
Creates comprehensive validation data with missing products, price validation, and license type analysis.
Uses pricelist.json as the authoritative source for Product IDs and EUR prices.
"""

import json
from datetime import datetime

def load_sku_to_price_mapping():
    """Load SKU to Product ID and EUR price mapping from pricelist.json"""
    try:
        with open('pricelist.json', 'r') as f:
            pricelist = json.load(f)
        
        sku_mapping = {}
        for product in pricelist:
            internal_name = product.get('Internal Name', '')
            product_id = product.get('Product ID', '')
            eur_price = product.get('Euro', 0)
            
            if internal_name and product_id:
                sku_mapping[internal_name] = {
                    'product_id': product_id,
                    'eur_price': eur_price
                }
        
        print(f"📋 Loaded {len(sku_mapping)} SKU to Product ID and price mappings")
        return sku_mapping
    except Exception as e:
        print(f"❌ Error loading SKU mappings: {e}")
        return {}

def create_complete_validation():
    """
    Create comprehensive validation data by combining:
    1. Missing products analysis from existing enhanced validation
    2. Price mismatch validation from original validation
    3. Correct Product IDs and EUR prices from pricelist.json
    """
    
    try:
        # Load SKU to Product ID and price mapping
        sku_mapping = load_sku_to_price_mapping()
        if not sku_mapping:
            print("❌ Cannot proceed without SKU mappings")
            return False
        
        # Check for required source files
        try:
            with open('pricing_validator.py', 'r') as f:
                print("✅ Found pricing_validator.py for price mismatch analysis")
        except FileNotFoundError:
            print("⚠️ Warning: pricing_validator.py not found, price mismatches may be limited")
        
        # Load original validation (has price mismatches) - fallback if not available
        original_data = {"validation": {"price_mismatches": [], "unknown_on_page": [], "exact_matches": []}}
        try:
            # Try to find any existing validation data with price mismatches
            for filename in ['pricing_validation.json', 'complete_pricing_validation.json']:
                try:
                    with open(filename, 'r') as f:
                        temp_data = json.load(f)
                        if temp_data.get('validation', {}).get('price_mismatches') or temp_data.get('price_mismatches'):
                            original_data = temp_data
                            print(f"✅ Loaded validation data from {filename}")
                            break
                except FileNotFoundError:
                    continue
        except Exception as e:
            print(f"⚠️ Warning: Using minimal validation data: {e}")
        
        # For now, use hardcoded missing product data (normally would come from enhanced validation)
        # This should be replaced with actual missing product detection logic
        missing_products_data = {
            "summary": {
                "total_sku_products": 316,
                "implemented_products": 122,
                "missing_products": 184,
                "missing_by_license_type": {
                    "renewal": 60,
                    "upgrade": 55,
                    "other": 12,
                    "new-license": 5,
                    "perpetual": 51,
                    "subscription": 1
                }
            },
            "missing_from_page": [],  # Would be populated by missing product detection
            "missing_by_license_type": {}  # Would be populated by license type analysis
        }
        
        print("ℹ️ Using default missing product structure (implement missing product detection for full functionality)")
        
        # Load enhanced validation (has missing products by license type) - fallback to defaults
        enhanced_data = missing_products_data
        try:
            # Try to use any existing enhanced/complete validation
            with open('complete_pricing_validation.json', 'r') as f:
                existing_complete = json.load(f)
                if existing_complete.get('missing_from_page'):
                    enhanced_data = existing_complete
                    print("✅ Loaded existing enhanced validation data")
        except FileNotFoundError:
            print("ℹ️ Using default missing product data")
        
        # Fix missing products to have correct Product IDs and EUR prices from pricelist.json
        missing_products_fixed = []
        fixed_count = 0
        
        for product in enhanced_data.get("missing_from_page", []):
            sku = product.get("sku", "")
            mapping = sku_mapping.get(sku, {})
            
            fixed_product = product.copy()
            
            # Set correct product ID
            if mapping.get('product_id'):
                fixed_product["product_id"] = mapping['product_id']
                fixed_count += 1
            else:
                fixed_product["product_id"] = sku  # Use SKU as fallback
            
            # Set correct EUR price from pricelist.json
            if mapping.get('eur_price') and mapping['eur_price'] != 0:
                fixed_product["price_eur"] = mapping['eur_price']
            # If no price in pricelist, keep original (might be from SKU file)
            
            fixed_product["sku"] = sku  # Ensure SKU is properly set
            missing_products_fixed.append(fixed_product)
        
        # Also fix the missing_by_license_type section
        missing_by_license_type_fixed = {}
        for license_type, products in enhanced_data.get("missing_by_license_type", {}).items():
            fixed_products = []
            for product in products:
                sku = product.get("sku", "")
                mapping = sku_mapping.get(sku, {})
                
                fixed_product = product.copy()
                
                # Set correct product ID
                if mapping.get('product_id'):
                    fixed_product["product_id"] = mapping['product_id']
                else:
                    fixed_product["product_id"] = sku  # Use SKU as fallback
                
                # Set correct EUR price from pricelist.json
                if mapping.get('eur_price') and mapping['eur_price'] != 0:
                    fixed_product["price_eur"] = mapping['eur_price']
                
                fixed_product["sku"] = sku  # Ensure SKU is properly set
                fixed_products.append(fixed_product)
            
            missing_by_license_type_fixed[license_type] = fixed_products
        
        if fixed_count > 0:
            print(f"🔧 Fixed {fixed_count} missing products with correct Product IDs")
            print(f"💰 Updated prices from pricelist.json where available")
            print(f"📋 Fixed missing_by_license_type section as well")
        else:
            print("ℹ️ No missing products to fix (implement missing product detection for full functionality)")
        
        # Create complete validation combining both
        # Create final complete validation data with improved structure
        complete_validation = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "mode": "complete",
                "source_files": {
                    "pricelist": "pricelist.json",
                    "enhanced_validation": enhanced_file if enhanced_file else None
                },
                "statistics": {
                    "sku_mappings": len(sku_mapping),
                    "missing_products": len(missing_products_fixed),
                    "price_mismatches": len(enhanced_data.get("price_mismatches", [])),
                    "total_issues": len(missing_products_fixed) + len(enhanced_data.get("price_mismatches", []))
                }
            },
            "missing_from_page": missing_products_fixed,
            "missing_by_license_type": missing_by_license_type_fixed,
            "price_mismatches": enhanced_data.get("price_mismatches", [])
        }
        
        # Save the complete validation
        with open('complete_pricing_validation.json', 'w') as f:
            json.dump(complete_validation, f, indent=2)
        
        print("✅ Created complete_pricing_validation.json")
        print(f"📊 Summary:")
        print(f"  - Total SKU products: {complete_validation['summary']['total_sku_products']}")
        print(f"  - Missing products: {complete_validation['summary']['missing_products']}")
        print(f"  - Price mismatches: {complete_validation['summary']['price_mismatches']}")
        print(f"  - License type breakdown:")
        for license_type, count in complete_validation['summary']['missing_by_license_type'].items():
            print(f"    • {license_type}: {count}")
        
        if complete_validation['price_mismatches']:
            print(f"  - Price mismatch: {complete_validation['price_mismatches'][0]['name']}")
            print(f"    Expected: €{complete_validation['price_mismatches'][0]['expected_price']}")
            print(f"    Actual: €{complete_validation['price_mismatches'][0]['page_price']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating complete validation: {e}")
        return False

if __name__ == "__main__":
    create_complete_validation()
