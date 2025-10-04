#!/usr/bin/env python3
"""
Test to check if there are any dummy data fallback mechanisms
when the database is empty or when API calls fail
"""

import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "https://diwali-store.preview.emergentagent.com"
ADMIN_KEY = "aparna_admin_2025"
API_BASE = f"{BACKEND_URL}/api/admin"

def test_empty_database_scenario():
    """Test what happens when database collections are empty"""
    print("🧪 Testing Empty Database Scenario...")
    
    # Test analytics endpoints to see if they return empty data or dummy data
    endpoints = [
        "/analytics/visitors",
        "/analytics/customers", 
        "/analytics/revenue-report",
        "/analytics/cart-abandonment"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{API_BASE}{endpoint}", params={"admin_key": ADMIN_KEY})
            print(f"\n📊 {endpoint}:")
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    print(f"   Data type: List with {len(data)} items")
                    if len(data) == 0:
                        print("   ⚠️  Empty list - no fallback data")
                    else:
                        print("   ✅ Contains data")
                elif isinstance(data, dict):
                    print(f"   Data type: Dict with keys: {list(data.keys())}")
                    # Check if it has meaningful values or zeros
                    if "total_visitors" in data:
                        if data["total_visitors"] == 0:
                            print("   ⚠️  Zero visitors - likely real empty data, no dummy fallback")
                        else:
                            print(f"   ✅ Has {data['total_visitors']} visitors")
                    if "total_orders" in data:
                        if data["total_orders"] == 0:
                            print("   ⚠️  Zero orders - likely real empty data, no dummy fallback")
                        else:
                            print(f"   ✅ Has {data['total_orders']} orders")
            else:
                print(f"   ❌ Error: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Exception: {str(e)}")

def test_database_connection_failure():
    """Test what happens when database connection fails"""
    print("\n🧪 Testing Database Connection Failure Scenarios...")
    
    # Test with invalid date ranges that might cause database errors
    test_cases = [
        {"date_from": "2025-13-45", "date_to": "2025-15-99"},  # Invalid dates
        {"date_from": "invalid", "date_to": "also-invalid"},   # Non-date strings
        {"date_from": "1900-01-01", "date_to": "1900-01-02"},  # Very old dates
    ]
    
    for i, params in enumerate(test_cases):
        params["admin_key"] = ADMIN_KEY
        print(f"\n📊 Test case {i+1}: {params}")
        
        try:
            response = requests.get(f"{API_BASE}/analytics/visitors", params=params)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("   ✅ Returned 200 - possible dummy data fallback")
                print(f"   Data keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
            elif response.status_code == 500:
                print("   ⚠️  Internal server error - no graceful fallback")
            else:
                print(f"   ℹ️  Status {response.status_code} - handled gracefully")
                
        except Exception as e:
            print(f"   ❌ Exception: {str(e)}")

if __name__ == "__main__":
    print("🎯 Fallback Mechanism Tester")
    print("Testing for dummy data fallback when APIs fail")
    print("=" * 50)
    
    test_empty_database_scenario()
    test_database_connection_failure()
    
    print("\n" + "=" * 50)
    print("🏁 FALLBACK MECHANISM TEST COMPLETE")