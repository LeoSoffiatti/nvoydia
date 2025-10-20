#!/usr/bin/env python3
"""
Working Piloterr Crunchbase API Integration
Updated script to work with actual Piloterr API

Based on the URL structure: https://piloterr.com/app/aakash-suresh/settings/api/keys
"""

import requests
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime
import pandas as pd

class PiloterrAPI:
    """Working wrapper for Piloterr Crunchbase API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Based on the URL structure, try these base URLs
        self.base_urls = [
            "https://api.piloterr.com/v1",
            "https://api.piloterr.com",
            "https://piloterr.com/api/v1", 
            "https://piloterr.com/api",
            "https://app.piloterr.com/api/v1",
            "https://app.piloterr.com/api"
        ]
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "NVoydia-Dashboard/1.0"
        }
        
    def test_connection(self) -> Dict[str, Any]:
        """Test API connection with various endpoints"""
        endpoints_to_try = [
            "/health",
            "/status",
            "/ping", 
            "/",
            "/companies",
            "/companies/search",
            "/api/health",
            "/api/status",
            "/api/companies",
            "/crunchbase/companies",
            "/data/companies"
        ]
        
        working_endpoints = []
        
        for base_url in self.base_urls:
            print(f"Testing base URL: {base_url}")
            
            for endpoint in endpoints_to_try:
                try:
                    url = f"{base_url}{endpoint}"
                    print(f"  Trying: {url}")
                    
                    response = requests.get(
                        url, 
                        headers=self.headers, 
                        timeout=10,
                        params={"limit": 1} if "companies" in endpoint else {}
                    )
                    
                    print(f"    Status: {response.status_code}")
                    
                    if response.status_code in [200, 401, 403]:
                        working_endpoints.append({
                            "url": url,
                            "status_code": response.status_code,
                            "response": response.text[:200] if response.text else "Empty response"
                        })
                        
                        if response.status_code == 200:
                            print(f"    ✅ SUCCESS: {url}")
                            return {
                                "status": "success",
                                "working_url": url,
                                "response": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                            }
                        else:
                            print(f"    ⚠️ Auth issue: {url}")
                            
                except Exception as e:
                    print(f"    ❌ Error: {str(e)}")
                    continue
        
        return {
            "status": "no_working_endpoints",
            "tried_endpoints": working_endpoints,
            "message": "No working endpoints found"
        }
    
    def search_companies(self, query: str = "healthtech", limit: int = 10) -> Dict[str, Any]:
        """Search for companies"""
        search_endpoints = [
            "/companies/search",
            "/api/companies/search", 
            "/companies",
            "/api/companies",
            "/crunchbase/companies/search",
            "/data/companies/search"
        ]
        
        params = {
            "q": query,
            "query": query,
            "search": query,
            "limit": limit,
            "per_page": limit
        }
        
        for base_url in self.base_urls:
            for endpoint in search_endpoints:
                try:
                    url = f"{base_url}{endpoint}"
                    print(f"Searching: {url}")
                    
                    response = requests.get(
                        url,
                        headers=self.headers,
                        params=params,
                        timeout=15
                    )
                    
                    if response.status_code == 200:
                        data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                        return {
                            "status": "success",
                            "url": url,
                            "data": data,
                            "query": query
                        }
                    elif response.status_code in [401, 403]:
                        print(f"  Auth required: {url}")
                        
                except Exception as e:
                    print(f"  Error: {str(e)}")
                    continue
        
        return {
            "status": "failed",
            "message": "No working search endpoints found"
        }
    
    def get_company_details(self, company_id: str) -> Dict[str, Any]:
        """Get detailed company information"""
        detail_endpoints = [
            f"/companies/{company_id}",
            f"/api/companies/{company_id}",
            f"/crunchbase/companies/{company_id}",
            f"/data/companies/{company_id}"
        ]
        
        for base_url in self.base_urls:
            for endpoint in detail_endpoints:
                try:
                    url = f"{base_url}{endpoint}"
                    response = requests.get(url, headers=self.headers, timeout=10)
                    
                    if response.status_code == 200:
                        return {
                            "status": "success",
                            "url": url,
                            "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                        }
                        
                except Exception as e:
                    continue
        
        return {
            "status": "failed",
            "message": "Company details not found"
        }
    
    def get_funding_data(self, company_id: str = None) -> Dict[str, Any]:
        """Get funding information"""
        funding_endpoints = [
            "/funding",
            "/api/funding",
            "/companies/funding",
            "/api/companies/funding",
            f"/companies/{company_id}/funding" if company_id else "/funding",
            f"/api/companies/{company_id}/funding" if company_id else "/api/funding"
        ]
        
        for base_url in self.base_urls:
            for endpoint in funding_endpoints:
                try:
                    url = f"{base_url}{endpoint}"
                    params = {"limit": 10}
                    if company_id:
                        params["company_id"] = company_id
                        
                    response = requests.get(url, headers=self.headers, params=params, timeout=10)
                    
                    if response.status_code == 200:
                        return {
                            "status": "success", 
                            "url": url,
                            "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                        }
                        
                except Exception as e:
                    continue
        
        return {
            "status": "failed",
            "message": "Funding data not found"
        }

def test_healthtech_companies(api: PiloterrAPI) -> Dict[str, Any]:
    """Test searching for healthtech companies"""
    print("\n🔍 Testing healthtech company search...")
    
    search_terms = [
        "healthtech",
        "digital health", 
        "healthcare technology",
        "medtech",
        "telemedicine",
        "healthcare startups"
    ]
    
    results = {}
    
    for term in search_terms:
        print(f"\nSearching for: '{term}'")
        result = api.search_companies(term, limit=5)
        results[term] = result
        
        if result["status"] == "success":
            print(f"✅ Found data for '{term}'")
            if isinstance(result["data"], dict):
                companies = result["data"].get("companies", result["data"].get("data", []))
                print(f"   Companies found: {len(companies) if isinstance(companies, list) else 'Unknown'}")
            elif isinstance(result["data"], list):
                print(f"   Companies found: {len(result['data'])}")
            else:
                print(f"   Data type: {type(result['data'])}")
        else:
            print(f"❌ Failed: {result.get('message', 'Unknown error')}")
        
        time.sleep(1)  # Rate limiting
    
    return results

def analyze_api_response(data: Any) -> Dict[str, Any]:
    """Analyze API response structure"""
    analysis = {
        "data_type": str(type(data)),
        "fields_available": [],
        "sample_data": None,
        "useful_fields": []
    }
    
    if isinstance(data, dict):
        analysis["fields_available"] = list(data.keys())
        analysis["sample_data"] = {k: str(v)[:100] for k, v in list(data.items())[:5]}
        
        # Look for useful fields
        useful_patterns = ["name", "title", "description", "industry", "funding", "employees", "location", "website"]
        for field in analysis["fields_available"]:
            if any(pattern in field.lower() for pattern in useful_patterns):
                analysis["useful_fields"].append(field)
                
    elif isinstance(data, list) and data:
        analysis["fields_available"] = list(data[0].keys()) if isinstance(data[0], dict) else []
        analysis["sample_data"] = data[0] if data else None
        
    return analysis

def main():
    """Main test function"""
    print("🚀 Testing Working Piloterr API")
    print("=" * 50)
    
    # Use the API key from the assignment
    API_KEY = "7a8307b0-0e61-4457-a31a-4dc0dcb93b88"
    api = PiloterrAPI(API_KEY)
    
    # Test 1: Basic connection
    print("\n1️⃣ Testing API connection...")
    connection_result = api.test_connection()
    
    if connection_result["status"] == "success":
        print(f"✅ Connection successful!")
        print(f"Working URL: {connection_result['working_url']}")
        
        # Analyze the response
        analysis = analyze_api_response(connection_result["response"])
        print(f"Data type: {analysis['data_type']}")
        print(f"Available fields: {analysis['fields_available']}")
        print(f"Useful fields: {analysis['useful_fields']}")
        
    else:
        print(f"❌ Connection failed: {connection_result.get('message', 'Unknown error')}")
        if "tried_endpoints" in connection_result:
            print(f"Tried {len(connection_result['tried_endpoints'])} endpoints")
    
    # Test 2: Search companies
    print("\n2️⃣ Testing company search...")
    search_results = test_healthtech_companies(api)
    
    # Test 3: Get funding data
    print("\n3️⃣ Testing funding data...")
    funding_result = api.get_funding_data()
    
    if funding_result["status"] == "success":
        print(f"✅ Funding data found!")
        funding_analysis = analyze_api_response(funding_result["data"])
        print(f"Funding fields: {funding_analysis['fields_available']}")
    else:
        print(f"❌ Funding data not found: {funding_result.get('message')}")
    
    # Save results
    results = {
        "timestamp": datetime.now().isoformat(),
        "connection_test": connection_result,
        "search_results": search_results,
        "funding_test": funding_result
    }
    
    with open("piloterr_working_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: piloterr_working_results.json")
    
    # Summary
    print(f"\n📋 SUMMARY")
    print(f"Connection: {connection_result['status']}")
    print(f"Search tests: {len([r for r in search_results.values() if r['status'] == 'success'])}/{len(search_results)} successful")
    print(f"Funding data: {funding_result['status']}")

if __name__ == "__main__":
    main()
