"""
Quick test script to verify database and API setup
Run this after setting up database and starting the server
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "="*50)
    print(f"  {title}")
    print("="*50)

def test_health():
    """Test if API is running"""
    print_section("Testing API Health")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ API is running!")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print("❌ API health check failed")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        print("Make sure the server is running: uvicorn app.main:app --reload")
        return False

def test_get_membership_plans():
    """Test getting membership plans"""
    print_section("Testing Membership Plans")
    try:
        response = requests.get(f"{BASE_URL}/user/membership-plans")
        if response.status_code == 200:
            plans = response.json()
            print(f"✅ Found {len(plans)} membership plans:")
            for plan in plans:
                print(f"  - {plan['name']}: ₹{plan['price']} for {plan['duration_months']} months")
            return True
        else:
            print(f"❌ Failed to get plans: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_branches():
    """Test getting branches"""
    print_section("Testing Branches")
    try:
        response = requests.get(f"{BASE_URL}/admin/branches")
        if response.status_code == 200:
            branches = response.json()
            print(f"✅ Found {len(branches)} branches:")
            for branch in branches:
                print(f"  - {branch['name']} ({branch['city']})")
            return True
        else:
            print(f"❌ Failed to get branches: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_sessions():
    """Test getting available sessions"""
    print_section("Testing Sessions")
    try:
        response = requests.get(f"{BASE_URL}/user/sessions")
        if response.status_code == 200:
            sessions = response.json()
            print(f"✅ Found {len(sessions)} available sessions:")
            for session in sessions[:5]:  # Show first 5
                print(f"  - {session['name']} at {session['branch_name']}")
                print(f"    Time: {session['start_time']}")
                print(f"    Available: {session['available_spots']} spots")
            return True
        else:
            print(f"❌ Failed to get sessions: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    print_section("Testing User Registration")
    user_data = {
        "name": "Test User API",
        "email": f"test{__import__('time').time()}@example.com",  # Unique email
        "password": "password123",
        "date_of_birth": "1995-01-01",
        "gender": "male",
        "phone_number": "9999999999"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/user/register", json=user_data)
        if response.status_code == 200:
            user = response.json()
            print("✅ User registered successfully!")
            print(f"  User ID: {user['id']}")
            print(f"  Name: {user['name']}")
            print(f"  Email: {user['email']}")
            return user['id']
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(response.json())
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_revenue_report():
    """Test revenue report"""
    print_section("Testing Revenue Report")
    try:
        response = requests.get(f"{BASE_URL}/admin/reports/revenue")
        if response.status_code == 200:
            report = response.json()
            print(f"✅ Revenue report generated for {len(report)} branches:")
            for item in report:
                print(f"  - {item['branch_name']}: ₹{item['total_revenue']}")
                print(f"    Sessions: {item['total_sessions']}, Bookings: {item['total_bookings']}")
            return True
        else:
            print(f"❌ Failed to get report: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "🏋️ "*10)
    print("  FITNESS MANAGEMENT SYSTEM - API TEST SUITE")
    print("🏋️ "*10)
    
    # Track test results
    results = []
    
    # Run tests
    results.append(("API Health", test_health()))
    
    if results[0][1]:  # Only continue if API is running
        results.append(("Membership Plans", test_get_membership_plans()))
        results.append(("Branches", test_get_branches()))
        results.append(("Sessions", test_get_sessions()))
        results.append(("User Registration", test_user_registration() is not None))
        results.append(("Revenue Report", test_revenue_report()))
    
    # Print summary
    print_section("TEST SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your API is working perfectly!")
        print("\n📝 Next steps:")
        print("  1. Open http://localhost:8000/docs for interactive API testing")
        print("  2. Test user flow: Register → Login → Buy Membership → Book Session")
        print("  3. Test admin features: Create sessions, view reports")
        print("  4. Run complex queries from sql/queries.sql")
    else:
        print("\n⚠️  Some tests failed. Please check:")
        print("  1. Is MySQL running? (net start MySQL80)")
        print("  2. Is database created? (CREATE DATABASE Fitness_DB;)")
        print("  3. Is schema imported? (mysql -u root -p Fitness_DB < sql/schema.sql)")
        print("  4. Is sample data imported? (mysql -u root -p Fitness_DB < sql/sample_data.sql)")
        print("  5. Is .env configured correctly?")

if __name__ == "__main__":
    main()
