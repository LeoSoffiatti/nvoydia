#!/usr/bin/env python3
"""
Piloterr Crunchbase API Integration Test
Assignment 4.1 - API Integration Tests

This script tests the feasibility of integrating live data from Piloterr's Crunchbase API
for the NVoydia dashboard project.
"""

import requests
import json
import time
from typing import Dict, List, Optional, Any
import pandas as pd
from datetime import datetime

class PiloterrCrunchbaseAPI:
    """Wrapper for Piloterr Crunchbase API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Try different possible base URLs
        self.possible_base_urls = [
            "https://api.piloterr.com/v1",
            "https://piloterr.com/api/v1",
            "https://api.piloterr.com",
            "https://piloterr.com/api"
        ]
        self.base_url = self.possible_base_urls[0]  # Default
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "X-API-Key": api_key  # Alternative auth method
        }
    
    def test_api_connection(self) -> Dict[str, Any]:
        """Test basic API connectivity with multiple endpoints"""
        endpoints_to_try = [
            "/health",
            "/status", 
            "/ping",
            "/",
            "/companies",
            "/api/health"
        ]
        
        for base_url in self.possible_base_urls:
            for endpoint in endpoints_to_try:
                try:
                    url = f"{base_url}{endpoint}"
                    response = requests.get(url, headers=self.headers, timeout=10)
                    
                    if response.status_code in [200, 401, 403]:  # 401/403 means endpoint exists but auth issue
                        return {
                            "status": "found_endpoint",
                            "working_url": url,
                            "status_code": response.status_code,
                            "response": response.json() if response.status_code == 200 else response.text[:500]
                        }
                except Exception as e:
                    continue
        
        return {
            "status": "error",
            "error": "No working endpoints found",
            "tried_urls": [f"{url}{endpoint}" for url in self.possible_base_urls for endpoint in endpoints_to_try]
        }
    
    def search_companies(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Search for companies by query"""
        try:
            params = {
                "query": query,
                "limit": limit
            }
            response = requests.get(
                f"{self.base_url}/companies/search", 
                headers=self.headers, 
                params=params
            )
            return {
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "data": response.json() if response.status_code == 200 else response.text
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def get_company_details(self, company_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific company"""
        try:
            response = requests.get(
                f"{self.base_url}/companies/{company_id}", 
                headers=self.headers
            )
            return {
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "data": response.json() if response.status_code == 200 else response.text
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def get_funding_rounds(self, company_id: str) -> Dict[str, Any]:
        """Get funding rounds for a company"""
        try:
            response = requests.get(
                f"{self.base_url}/companies/{company_id}/funding", 
                headers=self.headers
            )
            return {
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "data": response.json() if response.status_code == 200 else response.text
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def search_by_industry(self, industry: str, limit: int = 10) -> Dict[str, Any]:
        """Search companies by industry"""
        try:
            params = {
                "industry": industry,
                "limit": limit
            }
            response = requests.get(
                f"{self.base_url}/companies/by-industry", 
                headers=self.headers, 
                params=params
            )
            return {
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "data": response.json() if response.status_code == 200 else response.text
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

def test_healthtech_companies(api: PiloterrCrunchbaseAPI) -> Dict[str, Any]:
    """Test searching for healthtech companies"""
    print("🔍 Testing healthtech company search...")
    
    # Test different search terms
    search_terms = [
        "healthtech",
        "digital health",
        "healthcare technology",
        "medtech",
        "telemedicine"
    ]
    
    results = {}
    
    for term in search_terms:
        print(f"  Searching for: {term}")
        result = api.search_companies(term, limit=5)
        results[term] = result
        
        if result["status"] == "success":
            print(f"    ✅ Found {len(result['data'].get('companies', []))} companies")
        else:
            print(f"    ❌ Failed: {result.get('error', 'Unknown error')}")
        
        time.sleep(1)  # Rate limiting
    
    return results

def analyze_company_data(api: PiloterrCrunchbaseAPI, company_id: str) -> Dict[str, Any]:
    """Analyze detailed company data structure"""
    print(f"📊 Analyzing company data for ID: {company_id}")
    
    # Get company details
    company_result = api.get_company_details(company_id)
    
    # Get funding rounds
    funding_result = api.get_funding_rounds(company_id)
    
    analysis = {
        "company_details": company_result,
        "funding_rounds": funding_result,
        "data_fields_available": [],
        "useful_fields": []
    }
    
    if company_result["status"] == "success":
        company_data = company_result["data"]
        print(f"  ✅ Company details retrieved")
        
        # Analyze available fields
        if isinstance(company_data, dict):
            available_fields = list(company_data.keys())
            analysis["data_fields_available"] = available_fields
            print(f"  📋 Available fields: {', '.join(available_fields)}")
            
            # Identify useful fields for dashboard
            useful_fields = [
                "name", "description", "industry", "founded_year", 
                "employee_count", "location", "website", "linkedin_url",
                "total_funding", "last_funding_date", "investors"
            ]
            
            found_useful = [field for field in useful_fields if field in available_fields]
            analysis["useful_fields"] = found_useful
            print(f"  🎯 Useful fields found: {', '.join(found_useful)}")
    
    if funding_result["status"] == "success":
        funding_data = funding_result["data"]
        print(f"  ✅ Funding rounds retrieved")
        if isinstance(funding_data, list):
            print(f"  💰 Found {len(funding_data)} funding rounds")
    
    return analysis

def test_api_limits_and_pricing(api: PiloterrCrunchbaseAPI) -> Dict[str, Any]:
    """Test API limits and understand pricing structure"""
    print("💰 Testing API limits and pricing...")
    
    # Test multiple requests to understand rate limits
    test_results = []
    
    for i in range(5):
        print(f"  Request {i+1}/5...")
        result = api.search_companies("healthtech", limit=1)
        test_results.append(result)
        time.sleep(0.5)
    
    # Analyze results
    successful_requests = [r for r in test_results if r["status"] == "success"]
    
    return {
        "total_requests": len(test_results),
        "successful_requests": len(successful_requests),
        "rate_limit_behavior": "stable" if len(successful_requests) == len(test_results) else "limited",
        "recommendations": []
    }

def main():
    """Main test function"""
    print("🚀 Starting Piloterr Crunchbase API Integration Test")
    print("=" * 60)
    
    # Initialize API
    API_KEY = "7a8307b0-0e61-4457-a31a-4dc0dcb93b88"
    api = PiloterrCrunchbaseAPI(API_KEY)
    
    # Test 1: Basic connectivity
    print("\n1️⃣ Testing API connectivity...")
    connection_test = api.test_api_connection()
    print(f"   Status: {connection_test['status']}")
    if connection_test['status'] == 'error':
        print(f"   Error: {connection_test['error']}")
        return
    
    # Test 2: Search healthtech companies
    print("\n2️⃣ Testing healthtech company search...")
    healthtech_results = test_healthtech_companies(api)
    
    # Test 3: Analyze company data structure
    print("\n3️⃣ Analyzing company data structure...")
    if healthtech_results.get("healthtech", {}).get("status") == "success":
        companies = healthtech_results["healthtech"]["data"].get("companies", [])
        if companies:
            first_company_id = companies[0].get("id")
            if first_company_id:
                company_analysis = analyze_company_data(api, first_company_id)
            else:
                print("   ⚠️ No company ID found in results")
        else:
            print("   ⚠️ No companies found in search results")
    
    # Test 4: API limits
    print("\n4️⃣ Testing API limits...")
    limits_test = test_api_limits_and_pricing(api)
    
    # Summary
    print("\n📋 TEST SUMMARY")
    print("=" * 60)
    print(f"✅ API Connection: {connection_test['status']}")
    print(f"✅ Healthtech Search: {'Working' if any(r.get('status') == 'success' for r in healthtech_results.values()) else 'Failed'}")
    print(f"✅ Data Structure: {'Analyzed' if 'company_analysis' in locals() else 'Not analyzed'}")
    print(f"✅ Rate Limits: {limits_test['rate_limit_behavior']}")
    
    # Save results to file
    results = {
        "timestamp": datetime.now().isoformat(),
        "connection_test": connection_test,
        "healthtech_search": healthtech_results,
        "company_analysis": company_analysis if 'company_analysis' in locals() else None,
        "api_limits": limits_test
    }
    
    with open("api_integration_tests/piloterr_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to: api_integration_tests/piloterr_test_results.json")

if __name__ == "__main__":
    main()
