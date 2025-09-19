#!/usr/bin/env python3
"""
RSS Feed Parser for Healthtech News
Assignment 4.1 - Practical Implementation

This script implements RSS feed parsing as an immediate solution for data collection
while we work on more comprehensive API integrations.
"""

import feedparser
import requests
from datetime import datetime, timedelta
import json
from typing import List, Dict, Any
import re

class HealthtechRSSParser:
    """Parser for healthtech RSS feeds"""
    
    def __init__(self):
        self.feeds = {
            "techcrunch_healthtech": {
                "url": "https://techcrunch.com/category/healthtech/feed/",
                "name": "TechCrunch Healthtech",
                "category": "news"
            },
            "mobihealthnews": {
                "url": "https://www.mobihealthnews.com/rss.xml",
                "name": "MobiHealthNews",
                "category": "news"
            },
            "fiercebiotech": {
                "url": "https://www.fiercebiotech.com/rss.xml",
                "name": "FierceBiotech",
                "category": "news"
            },
            "healthcare_dive": {
                "url": "https://www.healthcaredive.com/feeds/news/",
                "name": "Healthcare Dive",
                "category": "news"
            }
        }
    
    def parse_feed(self, feed_name: str) -> Dict[str, Any]:
        """Parse a specific RSS feed"""
        if feed_name not in self.feeds:
            return {
                "status": "error",
                "error": f"Feed '{feed_name}' not found"
            }
        
        feed_config = self.feeds[feed_name]
        
        try:
            # Parse the RSS feed
            feed = feedparser.parse(feed_config["url"])
            
            if feed.bozo:
                return {
                    "status": "error",
                    "error": f"RSS parsing error: {feed.bozo_exception}"
                }
            
            articles = []
            for entry in feed.entries[:10]:  # Limit to 10 most recent
                article = {
                    "title": entry.get("title", ""),
                    "link": entry.get("link", ""),
                    "published": entry.get("published", ""),
                    "summary": entry.get("summary", ""),
                    "source": feed_config["name"],
                    "category": feed_config["category"]
                }
                
                # Extract company names from title/summary
                article["companies_mentioned"] = self.extract_company_names(
                    article["title"] + " " + article["summary"]
                )
                
                articles.append(article)
            
            return {
                "status": "success",
                "feed_name": feed_config["name"],
                "articles_count": len(articles),
                "articles": articles,
                "feed_info": {
                    "title": feed.feed.get("title", ""),
                    "description": feed.feed.get("description", ""),
                    "last_updated": feed.feed.get("updated", "")
                }
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def extract_company_names(self, text: str) -> List[str]:
        """Extract potential company names from text"""
        # Common healthtech company patterns
        patterns = [
            r'\b[A-Z][a-z]+(?:Health|Med|Bio|Tech|Care|Wellness)\b',
            r'\b[A-Z][a-z]+(?:\.com|\.io|\.ai)\b',
            r'\b[A-Z][a-z]+\s+(?:Health|Medical|Bio|Tech|Care)\b'
        ]
        
        companies = set()
        for pattern in patterns:
            matches = re.findall(pattern, text)
            companies.update(matches)
        
        return list(companies)
    
    def parse_all_feeds(self) -> Dict[str, Any]:
        """Parse all configured RSS feeds"""
        results = {}
        total_articles = 0
        
        for feed_name in self.feeds.keys():
            print(f"📡 Parsing {feed_name}...")
            result = self.parse_feed(feed_name)
            results[feed_name] = result
            
            if result["status"] == "success":
                print(f"  ✅ Found {result['articles_count']} articles")
                total_articles += result["articles_count"]
            else:
                print(f"  ❌ Failed: {result.get('error', 'Unknown error')}")
        
        return {
            "status": "completed",
            "feeds_processed": len(results),
            "total_articles": total_articles,
            "results": results
        }
    
    def filter_recent_articles(self, articles: List[Dict], days: int = 7) -> List[Dict]:
        """Filter articles from the last N days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_articles = []
        
        for article in articles:
            try:
                # Parse the published date
                pub_date = datetime.strptime(article["published"], "%a, %d %b %Y %H:%M:%S %z")
                if pub_date.replace(tzinfo=None) >= cutoff_date:
                    recent_articles.append(article)
            except:
                # If date parsing fails, include the article
                recent_articles.append(article)
        
        return recent_articles

def test_rss_parsing():
    """Test RSS feed parsing functionality"""
    print("🚀 Testing RSS Feed Parsing")
    print("=" * 40)
    
    parser = HealthtechRSSParser()
    
    # Test individual feeds
    print("\n1️⃣ Testing individual feeds...")
    for feed_name in parser.feeds.keys():
        result = parser.parse_feed(feed_name)
        if result["status"] == "success":
            print(f"  ✅ {feed_name}: {result['articles_count']} articles")
        else:
            print(f"  ❌ {feed_name}: {result.get('error', 'Unknown error')}")
    
    # Test all feeds
    print("\n2️⃣ Testing all feeds...")
    all_results = parser.parse_all_feeds()
    
    print(f"\n📊 Summary:")
    print(f"  Feeds processed: {all_results['feeds_processed']}")
    print(f"  Total articles: {all_results['total_articles']}")
    
    # Save results
    with open("api_integration_tests/rss_feed_results.json", "w") as f:
        json.dump(all_results, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: api_integration_tests/rss_feed_results.json")
    
    return all_results

def create_sample_data():
    """Create sample data for dashboard testing"""
    print("\n3️⃣ Creating sample data for dashboard...")
    
    # Sample healthtech companies
    sample_companies = [
        {
            "name": "Teladoc Health",
            "industry_segment": "telemedicine",
            "technical_employees_pct": 65.0,
            "description": "Leading telemedicine platform",
            "website": "https://teladochealth.com",
            "location": "Purchase, NY"
        },
        {
            "name": "Livongo Health",
            "industry_segment": "digital-health",
            "technical_employees_pct": 70.0,
            "description": "Digital health platform for chronic conditions",
            "website": "https://livongo.com",
            "location": "Mountain View, CA"
        },
        {
            "name": "Veracyte",
            "industry_segment": "medical-imaging",
            "technical_employees_pct": 80.0,
            "description": "Genomic diagnostics for cancer",
            "website": "https://veracyte.com",
            "location": "South San Francisco, CA"
        },
        {
            "name": "Butterfly Network",
            "industry_segment": "medical-imaging",
            "technical_employees_pct": 75.0,
            "description": "Portable ultrasound technology",
            "website": "https://butterflynetwork.com",
            "location": "Guilford, CT"
        },
        {
            "name": "Ro",
            "industry_segment": "digital-health",
            "technical_employees_pct": 60.0,
            "description": "Direct-to-consumer healthcare platform",
            "website": "https://ro.co",
            "location": "New York, NY"
        }
    ]
    
    # Sample VCs
    sample_vcs = [
        {
            "name": "Andreessen Horowitz",
            "description": "Silicon Valley venture capital firm",
            "website": "https://a16z.com",
            "location": "Menlo Park, CA",
            "investment_stage": "multi-stage",
            "final_score": 95.8
        },
        {
            "name": "General Catalyst",
            "description": "Venture capital firm focused on healthcare and technology",
            "website": "https://generalcatalyst.com",
            "location": "Cambridge, MA",
            "investment_stage": "multi-stage",
            "final_score": 92.3
        },
        {
            "name": "GV (Google Ventures)",
            "description": "Venture capital arm of Alphabet",
            "website": "https://gv.com",
            "location": "Mountain View, CA",
            "investment_stage": "multi-stage",
            "final_score": 90.1
        }
    ]
    
    sample_data = {
        "companies": sample_companies,
        "vcs": sample_vcs,
        "created_at": datetime.now().isoformat(),
        "source": "manual_curation"
    }
    
    with open("api_integration_tests/sample_dashboard_data.json", "w") as f:
        json.dump(sample_data, f, indent=2)
    
    print(f"  ✅ Created sample data with {len(sample_companies)} companies and {len(sample_vcs)} VCs")
    print(f"  💾 Saved to: api_integration_tests/sample_dashboard_data.json")

def main():
    """Main function"""
    # Test RSS parsing
    rss_results = test_rss_parsing()
    
    # Create sample data
    create_sample_data()
    
    print("\n🎯 Next Steps:")
    print("1. Review RSS feed results for data quality")
    print("2. Integrate RSS parsing into dashboard backend")
    print("3. Use sample data for immediate dashboard testing")
    print("4. Implement automated RSS updates")

if __name__ == "__main__":
    main()
