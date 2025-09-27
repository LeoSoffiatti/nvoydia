#!/usr/bin/env python3
"""
Piloterr Browser Session - Try to access data through web interface
This script attempts to authenticate and access data through the web interface
"""

import requests
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime
from bs4 import BeautifulSoup
import re

class PiloterrBrowserSession:
    """Browser session for Piloterr web interface"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none"
        })
        
    def get_csrf_token(self, url: str) -> Optional[str]:
        """Extract CSRF token from login page"""
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for CSRF token in various places
            csrf_selectors = [
                'input[name="_token"]',
                'input[name="csrf_token"]', 
                'input[name="authenticity_token"]',
                'meta[name="csrf-token"]',
                'meta[name="_token"]'
            ]
            
            for selector in csrf_selectors:
                element = soup.select_one(selector)
                if element:
                    token = element.get('value') or element.get('content')
                    if token:
                        print(f"✅ Found CSRF token: {selector}")
                        return token
            
            print("❌ No CSRF token found")
            return None
            
        except Exception as e:
            print(f"❌ Error getting CSRF token: {str(e)}")
            return None
    
    def try_api_key_login(self) -> Dict[str, Any]:
        """Try to use API key for authentication"""
        
        # Try different login endpoints
        login_endpoints = [
            "https://piloterr.com/login",
            "https://piloterr.com/app/login",
            "https://piloterr.com/api/auth/login",
            "https://piloterr.com/api/v1/auth/login"
        ]
        
        results = {}
        
        for endpoint in login_endpoints:
            try:
                print(f"\n🔑 Trying login at: {endpoint}")
                
                # Get CSRF token first
                csrf_token = self.get_csrf_token(endpoint)
                
                # Prepare login data
                login_data = {
                    "api_key": self.api_key,
                    "token": self.api_key,
                    "key": self.api_key
                }
                
                if csrf_token:
                    login_data["_token"] = csrf_token
                    login_data["csrf_token"] = csrf_token
                
                # Try different field names
                login_payloads = [
                    {"api_key": self.api_key},
                    {"token": self.api_key},
                    {"key": self.api_key},
                    {"access_token": self.api_key},
                    {"auth_token": self.api_key},
                    {"api_token": self.api_key}
                ]
                
                if csrf_token:
                    for payload in login_payloads:
                        payload["_token"] = csrf_token
                
                for i, payload in enumerate(login_payloads):
                    try:
                        headers = {
                            **self.session.headers,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "X-Requested-With": "XMLHttpRequest"
                        }
                        
                        response = self.session.post(
                            endpoint,
                            data=payload,
                            headers=headers,
                            timeout=10,
                            allow_redirects=False
                        )
                        
                        print(f"  Payload {i+1}: {response.status_code}")
                        
                        if response.status_code in [200, 302, 201]:
                            print(f"  ✅ Potential success: {response.status_code}")
                            
                            # Check for authentication cookies or tokens
                            cookies = dict(self.session.cookies)
                            response_text = response.text
                            
                            results[f"{endpoint}_payload_{i+1}"] = {
                                "status_code": response.status_code,
                                "cookies": list(cookies.keys()),
                                "response_preview": response_text[:200],
                                "success": True
                            }
                            
                            return {
                                "status": "success",
                                "endpoint": endpoint,
                                "payload": payload,
                                "cookies": cookies,
                                "response": response_text
                            }
                            
                    except Exception as e:
                        print(f"  ❌ Payload {i+1} error: {str(e)}")
                        
            except Exception as e:
                print(f"❌ Endpoint error: {str(e)}")
                results[endpoint] = {"error": str(e)}
        
        return {"status": "failed", "results": results}
    
    def try_direct_api_access(self) -> Dict[str, Any]:
        """Try direct API access with session cookies"""
        
        # After potential login, try API endpoints
        api_endpoints = [
            "https://piloterr.com/api/v1/companies",
            "https://piloterr.com/api/companies",
            "https://piloterr.com/api/data/companies"
        ]
        
        results = {}
        
        for endpoint in api_endpoints:
            try:
                # Try with different content types
                content_types = [
                    "application/json",
                    "application/x-www-form-urlencoded", 
                    "multipart/form-data"
                ]
                
                for content_type in content_types:
                    headers = {
                        **self.session.headers,
                        "Content-Type": content_type,
                        "X-Requested-With": "XMLHttpRequest",
                        "Accept": "application/json, text/plain, */*"
                    }
                    
                    # Try GET first
                    response = self.session.get(endpoint, headers=headers, timeout=10)
                    print(f"🔍 GET {endpoint} ({content_type}): {response.status_code}")
                    
                    if response.status_code == 200:
                        try:
                            data = response.json()
                            print(f"✅ JSON response from {endpoint}")
                            return {
                                "status": "success",
                                "endpoint": endpoint,
                                "method": "GET",
                                "data": data
                            }
                        except:
                            print(f"✅ Non-JSON response from {endpoint}")
                            return {
                                "status": "success",
                                "endpoint": endpoint,
                                "method": "GET", 
                                "data": response.text[:500]
                            }
                    
                    # Try POST with API key
                    post_data = {"api_key": self.api_key}
                    response = self.session.post(endpoint, data=post_data, headers=headers, timeout=10)
                    print(f"📝 POST {endpoint} ({content_type}): {response.status_code}")
                    
                    if response.status_code == 200:
                        try:
                            data = response.json()
                            print(f"✅ JSON response from POST {endpoint}")
                            return {
                                "status": "success",
                                "endpoint": endpoint,
                                "method": "POST",
                                "data": data
                            }
                        except:
                            print(f"✅ Non-JSON response from POST {endpoint}")
                            return {
                                "status": "success",
                                "endpoint": endpoint,
                                "method": "POST",
                                "data": response.text[:500]
                            }
                    
            except Exception as e:
                print(f"❌ {endpoint}: {str(e)}")
                results[endpoint] = {"error": str(e)}
        
        return {"status": "failed", "results": results}
    
    def try_dashboard_access(self) -> Dict[str, Any]:
        """Try to access dashboard pages that might contain data"""
        
        dashboard_urls = [
            "https://piloterr.com/app/aakash-suresh",
            "https://piloterr.com/app/aakash-suresh/dashboard",
            "https://piloterr.com/app/aakash-suresh/data",
            "https://piloterr.com/app/aakash-suresh/companies",
            "https://piloterr.com/app/aakash-suresh/api/keys",
            "https://piloterr.com/app/aakash-suresh/settings",
            "https://piloterr.com/dashboard",
            "https://piloterr.com/app/dashboard"
        ]
        
        results = {}
        
        for url in dashboard_urls:
            try:
                response = self.session.get(url, timeout=10)
                print(f"🏠 Dashboard {url}: {response.status_code}")
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Look for data in various formats
                    page_data = {
                        "status_code": response.status_code,
                        "title": soup.find('title').get_text() if soup.find('title') else "No title",
                        "scripts": len(soup.find_all('script')),
                        "json_scripts": 0,
                        "data_attributes": 0,
                        "api_calls": []
                    }
                    
                    # Look for JSON data in scripts
                    scripts = soup.find_all('script')
                    for script in scripts:
                        if script.string:
                            # Look for API calls or data
                            if 'api' in script.string.lower() or 'fetch' in script.string.lower():
                                page_data["api_calls"].append(script.string[:100])
                            
                            # Look for JSON data
                            try:
                                json_data = json.loads(script.string)
                                if isinstance(json_data, (dict, list)):
                                    page_data["json_scripts"] += 1
                            except:
                                pass
                    
                    # Look for data attributes
                    data_elements = soup.find_all(attrs=re.compile(r'data-'))
                    page_data["data_attributes"] = len(data_elements)
                    
                    results[url] = page_data
                    
                    if page_data["json_scripts"] > 0 or page_data["data_attributes"] > 0:
                        print(f"✅ Found data on {url}")
                
                else:
                    results[url] = {"status_code": response.status_code}
                    
            except Exception as e:
                print(f"❌ {url}: {str(e)}")
                results[url] = {"error": str(e)}
        
        return results

def main():
    """Main function to test browser session access"""
    print("🚀 Testing Piloterr Browser Session Access")
    print("=" * 50)
    
    API_KEY = "7a8307b0-0e61-4457-a31a-4dc0dcb93b88"
    session = PiloterrBrowserSession(API_KEY)
    
    all_results = {
        "timestamp": datetime.now().isoformat(),
        "api_key": API_KEY[:10] + "..."
    }
    
    # Test 1: Try API key login
    print("\n1️⃣ Testing API key login...")
    login_results = session.try_api_key_login()
    all_results["login_attempts"] = login_results
    
    # Test 2: Try direct API access
    print("\n2️⃣ Testing direct API access...")
    api_results = session.try_direct_api_access()
    all_results["api_access"] = api_results
    
    # Test 3: Try dashboard access
    print("\n3️⃣ Testing dashboard access...")
    dashboard_results = session.try_dashboard_access()
    all_results["dashboard_access"] = dashboard_results
    
    # Save results
    with open("piloterr_browser_session_results.json", "w") as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: piloterr_browser_session_results.json")
    
    # Summary
    print(f"\n📋 SUMMARY")
    print(f"Login attempts: {len(login_results.get('results', {}))}")
    print(f"API access status: {api_results.get('status', 'unknown')}")
    print(f"Dashboard pages accessible: {len([r for r in dashboard_results.values() if r.get('status_code') == 200])}")
    
    # Check for any successful data access
    if login_results.get('status') == 'success':
        print(f"✅ LOGIN SUCCESS: {login_results.get('endpoint')}")
    if api_results.get('status') == 'success':
        print(f"✅ API SUCCESS: {api_results.get('endpoint')}")

if __name__ == "__main__":
    main()
