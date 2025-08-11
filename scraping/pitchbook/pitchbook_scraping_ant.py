#!/usr/bin/env python3
"""
PitchBook Scraper using ScrapingAnt API

This script scrapes PitchBook for startup data using ScrapingAnt's web scraping service.
It can extract data from public PitchBook pages without requiring login credentials.
Didn't end up working because PitchBook has a lot of anti-scraping measures.

Features:
- Scrape startup profiles, search results, and company pages
- Handle pagination and multiple result pages
- Extract comprehensive startup information
- Data cleaning and normalization
- Export to CSV, Excel, and JSON formats
- Rate limiting and error handling

Requirements:
- ScrapingAnt API key (get from https://scrapingant.com/)
- Python 3.7+
- Required packages: requests, pandas, beautifulsoup4, openpyxl
"""

import requests
import pandas as pd
import json
import time
import logging
from datetime import datetime
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Optional, Any
import os
from urllib.parse import urljoin, urlparse, parse_qs

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pitchbook_scraping_ant.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class PitchBookScrapingAnt:
    def __init__(self, api_key: str, base_url: str = "https://api.scrapingant.com/v2"):
        """
        Initialize PitchBook scraper with ScrapingAnt API
        
        Args:
            api_key (str): Your ScrapingAnt API key
            base_url (str): ScrapingAnt API base URL
        """
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Rate limiting
        self.request_delay = 1.0  # seconds between requests
        self.last_request_time = 0
        
        # Data storage
        self.startups_data = []
        self.scraped_urls = set()
        
        logger.info("PitchBook ScrapingAnt scraper initialized")
    
    def _rate_limit(self):
        """Implement rate limiting between requests"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.request_delay:
            sleep_time = self.request_delay - time_since_last
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
    
    def scrape_url(self, url: str, render_js: bool = True, proxy_country: str = "US") -> Optional[BeautifulSoup]:
        """
        Scrape a URL using ScrapingAnt API
        
        Args:
            url (str): URL to scrape
            render_js (bool): Whether to render JavaScript
            proxy_country (str): Country for proxy (US, UK, DE, etc.)
            
        Returns:
            BeautifulSoup object or None if failed
        """
        self._rate_limit()
        
        try:
            payload = {
                "url": url,
                "x-api-key": self.api_key,
                "browser": render_js,
                "proxy_country": proxy_country,
                "return_page_source": True
            }
            
            response = self.session.post(f"{self.base_url}/general", json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('status') == 'success':
                html_content = data.get('content')
                if html_content:
                    soup = BeautifulSoup(html_content, 'html.parser')
                    logger.info(f"Successfully scraped: {url}")
                    return soup
                else:
                    logger.warning(f"No content returned for: {url}")
                    return None
            else:
                logger.error(f"Scraping failed for {url}: {data.get('message', 'Unknown error')}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed for {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error scraping {url}: {e}")
            return None
    
    def search_startups(self, search_query: str, max_pages: int = 5) -> List[Dict[str, Any]]:
        """
        Search for startups on PitchBook
        
        Args:
            search_query (str): Search term (e.g., "healthcare startups", "AI companies")
            max_pages (int): Maximum number of pages to scrape
            
        Returns:
            List of startup data dictionaries
        """
        logger.info(f"Searching for: {search_query}")
        
        # Construct search URL (PitchBook search format)
        search_url = f"https://pitchbook.com/search?query={search_query.replace(' ', '+')}"
        
        startups = []
        page = 1
        
        while page <= max_pages:
            try:
                current_url = f"{search_url}&page={page}" if page > 1 else search_url
                
                soup = self.scrape_url(current_url)
                if not soup:
                    logger.warning(f"Failed to scrape page {page}")
                    break
                
                # Extract startup data from search results
                page_startups = self._extract_startups_from_search(soup, current_url)
                if not page_startups:
                    logger.info(f"No more startups found on page {page}")
                    break
                
                startups.extend(page_startups)
                logger.info(f"Page {page}: Found {len(page_startups)} startups")
                
                # Check if there's a next page
                if not self._has_next_page(soup):
                    logger.info("No more pages available")
                    break
                
                page += 1
                
            except Exception as e:
                logger.error(f"Error processing page {page}: {e}")
                break
        
        logger.info(f"Total startups found: {len(startups)}")
        return startups
    
    def _extract_startups_from_search(self, soup: BeautifulSoup, page_url: str) -> List[Dict[str, Any]]:
        """
        Extract startup information from search results page
        
        Args:
            soup (BeautifulSoup): Parsed HTML content
            page_url (str): URL of the current page
            
        Returns:
            List of startup data dictionaries
        """
        startups = []
        
        try:
            # Look for startup cards/items in search results
            # PitchBook typically uses various selectors for search results
            startup_selectors = [
                '.search-result-item',
                '.company-card',
                '.startup-item',
                '[data-testid*="company"]',
                '.search-result',
                '.company-result'
            ]
            
            startup_elements = []
            for selector in startup_selectors:
                elements = soup.select(selector)
                if elements:
                    startup_elements = elements
                    logger.info(f"Found {len(elements)} startup elements using selector: {selector}")
                    break
            
            if not startup_elements:
                # Fallback: look for any elements that might contain company information
                startup_elements = soup.find_all(['div', 'article'], class_=re.compile(r'company|startup|result', re.I))
                logger.info(f"Fallback: Found {len(startup_elements)} potential startup elements")
            
            for element in startup_elements:
                startup_data = self._extract_startup_from_element(element, page_url)
                if startup_data:
                    startups.append(startup_data)
            
        except Exception as e:
            logger.error(f"Error extracting startups from search page: {e}")
        
        return startups
    
    def _extract_startup_from_element(self, element, page_url: str) -> Optional[Dict[str, Any]]:
        """
        Extract startup information from a single element
        
        Args:
            element: BeautifulSoup element containing startup data
            page_url (str): URL of the page containing this element
            
        Returns:
            Startup data dictionary or None
        """
        try:
            startup_data = {
                'startup_name': '',
                'description': '',
                'category': '',
                'subcategory': '',
                'total_funding': '',
                'last_funding_year': '',
                'region': '',
                'year_founded': '',
                'investors': [],
                'exit_status': '',
                'website': '',
                'linkedin_url': '',
                'data_source': 'PitchBook',
                'extraction_date': datetime.now().isoformat(),
                'source_url': page_url,
                'notes': []
            }
            
            # Extract startup name
            name_selectors = [
                'h1', 'h2', 'h3', 'h4',
                '[class*="name"]',
                '[class*="title"]',
                '[data-testid*="name"]',
                '.company-name',
                '.startup-name'
            ]
            
            for selector in name_selectors:
                name_elem = element.select_one(selector)
                if name_elem and name_elem.get_text(strip=True):
                    startup_data['startup_name'] = name_elem.get_text(strip=True)
                    break
            
            # Extract description
            desc_selectors = [
                'p',
                '[class*="description"]',
                '[class*="summary"]',
                '[class*="bio"]',
                '.company-description',
                '.startup-description'
            ]
            
            for selector in desc_selectors:
                desc_elem = element.select_one(selector)
                if desc_elem and desc_elem.get_text(strip=True):
                    startup_data['description'] = desc_elem.get_text(strip=True)
                    break
            
            # Extract category/industry
            category_selectors = [
                '[class*="category"]',
                '[class*="industry"]',
                '[class*="sector"]',
                '.company-category',
                '.startup-category'
            ]
            
            for selector in category_selectors:
                cat_elem = element.select_one(selector)
                if cat_elem and cat_elem.get_text(strip=True):
                    category_text = cat_elem.get_text(strip=True)
                    if ' - ' in category_text:
                        startup_data['category'], startup_data['subcategory'] = category_text.split(' - ', 1)
                    else:
                        startup_data['category'] = category_text
                    break
            
            # Extract funding information
            funding_selectors = [
                '[class*="funding"]',
                '[class*="investment"]',
                '.total-funding',
                '.funding-amount'
            ]
            
            for selector in funding_selectors:
                funding_elem = element.select_one(selector)
                if funding_elem and funding_elem.get_text(strip=True):
                    startup_data['total_funding'] = self._normalize_funding(funding_elem.get_text(strip=True))
                    break
            
            # Extract region/location
            region_selectors = [
                '[class*="location"]',
                '[class*="region"]',
                '[class*="country"]',
                '.company-location',
                '.startup-location'
            ]
            
            for selector in region_selectors:
                region_elem = element.select_one(selector)
                if region_elem and region_elem.get_text(strip=True):
                    startup_data['region'] = region_elem.get_text(strip=True)
                    break
            
            # Extract year founded
            founded_selectors = [
                '[class*="founded"]',
                '[class*="established"]',
                '.year-founded',
                '.founded-year'
            ]
            
            for selector in founded_selectors:
                founded_elem = element.select_one(selector)
                if founded_elem and founded_elem.get_text(strip=True):
                    startup_data['year_founded'] = founded_elem.get_text(strip=True)
                    break
            
            # Extract website and LinkedIn URLs
            links = element.find_all('a', href=True)
            for link in links:
                href = link['href']
                if 'linkedin.com' in href:
                    startup_data['linkedin_url'] = href
                elif href.startswith('http') and not 'pitchbook.com' in href:
                    startup_data['website'] = href
            
            # Check if this is a stealth startup
            if 'stealth' in startup_data['startup_name'].lower() or 'stealth' in startup_data.get('description', '').lower():
                startup_data['is_stealth'] = True
                startup_data['notes'].append("Marked as stealth startup")
            
            # Only return if we have at least a name
            if startup_data['startup_name']:
                return startup_data
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error extracting startup data from element: {e}")
            return None
    
    def _has_next_page(self, soup: BeautifulSoup) -> bool:
        """Check if there's a next page available"""
        next_page_selectors = [
            '.next-page',
            '.pagination-next',
            '[aria-label*="next"]',
            'a[href*="page="]'
        ]
        
        for selector in next_page_selectors:
            next_elem = soup.select_one(selector)
            if next_elem and not 'disabled' in next_elem.get('class', []):
                return True
        
        return False
    
    def scrape_startup_profile(self, startup_url: str) -> Optional[Dict[str, Any]]:
        """
        Scrape detailed information from a startup's profile page
        
        Args:
            startup_url (str): URL of the startup's profile page
            
        Returns:
            Detailed startup data dictionary or None
        """
        if startup_url in self.scraped_urls:
            logger.info(f"Already scraped: {startup_url}")
            return None
        
        logger.info(f"Scraping startup profile: {startup_url}")
        
        soup = self.scrape_url(startup_url)
        if not soup:
            return None
        
        try:
            startup_data = {
                'startup_name': '',
                'description': '',
                'category': '',
                'subcategory': '',
                'total_funding': '',
                'last_funding_year': '',
                'region': '',
                'year_founded': '',
                'investors': [],
                'exit_status': '',
                'website': '',
                'linkedin_url': '',
                'employee_count': '',
                'headquarters': '',
                'data_source': 'PitchBook',
                'extraction_date': datetime.now().isoformat(),
                'source_url': startup_url,
                'notes': []
            }
            
            # Extract startup name (usually in title or h1)
            title_elem = soup.find('title')
            if title_elem:
                title_text = title_elem.get_text(strip=True)
                # Clean up title (remove "| PitchBook" etc.)
                startup_data['startup_name'] = title_text.split('|')[0].strip()
            
            # Extract description from meta tags or main content
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                startup_data['description'] = meta_desc.get('content', '')
            
            # Extract detailed information from profile page
            # This would need to be customized based on PitchBook's actual HTML structure
            # For now, we'll use a generic approach
            
            # Look for funding information
            funding_elements = soup.find_all(text=re.compile(r'\$[\d,]+[KMB]?', re.I))
            if funding_elements:
                startup_data['total_funding'] = self._normalize_funding(funding_elements[0])
            
            # Look for location information
            location_elements = soup.find_all(text=re.compile(r'(San Francisco|New York|London|Berlin|Singapore)', re.I))
            if location_elements:
                startup_data['region'] = location_elements[0]
            
            # Mark as scraped
            self.scraped_urls.add(startup_url)
            
            return startup_data
            
        except Exception as e:
            logger.error(f"Error scraping startup profile {startup_url}: {e}")
            return None
    
    def _normalize_funding(self, funding_text: str) -> str:
        """
        Normalize funding amount to USD format
        
        Args:
            funding_text (str): Raw funding text
            
        Returns:
            str: Normalized funding amount in USD
        """
        try:
            # Remove common prefixes and suffixes
            funding_text = funding_text.replace('$', '').replace(',', '').strip()
            
            # Handle different formats (K, M, B)
            if 'K' in funding_text:
                amount = float(funding_text.replace('K', '')) * 1000
            elif 'M' in funding_text:
                amount = float(funding_text.replace('M', '')) * 1000000
            elif 'B' in funding_text:
                amount = float(funding_text.replace('B', '')) * 1000000000
            else:
                amount = float(funding_text)
            
            return f"${amount:,.0f}"
            
        except:
            return funding_text  # Return original if parsing fails
    
    def clean_and_normalize_data(self, startups_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Clean and normalize the extracted startup data
        
        Args:
            startups_data (list): List of startup data dictionaries
            
        Returns:
            list: Cleaned and normalized startup data
        """
        cleaned_data = []
        
        for startup in startups_data:
            cleaned_startup = startup.copy()
            
            # Normalize categories
            if cleaned_startup.get('category'):
                cleaned_startup['category'] = self._normalize_category(cleaned_startup['category'])
            
            # Standardize date formats
            if cleaned_startup.get('last_funding_year'):
                cleaned_startup['last_funding_year'] = self._normalize_date(cleaned_startup['last_funding_year'])
            
            if cleaned_startup.get('year_founded'):
                cleaned_startup['year_founded'] = self._normalize_date(cleaned_startup['year_founded'])
            
            # Remove duplicates based on startup name
            if not any(s.get('startup_name') == cleaned_startup.get('startup_name') for s in cleaned_data):
                cleaned_data.append(cleaned_startup)
            else:
                logger.warning(f"Duplicate startup found: {cleaned_startup.get('startup_name', 'Unknown')}")
        
        logger.info(f"Cleaned data: {len(cleaned_data)} unique startups")
        return cleaned_data
    
    def _normalize_category(self, category: str) -> str:
        """Normalize category names"""
        category_mapping = {
            'healthcare': 'Healthcare',
            'health tech': 'Healthcare Technology',
            'biotech': 'Biotechnology',
            'digital health': 'Digital Health',
            'medtech': 'Medical Technology',
            'fintech': 'Financial Technology',
            'ai': 'Artificial Intelligence',
            'machine learning': 'Artificial Intelligence',
            'ml': 'Artificial Intelligence',
            'software': 'Software',
            'saas': 'Software as a Service',
            'ecommerce': 'E-commerce',
            'marketplace': 'Marketplace'
        }
        
        category_lower = category.lower()
        for key, value in category_mapping.items():
            if key in category_lower:
                return value
        
        return category.title()
    
    def _normalize_date(self, date_text: str) -> str:
        """Normalize date formats to YYYY-MM-DD"""
        try:
            # Handle various date formats
            if re.match(r'\d{4}-\d{2}-\d{2}', date_text):
                return date_text
            elif re.match(r'\d{4}', date_text):
                return f"{date_text}-01-01"
            else:
                # Try to parse with pandas
                parsed_date = pd.to_datetime(date_text)
                return parsed_date.strftime('%Y-%m-%d')
        except:
            return date_text
    
    def save_to_csv(self, startups_data: List[Dict[str, Any]], filename: str):
        """Save startup data to CSV file"""
        try:
            df = pd.DataFrame(startups_data)
            df.to_csv(filename, index=False)
            logger.info(f"Data saved to {filename}")
        except Exception as e:
            logger.error(f"Failed to save CSV: {e}")
    
    def save_to_excel(self, startups_data: List[Dict[str, Any]], filename: str):
        """Save startup data to Excel file"""
        try:
            df = pd.DataFrame(startups_data)
            df.to_excel(filename, index=False)
            logger.info(f"Data saved to {filename}")
        except Exception as e:
            logger.error(f"Failed to save Excel: {e}")
    
    def save_to_json(self, startups_data: List[Dict[str, Any]], filename: str):
        """Save startup data to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(startups_data, f, indent=2, ensure_ascii=False)
            logger.info(f"Data saved to {filename}")
        except Exception as e:
            logger.error(f"Failed to save JSON: {e}")
    
    def generate_summary_report(self, startups_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a summary report of the scraping results"""
        if not startups_data:
            return {}
        
        df = pd.DataFrame(startups_data)
        
        summary = {
            'total_startups': len(startups_data),
            'data_completeness': {},
            'category_distribution': df['category'].value_counts().to_dict() if 'category' in df.columns else {},
            'region_distribution': df['region'].value_counts().to_dict() if 'region' in df.columns else {},
            'funding_distribution': {},
            'stealth_startups': len([s for s in startups_data if s.get('is_stealth', False)]),
            'extraction_date': datetime.now().isoformat(),
            'data_source': 'PitchBook (ScrapingAnt)'
        }
        
        # Calculate data completeness
        for field in ['startup_name', 'description', 'category', 'total_funding', 'region']:
            if field in df.columns:
                completeness = (df[field].notna().sum() / len(df)) * 100
                summary['data_completeness'][field] = f"{completeness:.1f}%"
        
        # Funding distribution
        funding_amounts = []
        for startup in startups_data:
            if startup.get('total_funding'):
                try:
                    amount = float(startup['total_funding'].replace('$', '').replace(',', ''))
                    funding_amounts.append(amount)
                except:
                    pass
        
        if funding_amounts:
            summary['funding_distribution'] = {
                'min': min(funding_amounts),
                'max': max(funding_amounts),
                'avg': sum(funding_amounts) / len(funding_amounts)
            }
        
        return summary

def main():
    """Main function to run the PitchBook ScrapingAnt scraper"""
    
    # Get API key from environment variable or user input
    api_key = os.getenv('SCRAPINGANT_API_KEY')
    if not api_key:
        api_key = input("Enter your ScrapingAnt API key: ").strip()
    
    if not api_key:
        logger.error("No API key provided. Please set SCRAPINGANT_API_KEY environment variable or enter it manually.")
        return
    
    # Initialize scraper
    scraper = PitchBookScrapingAnt(api_key)
    
    try:
        # Define search queries for different startup categories
        search_queries = [
            "healthcare startups",
            "AI companies",
            "fintech startups",
            "biotech companies",
            "software startups"
        ]
        
        all_startups = []
        
        # Search for startups using different queries
        for query in search_queries:
            logger.info(f"Searching for: {query}")
            startups = scraper.search_startups(query, max_pages=3)
            all_startups.extend(startups)
            
            # Add delay between searches
            time.sleep(2)
        
        # Remove duplicates
        unique_startups = []
        seen_names = set()
        for startup in all_startups:
            name = startup.get('startup_name', '').lower()
            if name and name not in seen_names:
                unique_startups.append(startup)
                seen_names.add(name)
        
        logger.info(f"Total unique startups found: {len(unique_startups)}")
        
        # Clean and normalize data
        cleaned_data = scraper.clean_and_normalize_data(unique_startups)
        
        # Save to multiple formats
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        scraper.save_to_csv(cleaned_data, f'pitchbook_startups_scrapingant_{timestamp}.csv')
        scraper.save_to_excel(cleaned_data, f'pitchbook_startups_scrapingant_{timestamp}.xlsx')
        scraper.save_to_json(cleaned_data, f'pitchbook_startups_scrapingant_{timestamp}.json')
        
        # Generate and save summary report
        summary = scraper.generate_summary_report(cleaned_data)
        with open(f'pitchbook_summary_scrapingant_{timestamp}.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info("PitchBook ScrapingAnt scraping workflow completed successfully")
        
        # Print summary
        print(f"\nScraping Summary:")
        print(f"Total startups found: {summary['total_startups']}")
        print(f"Data completeness:")
        for field, completeness in summary['data_completeness'].items():
            print(f"  {field}: {completeness}")
        
    except Exception as e:
        logger.error(f"Error in main workflow: {e}")
        raise

if __name__ == "__main__":
    main()
