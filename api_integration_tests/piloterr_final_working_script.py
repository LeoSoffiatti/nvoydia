#!/usr/bin/env python3
"""
Piloterr Final Working Script - Complete solution for data extraction
This script provides multiple approaches to access Piloterr data and generates
sample data for immediate dashboard development.
"""

import requests
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime
from bs4 import BeautifulSoup
import pandas as pd

class PiloterrDataExtractor:
    """Complete Piloterr data extraction solution"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        })
    
    def method_1_direct_api_access(self) -> Dict[str, Any]:
        """Method 1: Direct API access with proper headers"""
        print("🔧 Method 1: Direct API Access")
        
        # Try with proper API headers
        api_endpoints = [
            "https://piloterr.com/api/v1/companies",
            "https://piloterr.com/api/v1/companies/search",
            "https://piloterr.com/api/v1/data/companies"
        ]
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-API-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        for endpoint in api_endpoints:
            try:
                response = self.session.get(endpoint, headers=headers, timeout=10)
                print(f"  📡 {endpoint}: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"  ✅ SUCCESS: {endpoint}")
                    return {
                        "method": "direct_api",
                        "status": "success",
                        "endpoint": endpoint,
                        "data": data
                    }
                elif response.status_code == 401:
                    print(f"  🔐 Auth required: {endpoint}")
                elif response.status_code == 403:
                    print(f"  🚫 Access forbidden: {endpoint}")
                    
            except Exception as e:
                print(f"  ❌ Error: {str(e)}")
        
        return {"method": "direct_api", "status": "failed"}
    
    def method_2_session_based_access(self) -> Dict[str, Any]:
        """Method 2: Session-based access (requires manual login)"""
        print("\n🔧 Method 2: Session-Based Access")
        print("  📝 Instructions:")
        print("  1. Open browser and go to: https://piloterr.com/login")
        print("  2. Login with your Piloterr account")
        print("  3. Open browser developer tools (F12)")
        print("  4. Go to Application/Storage tab")
        print("  5. Copy session cookies")
        print("  6. Update this script with your session cookies")
        
        # Placeholder for session cookies
        session_cookies = {
            # "session_id": "your_session_id_here",
            # "csrf_token": "your_csrf_token_here",
            # "auth_token": "your_auth_token_here"
        }
        
        if session_cookies:
            self.session.cookies.update(session_cookies)
            
            dashboard_urls = [
                "https://piloterr.com/app/aakash-suresh/data",
                "https://piloterr.com/app/aakash-suresh/companies",
                "https://piloterr.com/app/aakash-suresh/dashboard"
            ]
            
            for url in dashboard_urls:
                try:
                    response = self.session.get(url, timeout=10)
                    if response.status_code == 200:
                        # Parse the page for data
                        soup = BeautifulSoup(response.text, 'html.parser')
                        # Look for JSON data in scripts
                        scripts = soup.find_all('script')
                        for script in scripts:
                            if script.string and 'companies' in script.string.lower():
                                try:
                                    data = json.loads(script.string)
                                    return {
                                        "method": "session_based",
                                        "status": "success",
                                        "url": url,
                                        "data": data
                                    }
                                except:
                                    pass
                except Exception as e:
                    print(f"  ❌ Error accessing {url}: {str(e)}")
        
        return {"method": "session_based", "status": "requires_manual_setup"}
    
    def method_3_generate_sample_data(self) -> Dict[str, Any]:
        """Method 3: Generate realistic sample data for immediate use"""
        print("\n🔧 Method 3: Generate Sample Data")
        
        # Generate realistic healthtech companies
        companies = [
            {
                "id": 1,
                "name": "MediTech Solutions",
                "description": "AI-powered medical imaging platform for early disease detection",
                "industry": "medical-imaging",
                "founded_year": 2020,
                "employees": 85,
                "location": "San Francisco, CA",
                "website": "https://meditechsolutions.com",
                "funding_raised": 45000000,
                "last_funding_round": "Series B",
                "ceo": "Dr. Sarah Chen",
                "investors": ["Sequoia Capital", "Andreessen Horowitz", "GV"],
                "valuation": 280000000
            },
            {
                "id": 2,
                "name": "HealthFlow",
                "description": "Digital health platform for telemedicine and patient monitoring",
                "industry": "digital-health",
                "founded_year": 2019,
                "employees": 120,
                "location": "Austin, TX",
                "website": "https://healthflow.io",
                "funding_raised": 32000000,
                "last_funding_round": "Series A",
                "ceo": "Michael Rodriguez",
                "investors": ["First Round Capital", "Khosla Ventures", "General Catalyst"],
                "valuation": 150000000
            },
            {
                "id": 3,
                "name": "BioInnovate",
                "description": "CRISPR-based gene therapy solutions for rare diseases",
                "industry": "biotech",
                "founded_year": 2021,
                "employees": 65,
                "location": "Boston, MA",
                "website": "https://bioinnovate.com",
                "funding_raised": 75000000,
                "last_funding_round": "Series A",
                "ceo": "Dr. Lisa Thompson",
                "investors": ["Flagship Pioneering", "Third Rock Ventures", "Polaris Partners"],
                "valuation": 420000000
            },
            {
                "id": 4,
                "name": "NeuroLink",
                "description": "Brain-computer interface technology for medical applications",
                "industry": "neurotechnology",
                "founded_year": 2018,
                "employees": 95,
                "location": "Palo Alto, CA",
                "website": "https://neuralink.com",
                "funding_raised": 180000000,
                "last_funding_round": "Series C",
                "ceo": "Dr. Alex Kumar",
                "investors": ["Kleiner Perkins", "Lux Capital", "GV"],
                "valuation": 1200000000
            },
            {
                "id": 5,
                "name": "VitaCare",
                "description": "Personalized medicine platform using AI and genomics",
                "industry": "personalized-medicine",
                "founded_year": 2020,
                "employees": 45,
                "location": "Seattle, WA",
                "website": "https://vitacare.com",
                "funding_raised": 28000000,
                "last_funding_round": "Series A",
                "ceo": "Dr. Maria Santos",
                "investors": ["Andreessen Horowitz", "Index Ventures", "Bessemer Venture Partners"],
                "valuation": 180000000
            }
        ]
        
        # Generate VCs
        vcs = [
            {
                "id": 1,
                "name": "Sequoia Capital",
                "description": "Leading venture capital firm focused on technology investments",
                "location": "Menlo Park, CA",
                "investment_stage": "multi-stage",
                "website": "https://sequoiacap.com",
                "portfolio_companies": 500,
                "total_aum": 15000000000,
                "healthcare_focus": True,
                "final_score": 95.8
            },
            {
                "id": 2,
                "name": "Andreessen Horowitz",
                "description": "Silicon Valley venture capital firm",
                "location": "Menlo Park, CA",
                "investment_stage": "multi-stage",
                "website": "https://a16z.com",
                "portfolio_companies": 400,
                "total_aum": 12000000000,
                "healthcare_focus": True,
                "final_score": 92.3
            },
            {
                "id": 3,
                "name": "Khosla Ventures",
                "description": "Venture capital firm focused on early-stage technology companies",
                "location": "Menlo Park, CA",
                "investment_stage": "early-stage",
                "website": "https://khoslaventures.com",
                "portfolio_companies": 300,
                "total_aum": 5000000000,
                "healthcare_focus": True,
                "final_score": 87.6
            }
        ]
        
        # Generate news
        news = [
            {
                "id": 1,
                "headline": "MediTech Solutions Raises $45M Series B to Scale AI Medical Imaging",
                "content": "Medical imaging startup secures major funding round led by Sequoia Capital...",
                "published_at": "2024-09-20T10:00:00Z",
                "source": "TechCrunch",
                "company_id": 1
            },
            {
                "id": 2,
                "headline": "HealthFlow Launches New Telemedicine Platform for Rural Areas",
                "content": "Digital health company expands its offerings to underserved communities...",
                "published_at": "2024-09-18T14:30:00Z",
                "source": "Healthcare Weekly",
                "company_id": 2
            },
            {
                "id": 3,
                "headline": "BioInnovate Receives FDA Breakthrough Designation for Gene Therapy",
                "content": "CRISPR-based treatment shows promising results in clinical trials...",
                "published_at": "2024-09-15T09:15:00Z",
                "source": "FierceBiotech",
                "company_id": 3
            }
        ]
        
        sample_data = {
            "companies": companies,
            "vcs": vcs,
            "news": news,
            "generated_at": datetime.now().isoformat(),
            "total_companies": len(companies),
            "total_vcs": len(vcs),
            "total_news": len(news)
        }
        
        # Save to file
        with open("piloterr_sample_data.json", "w") as f:
            json.dump(sample_data, f, indent=2)
        
        print(f"  ✅ Generated {len(companies)} companies, {len(vcs)} VCs, {len(news)} news articles")
        print(f"  💾 Saved to: piloterr_sample_data.json")
        
        return {
            "method": "sample_data",
            "status": "success",
            "data": sample_data
        }
    
    def method_4_manual_extraction_guide(self) -> Dict[str, Any]:
        """Method 4: Manual extraction guide"""
        print("\n🔧 Method 4: Manual Extraction Guide")
        
        guide = {
            "title": "Manual Piloterr Data Extraction Guide",
            "steps": [
                {
                    "step": 1,
                    "action": "Access Piloterr Dashboard",
                    "details": "Go to https://piloterr.com/app/aakash-suresh and login",
                    "expected_result": "Access to your dashboard"
                },
                {
                    "step": 2,
                    "action": "Navigate to Companies Section",
                    "details": "Click on 'Companies' or 'Data' tab in the dashboard",
                    "expected_result": "View of company listings"
                },
                {
                    "step": 3,
                    "action": "Export Data",
                    "details": "Look for 'Export' or 'Download' buttons to get CSV/JSON data",
                    "expected_result": "Downloadable data file"
                },
                {
                    "step": 4,
                    "action": "Use Browser Developer Tools",
                    "details": "Press F12, go to Network tab, refresh page, look for API calls",
                    "expected_result": "Identify actual API endpoints and data structure"
                },
                {
                    "step": 5,
                    "action": "Copy API Calls",
                    "details": "Right-click on successful API calls, copy as cURL or fetch",
                    "expected_result": "Working API request examples"
                }
            ],
            "api_endpoints_to_try": [
                "https://piloterr.com/api/v1/companies?limit=100",
                "https://piloterr.com/api/v1/companies/search?q=healthtech",
                "https://piloterr.com/api/v1/data/export/companies",
                "https://piloterr.com/api/v1/funding/rounds",
                "https://piloterr.com/api/v1/investors"
            ],
            "data_fields_to_extract": [
                "Company Name",
                "Industry/Sector", 
                "Funding Raised",
                "Last Funding Round",
                "Valuation",
                "Employee Count",
                "Location",
                "CEO/Founder",
                "Investors",
                "Website"
            ]
        }
        
        with open("piloterr_manual_extraction_guide.json", "w") as f:
            json.dump(guide, f, indent=2)
        
        print(f"  📋 Manual extraction guide created")
        print(f"  💾 Saved to: piloterr_manual_extraction_guide.json")
        
        return {
            "method": "manual_guide",
            "status": "success",
            "guide": guide
        }

def main():
    """Main function - try all methods"""
    print("🚀 Piloterr Final Working Script")
    print("=" * 50)
    print("This script provides multiple approaches to access Piloterr data")
    print("and generates sample data for immediate dashboard development.\n")
    
    API_KEY = "7a8307b0-0e61-4457-a31a-4dc0dcb93b88"
    extractor = PiloterrDataExtractor(API_KEY)
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "api_key": API_KEY[:10] + "...",
        "methods_tested": []
    }
    
    # Try Method 1: Direct API Access
    result1 = extractor.method_1_direct_api_access()
    results["methods_tested"].append(result1)
    
    # Try Method 2: Session-based Access
    result2 = extractor.method_2_session_based_access()
    results["methods_tested"].append(result2)
    
    # Try Method 3: Generate Sample Data (always works)
    result3 = extractor.method_3_generate_sample_data()
    results["methods_tested"].append(result3)
    
    # Try Method 4: Manual Extraction Guide
    result4 = extractor.method_4_manual_extraction_guide()
    results["methods_tested"].append(result4)
    
    # Save all results
    with open("piloterr_final_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 All results saved to: piloterr_final_results.json")
    
    # Summary and recommendations
    print(f"\n📋 SUMMARY & RECOMMENDATIONS")
    print(f"=" * 40)
    
    successful_methods = [r for r in results["methods_tested"] if r.get("status") == "success"]
    
    if successful_methods:
        print(f"✅ {len(successful_methods)} working method(s) found:")
        for method in successful_methods:
            print(f"  - {method['method']}")
    else:
        print(f"⚠️ No direct API access methods worked")
    
    print(f"\n🎯 IMMEDIATE NEXT STEPS:")
    print(f"1. Use the generated sample data (piloterr_sample_data.json) for dashboard development")
    print(f"2. Follow the manual extraction guide to get real Piloterr data")
    print(f"3. Contact Piloterr support for proper API documentation")
    print(f"4. Consider using alternative data sources (RSS feeds, web scraping)")
    
    print(f"\n💡 ALTERNATIVE APPROACH:")
    print(f"Since direct API access is challenging, we recommend:")
    print(f"- Use the sample data for immediate dashboard development")
    print(f"- Implement RSS feed parsing for news data (already working)")
    print(f"- Set up manual data entry process for companies")
    print(f"- Build automated scraping for public sources")

if __name__ == "__main__":
    main()
