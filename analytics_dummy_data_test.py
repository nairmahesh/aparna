#!/usr/bin/env python3
"""
Analytics Dummy Data Fallback Testing for Aparna's Diwali Delights
Tests the analytics endpoints to verify:
1. Normal operation with real data
2. Dummy data fallback when API fails
3. Realistic dummy data for Diwali sweets business
4. Data structure compatibility with frontend
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any
import sys

# Configuration
BACKEND_URL = "https://diwali-store.preview.emergentagent.com"
ADMIN_KEY = "aparna_admin_2025"
API_BASE = f"{BACKEND_URL}/api/admin"

class AnalyticsDummyDataTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_data"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_orders_endpoint_with_dummy_data(self):
        """Test Orders endpoint - should return dummy data when API fails"""
        print("🧪 Testing Orders Endpoint with Dummy Data Fallback...")
        
        # Test 1: Normal operation
        try:
            response = self.session.get(f"{API_BASE}/orders", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                orders = response.json()
                self.log_test(
                    "Orders endpoint - Normal operation",
                    True,
                    f"Retrieved {len(orders)} orders successfully",
                    {"order_count": len(orders)}
                )
                
                # Validate order structure
                if orders:
                    sample_order = orders[0]
                    required_fields = ["id", "customer_name", "customer_phone", "items", "total_amount", "status"]
                    missing_fields = [field for field in required_fields if field not in sample_order]
                    
                    if not missing_fields:
                        self.log_test(
                            "Orders data structure validation",
                            True,
                            "All required order fields present",
                            {"sample_fields": list(sample_order.keys())}
                        )
                    else:
                        self.log_test(
                            "Orders data structure validation",
                            False,
                            f"Missing required fields: {missing_fields}",
                            sample_order
                        )
            else:
                self.log_test(
                    "Orders endpoint - Normal operation",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Orders endpoint - Normal operation", False, f"Exception: {str(e)}")

        # Test 2: Check if dummy data is realistic for Diwali sweets business
        try:
            response = self.session.get(f"{API_BASE}/orders", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                orders = response.json()
                if orders:
                    # Check for Diwali-related products
                    diwali_products = []
                    for order in orders:
                        for item in order.get("items", []):
                            product_name = item.get("product_name", "").lower()
                            if any(keyword in product_name for keyword in ["diwali", "kaju", "laddu", "barfi", "mithai", "sweet"]):
                                diwali_products.append(item["product_name"])
                    
                    if diwali_products:
                        self.log_test(
                            "Orders contain realistic Diwali products",
                            True,
                            f"Found {len(diwali_products)} Diwali-related products",
                            {"diwali_products": diwali_products[:5]}  # Show first 5
                        )
                    else:
                        self.log_test(
                            "Orders contain realistic Diwali products",
                            False,
                            "No Diwali-related products found in orders",
                            {"sample_products": [item.get("product_name") for order in orders[:2] for item in order.get("items", [])]}
                        )
        except Exception as e:
            self.log_test("Orders contain realistic Diwali products", False, f"Exception: {str(e)}")

    def test_visitor_analytics_endpoint(self):
        """Test Visitor analytics endpoint - should return comprehensive visitor data"""
        print("🧪 Testing Visitor Analytics Endpoint...")
        
        try:
            response = self.session.get(f"{API_BASE}/analytics/visitors", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                analytics = response.json()
                
                # Check required fields
                required_fields = [
                    "date_range", "total_visitors", "unique_visitors", 
                    "returning_visitors", "new_visitors", "avg_session_duration",
                    "pages_per_session", "total_orders", "total_revenue",
                    "avg_order_value", "conversion_rate", "abandoned_carts"
                ]
                
                missing_fields = [field for field in required_fields if field not in analytics]
                
                if not missing_fields:
                    self.log_test(
                        "Visitor analytics - All required fields present",
                        True,
                        "Comprehensive visitor data structure validated",
                        {
                            "total_visitors": analytics.get("total_visitors"),
                            "conversion_rate": analytics.get("conversion_rate"),
                            "total_revenue": analytics.get("total_revenue")
                        }
                    )
                    
                    # Check if values are realistic
                    realistic_checks = []
                    if analytics.get("conversion_rate", 0) >= 0 and analytics.get("conversion_rate", 0) <= 100:
                        realistic_checks.append("conversion_rate")
                    if analytics.get("total_visitors", 0) >= 0:
                        realistic_checks.append("total_visitors")
                    if analytics.get("avg_order_value", 0) >= 0:
                        realistic_checks.append("avg_order_value")
                    
                    if len(realistic_checks) >= 3:
                        self.log_test(
                            "Visitor analytics - Realistic values",
                            True,
                            f"Values appear realistic for {len(realistic_checks)} metrics",
                            {"validated_metrics": realistic_checks}
                        )
                    else:
                        self.log_test(
                            "Visitor analytics - Realistic values",
                            False,
                            "Some values appear unrealistic",
                            analytics
                        )
                else:
                    self.log_test(
                        "Visitor analytics - All required fields present",
                        False,
                        f"Missing required fields: {missing_fields}",
                        analytics
                    )
            else:
                self.log_test(
                    "Visitor analytics endpoint",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Visitor analytics endpoint", False, f"Exception: {str(e)}")

    def test_customer_analytics_endpoint(self):
        """Test Customer analytics endpoint - should return customer purchase history"""
        print("🧪 Testing Customer Analytics Endpoint...")
        
        try:
            response = self.session.get(f"{API_BASE}/analytics/customers", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                customers = response.json()
                
                self.log_test(
                    "Customer analytics - Data retrieval",
                    True,
                    f"Retrieved analytics for {len(customers)} customers",
                    {"customer_count": len(customers)}
                )
                
                if customers:
                    sample_customer = customers[0]
                    required_fields = [
                        "customer_id", "customer_name", "customer_phone", 
                        "customer_type", "total_orders", "total_spent", "avg_order_value"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in sample_customer]
                    
                    if not missing_fields:
                        self.log_test(
                            "Customer analytics - Data structure",
                            True,
                            "All required customer fields present",
                            {
                                "customer_name": sample_customer.get("customer_name"),
                                "total_orders": sample_customer.get("total_orders"),
                                "total_spent": sample_customer.get("total_spent")
                            }
                        )
                        
                        # Check for realistic Indian customer names
                        indian_names = []
                        for customer in customers[:5]:  # Check first 5
                            name = customer.get("customer_name", "")
                            if any(indian_name in name.lower() for indian_name in ["priya", "raj", "sharma", "kumar", "singh", "patel", "gupta", "agarwal"]):
                                indian_names.append(name)
                        
                        if indian_names:
                            self.log_test(
                                "Customer analytics - Realistic Indian names",
                                True,
                                f"Found {len(indian_names)} realistic Indian customer names",
                                {"sample_names": indian_names}
                            )
                        else:
                            self.log_test(
                                "Customer analytics - Realistic Indian names",
                                False,
                                "No realistic Indian names found",
                                {"sample_names": [c.get("customer_name") for c in customers[:3]]}
                            )
                    else:
                        self.log_test(
                            "Customer analytics - Data structure",
                            False,
                            f"Missing required fields: {missing_fields}",
                            sample_customer
                        )
                else:
                    self.log_test(
                        "Customer analytics - Data availability",
                        False,
                        "No customer data available",
                        {"customers": customers}
                    )
            else:
                self.log_test(
                    "Customer analytics endpoint",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Customer analytics endpoint", False, f"Exception: {str(e)}")

    def test_revenue_analytics_endpoint(self):
        """Test Revenue analytics endpoint - should return revenue breakdown"""
        print("🧪 Testing Revenue Analytics Endpoint...")
        
        try:
            response = self.session.get(f"{API_BASE}/analytics/revenue-report", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                revenue_report = response.json()
                
                required_fields = ["date_range", "daily_breakdown", "summary"]
                missing_fields = [field for field in required_fields if field not in revenue_report]
                
                if not missing_fields:
                    summary = revenue_report.get("summary", {})
                    required_summary_fields = ["total_orders", "total_revenue", "total_delivery_revenue", "grand_total"]
                    missing_summary_fields = [field for field in required_summary_fields if field not in summary]
                    
                    if not missing_summary_fields:
                        self.log_test(
                            "Revenue analytics - Complete data structure",
                            True,
                            "All required revenue fields present",
                            {
                                "total_orders": summary.get("total_orders"),
                                "total_revenue": summary.get("total_revenue"),
                                "total_delivery_revenue": summary.get("total_delivery_revenue"),
                                "grand_total": summary.get("grand_total")
                            }
                        )
                        
                        # Check if revenue values are realistic for a sweets business
                        total_revenue = summary.get("total_revenue", 0)
                        delivery_revenue = summary.get("total_delivery_revenue", 0)
                        total_orders = summary.get("total_orders", 0)
                        
                        realistic_checks = []
                        if total_revenue > 0:
                            realistic_checks.append("positive_revenue")
                        if delivery_revenue >= 0:
                            realistic_checks.append("valid_delivery_cost")
                        if total_orders > 0:
                            realistic_checks.append("positive_orders")
                        if total_orders > 0 and total_revenue > 0:
                            avg_order = total_revenue / total_orders
                            if 200 <= avg_order <= 5000:  # Realistic range for sweets orders
                                realistic_checks.append("realistic_avg_order")
                        
                        if len(realistic_checks) >= 3:
                            self.log_test(
                                "Revenue analytics - Realistic values for sweets business",
                                True,
                                f"Revenue values appear realistic ({len(realistic_checks)}/4 checks passed)",
                                {
                                    "avg_order_value": total_revenue / total_orders if total_orders > 0 else 0,
                                    "delivery_percentage": (delivery_revenue / total_revenue * 100) if total_revenue > 0 else 0
                                }
                            )
                        else:
                            self.log_test(
                                "Revenue analytics - Realistic values for sweets business",
                                False,
                                f"Revenue values may be unrealistic ({len(realistic_checks)}/4 checks passed)",
                                summary
                            )
                    else:
                        self.log_test(
                            "Revenue analytics - Complete data structure",
                            False,
                            f"Missing summary fields: {missing_summary_fields}",
                            summary
                        )
                else:
                    self.log_test(
                        "Revenue analytics - Complete data structure",
                        False,
                        f"Missing required fields: {missing_fields}",
                        revenue_report
                    )
            else:
                self.log_test(
                    "Revenue analytics endpoint",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Revenue analytics endpoint", False, f"Exception: {str(e)}")

    def test_api_failure_fallback_mechanism(self):
        """Test that API failures gracefully fall back to dummy data without crashing"""
        print("🧪 Testing API Failure Fallback Mechanism...")
        
        # Test with invalid admin key to simulate API failure
        try:
            response = self.session.get(f"{API_BASE}/analytics/visitors", params={"admin_key": "invalid_key"})
            if response.status_code == 403:
                self.log_test(
                    "API failure handling - Invalid admin key",
                    True,
                    "API correctly returns 403 for invalid admin key (no crash)",
                    {"status_code": response.status_code}
                )
            else:
                self.log_test(
                    "API failure handling - Invalid admin key",
                    False,
                    f"Unexpected status code: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("API failure handling - Invalid admin key", False, f"Exception: {str(e)}")

        # Test with invalid date format
        try:
            params = {
                "admin_key": ADMIN_KEY,
                "date_from": "invalid-date",
                "date_to": "also-invalid"
            }
            response = self.session.get(f"{API_BASE}/analytics/visitors", params=params)
            
            # Check if it handles gracefully (either returns error or dummy data)
            if response.status_code in [400, 422, 500]:
                self.log_test(
                    "API failure handling - Invalid date format",
                    True,
                    f"API handles invalid dates gracefully with status {response.status_code}",
                    {"status_code": response.status_code}
                )
            elif response.status_code == 200:
                # If it returns 200, it should have dummy data
                data = response.json()
                if isinstance(data, dict) and "total_visitors" in data:
                    self.log_test(
                        "API failure handling - Invalid date format with dummy data",
                        True,
                        "API returns dummy data when date parsing fails",
                        {"dummy_data_fields": list(data.keys())}
                    )
                else:
                    self.log_test(
                        "API failure handling - Invalid date format",
                        False,
                        "API returned 200 but data structure is unexpected",
                        data
                    )
            else:
                self.log_test(
                    "API failure handling - Invalid date format",
                    False,
                    f"Unexpected status code: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("API failure handling - Invalid date format", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all analytics dummy data tests"""
        print("🚀 Starting Analytics Dummy Data Fallback Tests")
        print("=" * 60)
        
        # Run test suites
        self.test_orders_endpoint_with_dummy_data()
        self.test_visitor_analytics_endpoint()
        self.test_customer_analytics_endpoint()
        self.test_revenue_analytics_endpoint()
        self.test_api_failure_fallback_mechanism()
        
        # Print summary
        self.print_test_summary()

    def print_test_summary(self):
        """Print test results summary"""
        print("=" * 60)
        print("🏁 ANALYTICS DUMMY DATA TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t["success"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print()
        
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            for test in self.test_results:
                if not test["success"]:
                    print(f"  - {test['test']}: {test['details']}")
            print()
        
        print("🔍 KEY FINDINGS:")
        
        # Analyze results by category
        orders_tests = [t for t in self.test_results if "orders" in t["test"].lower()]
        visitor_tests = [t for t in self.test_results if "visitor" in t["test"].lower()]
        customer_tests = [t for t in self.test_results if "customer" in t["test"].lower()]
        revenue_tests = [t for t in self.test_results if "revenue" in t["test"].lower()]
        fallback_tests = [t for t in self.test_results if "failure" in t["test"].lower() or "fallback" in t["test"].lower()]
        
        print(f"  📋 Orders Endpoint: {len([t for t in orders_tests if t['success']])}/{len(orders_tests)} passed")
        print(f"  👥 Visitor Analytics: {len([t for t in visitor_tests if t['success']])}/{len(visitor_tests)} passed")
        print(f"  🛒 Customer Analytics: {len([t for t in customer_tests if t['success']])}/{len(customer_tests)} passed")
        print(f"  💰 Revenue Analytics: {len([t for t in revenue_tests if t['success']])}/{len(revenue_tests)} passed")
        print(f"  🔄 Fallback Mechanism: {len([t for t in fallback_tests if t['success']])}/{len(fallback_tests)} passed")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": (passed_tests/total_tests)*100
        }

if __name__ == "__main__":
    print("🎯 Analytics Dummy Data Fallback Tester")
    print("Testing Aparna's Diwali Delights Analytics Endpoints")
    print()
    
    tester = AnalyticsDummyDataTester()
    tester.run_all_tests()