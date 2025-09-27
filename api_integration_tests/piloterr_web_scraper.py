#!/usr/bin/env python3
"""
Piloterr Web Scraper - Alternative approach to access Piloterr data
Since the REST API is not accessible, we'll try web scraping approaches
"""

import requests
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime
from bs4 import BeautifulSoup
import pandas as pd

class PiloterrWebScraper:
    """Web scraper for Piloterr data"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        })
        
    def test_login_access(self) -> Dict[str, Any]:
        """Test if we can access the Piloterr dashboard"""
        login_urls = [
            "https://piloterr.com/login",
            "https://piloterr.com/signin", 
            "https://app.piloterr.com/login",
            "https://piloterr.com/app/login"
        ]
        
        results = {}
        
        for url in login_urls:
            try:
                response = self.session.get(url, timeout=10)
                results[url] = {
                    "status_code": response.status_code,
                    "accessible": response.status_code == 200,
                    "title": self._extract_title(response.text)
                }
                print(f"✅ {url}: {response.status_code}")
                
            except Exception as e:
                results[url] = {
                    "status_code": None,
                    "accessible": False,
                    "error": str(e)
                }
                print(f"❌ {url}: {str(e)}")
        
        return results
    
    def _extract_title(self, html: str) -> str:
        """Extract page title from HTML"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            title_tag = soup.find('title')
            return title_tag.get_text().strip() if title_tag else "No title"
        except:
            return "Parse error"
    
    def test_api_endpoints_with_auth(self) -> Dict[str, Any]:
        """Test API endpoints with different authentication methods"""
        
        # Try different authentication headers
        auth_methods = [
            {"Authorization": f"Bearer {self.api_key}"},
            {"X-API-Key": self.api_key},
            {"api-key": self.api_key},
            {"token": self.api_key},
            {"X-Auth-Token": self.api_key},
            {"Authorization": f"Token {self.api_key}"},
            {"Authorization": f"ApiKey {self.api_key}"}
        ]
        
        endpoints = [
            "https://piloterr.com/api/v1/companies",
            "https://piloterr.com/api/v1/companies/search",
            "https://piloterr.com/api/companies",
            "https://piloterr.com/api/data/companies",
            "https://piloterr.com/api/crunchbase/companies"
        ]
        
        results = {}
        
        for endpoint in endpoints:
            results[endpoint] = {}
            
            for i, auth_header in enumerate(auth_methods):
                try:
                    headers = {**self.session.headers, **auth_header}
                    response = self.session.get(
                        endpoint, 
                        headers=headers, 
                        timeout=10,
                        params={"limit": 1}
                    )
                    
                    auth_method_name = list(auth_header.keys())[0]
                    results[endpoint][auth_method_name] = {
                        "status_code": response.status_code,
                        "content_type": response.headers.get('content-type', ''),
                        "response_preview": response.text[:200] if response.text else ""
                    }
                    
                    print(f"🔑 {endpoint} with {auth_method_name}: {response.status_code}")
                    
                    if response.status_code == 200:
                        print(f"✅ SUCCESS: {endpoint} with {auth_method_name}")
                        return {
                            "working_endpoint": endpoint,
                            "working_auth": auth_method_name,
                            "response": response.json() if 'application/json' in response.headers.get('content-type', '') else response.text
                        }
                        
                except Exception as e:
                    auth_method_name = list(auth_header.keys())[0]
                    results[endpoint][auth_method_name] = {"error": str(e)}
                    print(f"❌ {endpoint} with {auth_method_name}: {str(e)}")
        
        return {"results": results, "status": "no_working_combination"}
    
    def try_graphql_endpoint(self) -> Dict[str, Any]:
        """Try GraphQL endpoint if it exists"""
        graphql_urls = [
            "https://piloterr.com/graphql",
            "https://piloterr.com/api/graphql", 
            "https://app.piloterr.com/graphql",
            "https://piloterr.com/api/v1/graphql"
        ]
        
        # Sample GraphQL query for companies
        sample_query = {
            "query": """
                query {
                    companies(first: 5) {
                        edges {
                            node {
                                id
                                name
                                description
                                industry
                            }
                        }
                    }
                }
            """
        }
        
        for url in graphql_urls:
            try:
                headers = {
                    **self.session.headers,
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                response = self.session.post(url, json=sample_query, headers=headers, timeout=10)
                
                print(f"🔍 GraphQL {url}: {response.status_code}")
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if "data" in data or "errors" in data:
                            print(f"✅ GraphQL working: {url}")
                            return {
                                "status": "success",
                                "url": url,
                                "data": data
                            }
                    except:
                        pass
                        
            except Exception as e:
                print(f"❌ GraphQL {url}: {str(e)}")
        
        return {"status": "no_working_graphql"}
    
    def try_webhook_or_export_endpoints(self) -> Dict[str, Any]:
        """Try to find webhook or export endpoints"""
        export_urls = [
            "https://piloterr.com/api/v1/export/companies",
            "https://piloterr.com/api/export/companies", 
            "https://piloterr.com/api/v1/data/export",
            "https://piloterr.com/export/companies",
            "https://piloterr.com/api/v1/companies/export"
        ]
        
        for url in export_urls:
            try:
                headers = {
                    **self.session.headers,
                    "Authorization": f"Bearer {self.api_key}",
                    "Accept": "application/json,text/csv,application/vnd.ms-excel"
                }
                
                response = self.session.get(url, headers=headers, timeout=10)
                print(f"📊 Export {url}: {response.status_code}")
                
                if response.status_code == 200:
                    content_type = response.headers.get('content-type', '')
                    print(f"✅ Export working: {url} ({content_type})")
                    return {
                        "status": "success",
                        "url": url,
                        "content_type": content_type,
                        "data_preview": response.text[:500] if response.text else ""
                    }
                    
            except Exception as e:
                print(f"❌ Export {url}: {str(e)}")
        
        return {"status": "no_working_export"}
    
    def scrape_public_pages(self) -> Dict[str, Any]:
        """Try to scrape any public Piloterr pages for company data"""
        public_urls = [
            "https://piloterr.com/companies",
            "https://piloterr.com/portfolio",
            "https://piloterr.com/data",
            "https://piloterr.com/samples",
            "https://piloterr.com/demo"
        ]
        
        results = {}
        
        for url in public_urls:
            try:
                response = self.session.get(url, timeout=10)
                print(f"🌐 Public page {url}: {response.status_code}")
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Look for company data in various formats
                    companies_found = []
                    
                    # Look for JSON-LD structured data
                    json_scripts = soup.find_all('script', type='application/ld+json')
                    for script in json_scripts:
                        try:
                            data = json.loads(script.string)
                            if isinstance(data, dict) and 'name' in data:
                                companies_found.append(data)
                        except:
                            pass
                    
                    # Look for data attributes
                    data_elements = soup.find_all(attrs={"data-company": True})
                    for elem in data_elements:
                        companies_found.append({"name": elem.get('data-company')})
                    
                    results[url] = {
                        "status_code": response.status_code,
                        "companies_found": len(companies_found),
                        "companies": companies_found[:5],  # First 5
                        "page_title": self._extract_title(response.text)
                    }
                    
                    if companies_found:
                        print(f"✅ Found {len(companies_found)} companies on {url}")
                else:
                    results[url] = {"status_code": response.status_code}
                    
            except Exception as e:
                results[url] = {"error": str(e)}
                print(f"❌ Public page {url}: {str(e)}")
        
        return results

def main():
    """Main function to test all Piloterr access methods"""
    print("🚀 Testing Piloterr Web Access Methods")
    print("=" * 50)
    
    API_KEY = "7a8307b0-0e61-4457-a31a-4dc0dcb93b88"
    scraper = PiloterrWebScraper(API_KEY)
    
    all_results = {
        "timestamp": datetime.now().isoformat(),
        "api_key": API_KEY[:10] + "..."  # Partial key for security
    }
    
    # Test 1: Login page access
    print("\n1️⃣ Testing login page access...")
    login_results = scraper.test_login_access()
    all_results["login_access"] = login_results
    
    # Test 2: API endpoints with different auth methods
    print("\n2️⃣ Testing API endpoints with different auth methods...")
    api_results = scraper.test_api_endpoints_with_auth()
    all_results["api_auth_tests"] = api_results
    
    # Test 3: GraphQL endpoints
    print("\n3️⃣ Testing GraphQL endpoints...")
    graphql_results = scraper.try_graphql_endpoint()
    all_results["graphql_tests"] = graphql_results
    
    # Test 4: Export endpoints
    print("\n4️⃣ Testing export endpoints...")
    export_results = scraper.try_webhook_or_export_endpoints()
    all_results["export_tests"] = export_results
    
    # Test 5: Public pages scraping
    print("\n5️⃣ Testing public pages...")
    public_results = scraper.scrape_public_pages()
    all_results["public_pages"] = public_results
    
    # Save results
    with open("piloterr_web_access_results.json", "w") as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: piloterr_web_access_results.json")
    
    # Summary
    print(f"\n📋 SUMMARY")
    print(f"Login pages accessible: {len([r for r in login_results.values() if r.get('accessible', False)])}")
    print(f"API auth methods tested: {len(api_results.get('results', {}))}")
    print(f"GraphQL status: {graphql_results.get('status', 'unknown')}")
    print(f"Export endpoints: {export_results.get('status', 'unknown')}")
    print(f"Public pages with data: {len([r for r in public_results.values() if r.get('companies_found', 0) > 0])}")

if __name__ == "__main__":
    main()
