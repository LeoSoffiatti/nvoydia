#!/usr/bin/env python3
"""
Additional Sources Integration Test
Assignment 4.1 - API Integration Tests

This script tests alternative data sources for healthtech companies including:
- TechCrunch healthtech articles
- Y Combinator healthcare companies
- Other structured content sources
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime
import re

class TechCrunchScraper:
    """Scraper for TechCrunch healthtech content"""
    
    def __init__(self):
        self.base_url = "https://techcrunch.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    
    def scrape_healthtech_articles(self, limit: int = 10) -> Dict[str, Any]:
        """Scrape healthtech articles from TechCrunch"""
        try:
            url = f"{self.base_url}/tag/healthtech/"
            response = requests.get(url, headers=self.headers)
            
            if response.status_code != 200:
                return {
                    "status": "failed",
                    "error": f"HTTP {response.status_code}"
                }
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find article elements (this may need adjustment based on actual HTML structure)
            articles = soup.find_all('article', limit=limit)
            
            scraped_articles = []
            for article in articles:
                title_elem = article.find('h2') or article.find('h3')
                link_elem = article.find('a')
                date_elem = article.find('time')
                
                if title_elem and link_elem:
                    article_data = {
                        "title": title_elem.get_text(strip=True),
                        "url": link_elem.get('href', ''),
                        "date": date_elem.get_text(strip=True) if date_elem else None
                    }
                    scraped_articles.append(article_data)
            
            return {
                "status": "success",
                "articles_found": len(scraped_articles),
                "articles": scraped_articles
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

class YCombinatorScraper:
    """Scraper for Y Combinator healthcare companies"""
    
    def __init__(self):
        self.base_url = "https://www.ycombinator.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    
    def scrape_healthcare_companies(self, limit: int = 20) -> Dict[str, Any]:
        """Scrape healthcare companies from Y Combinator"""
        try:
            url = f"{self.base_url}/companies/industry/healthcare/san-francisco-bay-area"
            response = requests.get(url, headers=self.headers)
            
            if response.status_code != 200:
                return {
                    "status": "failed",
                    "error": f"HTTP {response.status_code}"
                }
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for company cards or listings
            company_elements = soup.find_all(['div', 'article'], class_=re.compile(r'company|card|listing'), limit=limit)
            
            companies = []
            for element in company_elements:
                name_elem = element.find(['h3', 'h4', 'h5'], class_=re.compile(r'name|title'))
                description_elem = element.find(['p', 'div'], class_=re.compile(r'description|summary'))
                link_elem = element.find('a')
                
                if name_elem:
                    company_data = {
                        "name": name_elem.get_text(strip=True),
                        "description": description_elem.get_text(strip=True) if description_elem else None,
                        "url": link_elem.get('href', '') if link_elem else None
                    }
                    companies.append(company_data)
            
            return {
                "status": "success",
                "companies_found": len(companies),
                "companies": companies
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

class NewsAPITester:
    """Test NewsAPI for healthtech news"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2"
        self.headers = {"X-API-Key": api_key} if api_key else {}
    
    def search_healthtech_news(self, limit: int = 10) -> Dict[str, Any]:
        """Search for healthtech news using NewsAPI"""
        if not self.api_key:
            return {
                "status": "no_api_key",
                "message": "NewsAPI key not provided"
            }
        
        try:
            params = {
                "q": "healthtech OR digital health OR healthcare technology",
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": limit
            }
            
            response = requests.get(
                f"{self.base_url}/everything",
                headers=self.headers,
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "success",
                    "total_results": data.get("totalResults", 0),
                    "articles": data.get("articles", [])
                }
            else:
                return {
                    "status": "failed",
                    "error": f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

def test_techcrunch_source():
    """Test TechCrunch scraping"""
    print("📰 Testing TechCrunch healthtech scraping...")
    
    scraper = TechCrunchScraper()
    result = scraper.scrape_healthtech_articles(limit=5)
    
    if result["status"] == "success":
        print(f"  ✅ Found {result['articles_found']} articles")
        for article in result["articles"][:3]:  # Show first 3
            print(f"    📄 {article['title']}")
    else:
        print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")
    
    return result

def test_ycombinator_source():
    """Test Y Combinator scraping"""
    print("🏢 Testing Y Combinator healthcare companies...")
    
    scraper = YCombinatorScraper()
    result = scraper.scrape_healthcare_companies(limit=10)
    
    if result["status"] == "success":
        print(f"  ✅ Found {result['companies_found']} companies")
        for company in result["companies"][:3]:  # Show first 3
            print(f"    🏭 {company['name']}")
    else:
        print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")
    
    return result

def test_newsapi_source():
    """Test NewsAPI (if key available)"""
    print("📡 Testing NewsAPI...")
    
    # Note: You would need to get a free NewsAPI key from newsapi.org
    tester = NewsAPITester()  # No API key provided
    result = tester.search_healthtech_news(limit=5)
    
    if result["status"] == "no_api_key":
        print("  ⚠️ No NewsAPI key provided (get free key from newsapi.org)")
    elif result["status"] == "success":
        print(f"  ✅ Found {result['total_results']} articles")
    else:
        print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")
    
    return result

def analyze_data_quality(results: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze the quality and structure of scraped data"""
    analysis = {
        "sources_tested": [],
        "data_quality": {},
        "integration_feasibility": {},
        "recommendations": []
    }
    
    for source, result in results.items():
        analysis["sources_tested"].append(source)
        
        if result["status"] == "success":
            data_count = result.get("articles_found", result.get("companies_found", 0))
            analysis["data_quality"][source] = {
                "status": "good",
                "data_count": data_count,
                "structure": "structured" if data_count > 0 else "empty"
            }
            
            if data_count > 0:
                analysis["integration_feasibility"][source] = "feasible"
            else:
                analysis["integration_feasibility"][source] = "limited"
        else:
            analysis["data_quality"][source] = {
                "status": "failed",
                "error": result.get("error", "Unknown error")
            }
            analysis["integration_feasibility"][source] = "not_feasible"
    
    return analysis

def main():
    """Main test function for additional sources"""
    print("🔍 Testing Additional Data Sources")
    print("=" * 50)
    
    results = {}
    
    # Test TechCrunch
    print("\n1️⃣ TechCrunch Healthtech Articles")
    results["techcrunch"] = test_techcrunch_source()
    
    # Test Y Combinator
    print("\n2️⃣ Y Combinator Healthcare Companies")
    results["ycombinator"] = test_ycombinator_source()
    
    # Test NewsAPI
    print("\n3️⃣ NewsAPI Healthtech News")
    results["newsapi"] = test_newsapi_source()
    
    # Analyze results
    print("\n📊 Data Quality Analysis")
    analysis = analyze_data_quality(results)
    
    print(f"\nSources tested: {', '.join(analysis['sources_tested'])}")
    print("\nIntegration feasibility:")
    for source, feasibility in analysis["integration_feasibility"].items():
        print(f"  {source}: {feasibility}")
    
    # Save results
    output = {
        "timestamp": datetime.now().isoformat(),
        "test_results": results,
        "analysis": analysis
    }
    
    with open("api_integration_tests/additional_sources_results.json", "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n💾 Results saved to: api_integration_tests/additional_sources_results.json")

if __name__ == "__main__":
    main()
