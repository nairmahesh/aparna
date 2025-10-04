#!/usr/bin/env python3
"""
Backend API Testing for Aparna's Diwali Delights Enhanced Admin Panel
Tests all the new admin panel backend functionality including:
- Enhanced Order Management
- Visitor Analytics 
- Visitor Tracking
- Revenue Reports
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any
import sys

# Configuration
BACKEND_URL = "http://localhost:8001"  # From frontend/.env REACT_APP_BACKEND_URL
ADMIN_KEY = "aparna_admin_2025"
API_BASE = f"{BACKEND_URL}/admin"

class AdminPanelTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.sample_data = {}
        
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

    def create_sample_data(self):
        """Create sample data for testing"""
        print("🔧 Creating sample data for testing...")
        
        # Sample order data
        sample_order = {
            "id": str(uuid.uuid4()),
            "customer_name": "Priya Sharma",
            "customer_phone": "+91-9876543210",
            "customer_email": "priya.sharma@email.com",
            "customer_address": "123 MG Road, Bangalore, Karnataka 560001",
            "customer_type": "returning",
            "is_repeat_customer": True,
            "previous_orders_count": 3,
            "items": [
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Special Diwali Mix",
                    "price": 450.0,
                    "quantity": 2,
                    "unit": "per kg"
                },
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Kaju Katli",
                    "price": 800.0,
                    "quantity": 1,
                    "unit": "per kg"
                }
            ],
            "total_amount": 1700.0,
            "delivery_cost": 50.0,
            "delivery_date": (datetime.now() + timedelta(days=2)).isoformat(),
            "status": "confirmed",
            "delivery_status": "pending",
            "payment_status": "paid",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "notes": "Please deliver before 6 PM"
        }
        
        # Insert sample order directly into database for testing
        self.sample_data["order"] = sample_order
        
        # Sample visitor session data
        self.sample_data["session_id"] = str(uuid.uuid4().hex)
        
        print("✅ Sample data created")

    def test_order_management_endpoints(self):
        """Test Enhanced Order Management Endpoints"""
        print("🧪 Testing Enhanced Order Management Endpoints...")
        
        # Test 1: GET /admin/orders (all orders)
        try:
            response = self.session.get(f"{API_BASE}/orders", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                orders = response.json()
                self.log_test(
                    "GET /admin/orders - Get all orders",
                    True,
                    f"Retrieved {len(orders)} orders",
                    {"count": len(orders)}
                )
            else:
                self.log_test(
                    "GET /admin/orders - Get all orders",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/orders - Get all orders", False, f"Exception: {str(e)}")

        # Test 2: GET /admin/orders with filtering
        try:
            params = {
                "admin_key": ADMIN_KEY,
                "status": "confirmed",
                "delivery_status": "pending",
                "limit": 50
            }
            response = self.session.get(f"{API_BASE}/orders", params=params)
            if response.status_code == 200:
                filtered_orders = response.json()
                self.log_test(
                    "GET /admin/orders - With filters",
                    True,
                    f"Retrieved {len(filtered_orders)} filtered orders",
                    {"filters_applied": True, "count": len(filtered_orders)}
                )
            else:
                self.log_test(
                    "GET /admin/orders - With filters",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/orders - With filters", False, f"Exception: {str(e)}")

        # Test 3: GET /admin/orders with date range filtering
        try:
            date_from = (datetime.now() - timedelta(days=30)).isoformat()
            date_to = datetime.now().isoformat()
            params = {
                "admin_key": ADMIN_KEY,
                "date_from": date_from,
                "date_to": date_to
            }
            response = self.session.get(f"{API_BASE}/orders", params=params)
            if response.status_code == 200:
                date_filtered_orders = response.json()
                self.log_test(
                    "GET /admin/orders - Date range filter",
                    True,
                    f"Retrieved {len(date_filtered_orders)} orders in date range",
                    {"date_range_applied": True, "count": len(date_filtered_orders)}
                )
            else:
                self.log_test(
                    "GET /admin/orders - Date range filter",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/orders - Date range filter", False, f"Exception: {str(e)}")

        # Test 4: GET /admin/orders/{order_id} (single order) - Test with non-existent ID
        try:
            fake_order_id = str(uuid.uuid4())
            response = self.session.get(f"{API_BASE}/orders/{fake_order_id}", params={"admin_key": ADMIN_KEY})
            if response.status_code == 404:
                self.log_test(
                    "GET /admin/orders/{order_id} - Non-existent order",
                    True,
                    "Correctly returned 404 for non-existent order",
                    {"status_code": 404}
                )
            else:
                self.log_test(
                    "GET /admin/orders/{order_id} - Non-existent order",
                    False,
                    f"Expected 404, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/orders/{order_id} - Non-existent order", False, f"Exception: {str(e)}")

        # Test 5: PUT /admin/orders/{order_id} (update order) - Test with non-existent ID
        try:
            fake_order_id = str(uuid.uuid4())
            update_data = {
                "status": "preparing",
                "delivery_status": "dispatched",
                "admin_notes": "Order updated via API test"
            }
            response = self.session.put(
                f"{API_BASE}/orders/{fake_order_id}",
                params={"admin_key": ADMIN_KEY},
                json=update_data
            )
            if response.status_code == 404:
                self.log_test(
                    "PUT /admin/orders/{order_id} - Update non-existent order",
                    True,
                    "Correctly returned 404 for non-existent order update",
                    {"status_code": 404}
                )
            else:
                self.log_test(
                    "PUT /admin/orders/{order_id} - Update non-existent order",
                    False,
                    f"Expected 404, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("PUT /admin/orders/{order_id} - Update non-existent order", False, f"Exception: {str(e)}")

        # Test 6: GET /admin/orders/customer/{phone} (customer order history)
        try:
            test_phone = "+91-9876543210"
            response = self.session.get(f"{API_BASE}/orders/customer/{test_phone}", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                customer_orders = response.json()
                self.log_test(
                    "GET /admin/orders/customer/{phone} - Customer order history",
                    True,
                    f"Retrieved {len(customer_orders)} orders for customer",
                    {"customer_phone": test_phone, "order_count": len(customer_orders)}
                )
            else:
                self.log_test(
                    "GET /admin/orders/customer/{phone} - Customer order history",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/orders/customer/{phone} - Customer order history", False, f"Exception: {str(e)}")

    def test_visitor_analytics_endpoints(self):
        """Test Visitor Analytics Endpoints"""
        print("🧪 Testing Visitor Analytics Endpoints...")
        
        # Test 1: GET /admin/analytics/visitors
        try:
            response = self.session.get(f"{API_BASE}/analytics/visitors", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                visitor_analytics = response.json()
                required_fields = [
                    "date_range", "total_visitors", "unique_visitors", 
                    "returning_visitors", "new_visitors", "avg_session_duration",
                    "pages_per_session", "total_orders", "total_revenue",
                    "avg_order_value", "conversion_rate", "abandoned_carts"
                ]
                
                missing_fields = [field for field in required_fields if field not in visitor_analytics]
                
                if not missing_fields:
                    self.log_test(
                        "GET /admin/analytics/visitors - Comprehensive visitor metrics",
                        True,
                        "All required analytics fields present",
                        {
                            "total_visitors": visitor_analytics.get("total_visitors", 0),
                            "conversion_rate": visitor_analytics.get("conversion_rate", 0),
                            "total_revenue": visitor_analytics.get("total_revenue", 0)
                        }
                    )
                else:
                    self.log_test(
                        "GET /admin/analytics/visitors - Comprehensive visitor metrics",
                        False,
                        f"Missing required fields: {missing_fields}",
                        visitor_analytics
                    )
            else:
                self.log_test(
                    "GET /admin/analytics/visitors - Comprehensive visitor metrics",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/analytics/visitors - Comprehensive visitor metrics", False, f"Exception: {str(e)}")

        # Test 2: GET /admin/analytics/visitors with date range
        try:
            date_from = (datetime.now() - timedelta(days=7)).isoformat()
            date_to = datetime.now().isoformat()
            params = {
                "admin_key": ADMIN_KEY,
                "date_from": date_from,
                "date_to": date_to
            }
            response = self.session.get(f"{API_BASE}/analytics/visitors", params=params)
            if response.status_code == 200:
                analytics_with_range = response.json()
                self.log_test(
                    "GET /admin/analytics/visitors - With date range",
                    True,
                    "Successfully retrieved analytics for date range",
                    {"date_range": analytics_with_range.get("date_range", "N/A")}
                )
            else:
                self.log_test(
                    "GET /admin/analytics/visitors - With date range",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/analytics/visitors - With date range", False, f"Exception: {str(e)}")

        # Test 3: GET /admin/analytics/customers
        try:
            response = self.session.get(f"{API_BASE}/analytics/customers", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                customer_analytics = response.json()
                self.log_test(
                    "GET /admin/analytics/customers - Detailed customer analytics",
                    True,
                    f"Retrieved analytics for {len(customer_analytics)} customers",
                    {"customer_count": len(customer_analytics)}
                )
                
                # Validate customer analytics structure if data exists
                if customer_analytics:
                    sample_customer = customer_analytics[0]
                    required_customer_fields = [
                        "customer_id", "customer_name", "customer_phone", 
                        "customer_type", "total_orders", "total_spent", "avg_order_value"
                    ]
                    missing_customer_fields = [field for field in required_customer_fields if field not in sample_customer]
                    
                    if not missing_customer_fields:
                        self.log_test(
                            "Customer analytics structure validation",
                            True,
                            "Customer analytics has all required fields",
                            {"sample_customer_fields": list(sample_customer.keys())}
                        )
                    else:
                        self.log_test(
                            "Customer analytics structure validation",
                            False,
                            f"Missing customer fields: {missing_customer_fields}",
                            sample_customer
                        )
            else:
                self.log_test(
                    "GET /admin/analytics/customers - Detailed customer analytics",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/analytics/customers - Detailed customer analytics", False, f"Exception: {str(e)}")

        # Test 4: GET /admin/analytics/cart-abandonment
        try:
            response = self.session.get(f"{API_BASE}/analytics/cart-abandonment", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                cart_abandonment = response.json()
                self.log_test(
                    "GET /admin/analytics/cart-abandonment - Cart abandonment recovery",
                    True,
                    f"Retrieved {len(cart_abandonment)} cart abandonment sessions",
                    {"abandonment_count": len(cart_abandonment)}
                )
            else:
                self.log_test(
                    "GET /admin/analytics/cart-abandonment - Cart abandonment recovery",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/analytics/cart-abandonment - Cart abandonment recovery", False, f"Exception: {str(e)}")

        # Test 5: GET /admin/analytics/revenue-report
        try:
            response = self.session.get(f"{API_BASE}/analytics/revenue-report", params={"admin_key": ADMIN_KEY})
            if response.status_code == 200:
                revenue_report = response.json()
                required_revenue_fields = ["date_range", "daily_breakdown", "summary"]
                missing_revenue_fields = [field for field in required_revenue_fields if field not in revenue_report]
                
                if not missing_revenue_fields:
                    summary = revenue_report.get("summary", {})
                    self.log_test(
                        "GET /admin/analytics/revenue-report - Revenue breakdown with delivery costs",
                        True,
                        "Revenue report has all required fields",
                        {
                            "total_orders": summary.get("total_orders", 0),
                            "total_revenue": summary.get("total_revenue", 0),
                            "total_delivery_revenue": summary.get("total_delivery_revenue", 0),
                            "grand_total": summary.get("grand_total", 0)
                        }
                    )
                else:
                    self.log_test(
                        "GET /admin/analytics/revenue-report - Revenue breakdown with delivery costs",
                        False,
                        f"Missing revenue report fields: {missing_revenue_fields}",
                        revenue_report
                    )
            else:
                self.log_test(
                    "GET /admin/analytics/revenue-report - Revenue breakdown with delivery costs",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/analytics/revenue-report - Revenue breakdown with delivery costs", False, f"Exception: {str(e)}")

        # Test 6: GET /admin/analytics/revenue-report with date range
        try:
            date_from = (datetime.now() - timedelta(days=14)).isoformat()
            date_to = datetime.now().isoformat()
            params = {
                "admin_key": ADMIN_KEY,
                "date_from": date_from,
                "date_to": date_to
            }
            response = self.session.get(f"{API_BASE}/analytics/revenue-report", params=params)
            if response.status_code == 200:
                revenue_report_range = response.json()
                self.log_test(
                    "GET /admin/analytics/revenue-report - With date range",
                    True,
                    "Successfully retrieved revenue report for date range",
                    {"date_range": revenue_report_range.get("date_range", "N/A")}
                )
            else:
                self.log_test(
                    "GET /admin/analytics/revenue-report - With date range",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("GET /admin/analytics/revenue-report - With date range", False, f"Exception: {str(e)}")

    def test_visitor_tracking_endpoints(self):
        """Test Visitor Tracking Endpoints (no auth required)"""
        print("🧪 Testing Visitor Tracking Endpoints...")
        
        session_id = self.sample_data["session_id"]
        
        # Test 1: POST /admin/track/visitor-session
        try:
            session_params = {
                "session_id": session_id,
                "visitor_type": "identified",
                "referral_link_token": str(uuid.uuid4().hex),
                "ip_address": "192.168.1.100",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            response = self.session.post(f"{API_BASE}/track/visitor-session", params=session_params)
            if response.status_code == 200:
                track_response = response.json()
                if track_response.get("status") == "tracked":
                    self.log_test(
                        "POST /admin/track/visitor-session - Track user sessions",
                        True,
                        "Successfully tracked visitor session",
                        {"session_id": session_id, "status": track_response.get("status")}
                    )
                else:
                    self.log_test(
                        "POST /admin/track/visitor-session - Track user sessions",
                        False,
                        "Unexpected response format",
                        track_response
                    )
            else:
                self.log_test(
                    "POST /admin/track/visitor-session - Track user sessions",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("POST /admin/track/visitor-session - Track user sessions", False, f"Exception: {str(e)}")

        # Test 2: POST /admin/track/visitor-event (page view)
        try:
            event_params = {
                "session_id": session_id,
                "event_type": "page_view",
                "page_url": "/products/diwali-special"
            }
            response = self.session.post(f"{API_BASE}/track/visitor-event", params=event_params)
            if response.status_code == 200:
                event_response = response.json()
                if event_response.get("status") == "tracked":
                    self.log_test(
                        "POST /admin/track/visitor-event - Track page view",
                        True,
                        "Successfully tracked page view event",
                        {"event_type": "page_view", "status": event_response.get("status")}
                    )
                else:
                    self.log_test(
                        "POST /admin/track/visitor-event - Track page view",
                        False,
                        "Unexpected response format",
                        event_response
                    )
            else:
                self.log_test(
                    "POST /admin/track/visitor-event - Track page view",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("POST /admin/track/visitor-event - Track page view", False, f"Exception: {str(e)}")

        # Test 3: POST /admin/track/visitor-event (cart add)
        try:
            cart_event_params = {
                "session_id": session_id,
                "event_type": "cart_add",
                "page_url": "/products/kaju-katli",
                "product_id": str(uuid.uuid4()),
                "product_name": "Kaju Katli Premium",
                "cart_value": 800.0
            }
            response = self.session.post(f"{API_BASE}/track/visitor-event", params=cart_event_params)
            if response.status_code == 200:
                cart_response = response.json()
                if cart_response.get("status") == "tracked":
                    self.log_test(
                        "POST /admin/track/visitor-event - Track cart add",
                        True,
                        "Successfully tracked cart add event",
                        {"event_type": "cart_add", "product_name": "Kaju Katli Premium", "status": cart_response.get("status")}
                    )
                else:
                    self.log_test(
                        "POST /admin/track/visitor-event - Track cart add",
                        False,
                        "Unexpected response format",
                        cart_response
                    )
            else:
                self.log_test(
                    "POST /admin/track/visitor-event - Track cart add",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("POST /admin/track/visitor-event - Track cart add", False, f"Exception: {str(e)}")

        # Test 4: POST /admin/track/visitor-event (checkout start)
        try:
            checkout_event_data = {
                "session_id": session_id,
                "event_type": "checkout_start",
                "page_url": "/checkout",
                "product_id": None,
                "product_name": None,
                "cart_value": 1250.0,
                "order_id": None
            }
            response = self.session.post(f"{API_BASE}/track/visitor-event", json=checkout_event_data)
            if response.status_code == 200:
                checkout_response = response.json()
                if checkout_response.get("status") == "tracked":
                    self.log_test(
                        "POST /admin/track/visitor-event - Track checkout start",
                        True,
                        "Successfully tracked checkout start event",
                        {"event_type": "checkout_start", "cart_value": 1250.0, "status": checkout_response.get("status")}
                    )
                else:
                    self.log_test(
                        "POST /admin/track/visitor-event - Track checkout start",
                        False,
                        "Unexpected response format",
                        checkout_response
                    )
            else:
                self.log_test(
                    "POST /admin/track/visitor-event - Track checkout start",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("POST /admin/track/visitor-event - Track checkout start", False, f"Exception: {str(e)}")

        # Test 5: POST /admin/track/visitor-event (order complete)
        try:
            order_complete_data = {
                "session_id": session_id,
                "event_type": "order_complete",
                "page_url": "/order-confirmation",
                "product_id": None,
                "product_name": None,
                "cart_value": 1250.0,
                "order_id": str(uuid.uuid4())
            }
            response = self.session.post(f"{API_BASE}/track/visitor-event", json=order_complete_data)
            if response.status_code == 200:
                order_response = response.json()
                if order_response.get("status") == "tracked":
                    self.log_test(
                        "POST /admin/track/visitor-event - Track order complete",
                        True,
                        "Successfully tracked order complete event",
                        {"event_type": "order_complete", "cart_value": 1250.0, "status": order_response.get("status")}
                    )
                else:
                    self.log_test(
                        "POST /admin/track/visitor-event - Track order complete",
                        False,
                        "Unexpected response format",
                        order_response
                    )
            else:
                self.log_test(
                    "POST /admin/track/visitor-event - Track order complete",
                    False,
                    f"Status: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("POST /admin/track/visitor-event - Track order complete", False, f"Exception: {str(e)}")

    def test_authentication_and_error_handling(self):
        """Test Authentication and Error Handling"""
        print("🧪 Testing Authentication and Error Handling...")
        
        # Test 1: Access protected endpoint without admin key
        try:
            response = self.session.get(f"{API_BASE}/orders")
            if response.status_code == 422:  # FastAPI validation error for missing query param
                self.log_test(
                    "Authentication - Missing admin key",
                    True,
                    "Correctly rejected request without admin key",
                    {"status_code": response.status_code}
                )
            else:
                self.log_test(
                    "Authentication - Missing admin key",
                    False,
                    f"Expected 422, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Authentication - Missing admin key", False, f"Exception: {str(e)}")

        # Test 2: Access protected endpoint with wrong admin key
        try:
            response = self.session.get(f"{API_BASE}/orders", params={"admin_key": "wrong_key"})
            if response.status_code == 403:
                self.log_test(
                    "Authentication - Wrong admin key",
                    True,
                    "Correctly rejected request with wrong admin key",
                    {"status_code": response.status_code}
                )
            else:
                self.log_test(
                    "Authentication - Wrong admin key",
                    False,
                    f"Expected 403, got {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Authentication - Wrong admin key", False, f"Exception: {str(e)}")

        # Test 3: Invalid date format in analytics
        try:
            params = {
                "admin_key": ADMIN_KEY,
                "date_from": "invalid-date",
                "date_to": "also-invalid"
            }
            response = self.session.get(f"{API_BASE}/analytics/visitors", params=params)
            # Should handle gracefully or return error
            if response.status_code in [400, 422, 500]:
                self.log_test(
                    "Error Handling - Invalid date format",
                    True,
                    f"Properly handled invalid date format with status {response.status_code}",
                    {"status_code": response.status_code}
                )
            else:
                self.log_test(
                    "Error Handling - Invalid date format",
                    False,
                    f"Unexpected status code: {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test("Error Handling - Invalid date format", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Enhanced Admin Panel Backend API Tests")
        print("=" * 60)
        
        # Create sample data
        self.create_sample_data()
        
        # Run test suites
        self.test_order_management_endpoints()
        self.test_visitor_analytics_endpoints()
        self.test_visitor_tracking_endpoints()
        self.test_authentication_and_error_handling()
        
        # Print summary
        self.print_test_summary()

    def print_test_summary(self):
        """Print test results summary"""
        print("=" * 60)
        print("🏁 TEST SUMMARY")
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
        
        # Analyze results
        order_tests = [t for t in self.test_results if "orders" in t["test"].lower()]
        analytics_tests = [t for t in self.test_results if "analytics" in t["test"].lower()]
        tracking_tests = [t for t in self.test_results if "track" in t["test"].lower()]
        auth_tests = [t for t in self.test_results if "authentication" in t["test"].lower() or "error handling" in t["test"].lower()]
        
        print(f"  📋 Order Management: {len([t for t in order_tests if t['success']])}/{len(order_tests)} passed")
        print(f"  📊 Analytics: {len([t for t in analytics_tests if t['success']])}/{len(analytics_tests)} passed")
        print(f"  🔍 Visitor Tracking: {len([t for t in tracking_tests if t['success']])}/{len(tracking_tests)} passed")
        print(f"  🔐 Auth & Error Handling: {len([t for t in auth_tests if t['success']])}/{len(auth_tests)} passed")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": (passed_tests/total_tests)*100
        }

if __name__ == "__main__":
    print("🎯 Enhanced Admin Panel Backend API Tester")
    print("Testing Aparna's Diwali Delights E-commerce Platform")
    print()
    
    tester = AdminPanelTester()
    tester.run_all_tests()