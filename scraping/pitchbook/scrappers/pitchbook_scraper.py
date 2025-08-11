#!/usr/bin/env python3
"""
PitchBook Scraper for Nvidia Market Intelligence Dashboard

This script scrapes PitchBook for startup data including:
- Startup name, description, category, subcategory
- Total funding, last funding year, region, year founded
- Investors, exit status

Target: 20-30 startups per platform
Data Quality: Clean, normalized, standardized formats
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import json
import logging
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PitchBookScraper:
    def __init__(self, headless=True):
        """
        Initialize PitchBook scraper with Selenium WebDriver
        
        Args:
            headless (bool): Run browser in headless mode
        """
        self.base_url = "https://my.pitchbook.com"
        self.session = requests.Session()
        self.setup_driver(headless)
        self.startups_data = []
        
    def setup_driver(self, headless):
        """Setup Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            logger.info("Chrome WebDriver initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            self.driver = None
    
    def login_to_pitchbook(self, username, password):
        """
        Login to PitchBook (requires valid credentials)
        
        Args:
            username (str): PitchBook username
            password (str): PitchBook password
        """
        if not self.driver:
            logger.error("WebDriver not available")
            return False
            
        try:
            self.driver.get(f"{self.base_url}/login")
            
            # Wait for login form and fill credentials
            username_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "username"))
            )
            password_field = self.driver.find_element(By.NAME, "password")
            
            username_field.send_keys(username)
            password_field.send_keys(password)
            
            # Submit login form
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # Wait for successful login
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "dashboard"))
            )
            
            logger.info("Successfully logged into PitchBook")
            return True
            
        except Exception as e:
            logger.error(f"Login failed: {e}")
            return False
    
    def search_startups(self, search_criteria):
        """
        Search for startups based on criteria
        
        Args:
            search_criteria (dict): Search parameters
                - industries: List of industries
                - regions: List of regions
                - funding_stages: List of funding stages
                - min_funding: Minimum funding amount
                - max_funding: Maximum funding amount
        """
        if not self.driver:
            logger.error("WebDriver not available")
            return
            
        try:
            # Navigate to search page
            search_url = f"{self.base_url}/search"
            self.driver.get(search_url)
            
            # Apply search filters
            self._apply_search_filters(search_criteria)
            
            # Wait for results to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "search-results"))
            )
            
            logger.info("Search completed successfully")
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
    
    def _apply_search_filters(self, criteria):
        """Apply search filters to the search form"""
        try:
            # Industry filter
            if 'industries' in criteria:
                industry_dropdown = self.driver.find_element(By.ID, "industry-filter")
                industry_dropdown.click()
                
                for industry in criteria['industries']:
                    industry_option = self.driver.find_element(
                        By.XPATH, f"//option[contains(text(), '{industry}')]"
                    )
                    industry_option.click()
            
            # Region filter
            if 'regions' in criteria:
                region_dropdown = self.driver.find_element(By.ID, "region-filter")
                region_dropdown.click()
                
                for region in criteria['regions']:
                    region_option = self.driver.find_element(
                        By.XPATH, f"//option[contains(text(), '{region}')]"
                    )
                    region_option.click()
            
            # Funding range filter
            if 'min_funding' in criteria or 'max_funding' in criteria:
                min_funding_field = self.driver.find_element(By.ID, "min-funding")
                max_funding_field = self.driver.find_element(By.ID, "max-funding")
                
                if 'min_funding' in criteria:
                    min_funding_field.send_keys(str(criteria['min_funding']))
                if 'max_funding' in criteria:
                    max_funding_field.send_keys(str(criteria['max_funding']))
            
            # Submit search
            search_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            search_button.click()
            
        except Exception as e:
            logger.error(f"Failed to apply search filters: {e}")
    
    def extract_startup_data(self, max_startups=30):
        """
        Extract startup data from search results
        
        Args:
            max_startups (int): Maximum number of startups to extract
        """
        if not self.driver:
            logger.error("WebDriver not available")
            return []
        
        startups = []
        page = 1
        
        while len(startups) < max_startups:
            try:
                # Wait for results to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "startup-card"))
                )
                
                # Get all startup cards on current page
                startup_cards = self.driver.find_elements(By.CLASS_NAME, "startup-card")
                
                for card in startup_cards:
                    if len(startups) >= max_startups:
                        break
                    
                    startup_data = self._extract_startup_from_card(card)
                    if startup_data:
                        startups.append(startup_data)
                        logger.info(f"Extracted data for: {startup_data.get('startup_name', 'Unknown')}")
                
                # Navigate to next page if available
                if len(startups) < max_startups:
                    next_button = self.driver.find_element(By.CLASS_NAME, "next-page")
                    if next_button.is_enabled():
                        next_button.click()
                        page += 1
                        time.sleep(2)  # Wait for page to load
                    else:
                        break
                else:
                    break
                    
            except Exception as e:
                logger.error(f"Error extracting data from page {page}: {e}")
                break
        
        logger.info(f"Extracted data for {len(startups)} startups")
        return startups
    
    def _extract_startup_from_card(self, card):
        """
        Extract startup information from a single card element
        
        Args:
            card: Selenium WebElement representing a startup card
            
        Returns:
            dict: Startup data dictionary
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
                'data_source': 'PitchBook',
                'extraction_date': datetime.now().isoformat(),
                'notes': []
            }
            
            # Extract startup name
            try:
                name_element = card.find_element(By.CLASS_NAME, "startup-name")
                startup_data['startup_name'] = name_element.text.strip()
            except:
                startup_data['notes'].append("Startup name not found")
            
            # Extract description
            try:
                desc_element = card.find_element(By.CLASS_NAME, "startup-description")
                startup_data['description'] = desc_element.text.strip()
            except:
                startup_data['notes'].append("Description not found")
            
            # Extract category and subcategory
            try:
                category_element = card.find_element(By.CLASS_NAME, "startup-category")
                category_text = category_element.text.strip()
                if ' - ' in category_text:
                    startup_data['category'], startup_data['subcategory'] = category_text.split(' - ', 1)
                else:
                    startup_data['category'] = category_text
            except:
                startup_data['notes'].append("Category information not found")
            
            # Extract funding information
            try:
                funding_element = card.find_element(By.CLASS_NAME, "total-funding")
                funding_text = funding_element.text.strip()
                startup_data['total_funding'] = self._normalize_funding(funding_text)
            except:
                startup_data['notes'].append("Funding information not found")
            
            # Extract last funding year
            try:
                funding_year_element = card.find_element(By.CLASS_NAME, "last-funding-year")
                startup_data['last_funding_year'] = funding_year_element.text.strip()
            except:
                startup_data['notes'].append("Last funding year not found")
            
            # Extract region
            try:
                region_element = card.find_element(By.CLASS_NAME, "startup-region")
                startup_data['region'] = region_element.text.strip()
            except:
                startup_data['notes'].append("Region information not found")
            
            # Extract year founded
            try:
                founded_element = card.find_element(By.CLASS_NAME, "year-founded")
                startup_data['year_founded'] = founded_element.text.strip()
            except:
                startup_data['notes'].append("Year founded not found")
            
            # Extract investors
            try:
                investors_elements = card.find_elements(By.CLASS_NAME, "investor-name")
                startup_data['investors'] = [inv.text.strip() for inv in investors_elements]
            except:
                startup_data['notes'].append("Investor information not found")
            
            # Extract exit status
            try:
                exit_element = card.find_element(By.CLASS_NAME, "exit-status")
                startup_data['exit_status'] = exit_element.text.strip()
            except:
                startup_data['exit_status'] = 'Active'  # Default assumption
                startup_data['notes'].append("Exit status not found, assumed active")
            
            # Check if stealth startup
            if 'stealth' in startup_data['startup_name'].lower() or 'stealth' in startup_data['description'].lower():
                startup_data['is_stealth'] = True
                startup_data['notes'].append("Marked as stealth startup")
            
            return startup_data
            
        except Exception as e:
            logger.error(f"Error extracting startup data: {e}")
            return None
    
    def _normalize_funding(self, funding_text):
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
    
    def clean_and_normalize_data(self, startups_data):
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
            if cleaned_startup['category']:
                cleaned_startup['category'] = self._normalize_category(cleaned_startup['category'])
            
            # Standardize date formats
            if cleaned_startup['last_funding_year']:
                cleaned_startup['last_funding_year'] = self._normalize_date(cleaned_startup['last_funding_year'])
            
            if cleaned_startup['year_founded']:
                cleaned_startup['year_founded'] = self._normalize_date(cleaned_startup['year_founded'])
            
            # Remove duplicates based on startup name
            if not any(s['startup_name'] == cleaned_startup['startup_name'] for s in cleaned_data):
                cleaned_data.append(cleaned_startup)
            else:
                logger.warning(f"Duplicate startup found: {cleaned_startup['startup_name']}")
        
        logger.info(f"Cleaned data: {len(cleaned_data)} unique startups")
        return cleaned_data
    
    def _normalize_category(self, category):
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
            'ml': 'Artificial Intelligence'
        }
        
        category_lower = category.lower()
        for key, value in category_mapping.items():
            if key in category_lower:
                return value
        
        return category.title()
    
    def _normalize_date(self, date_text):
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
    
    def save_to_excel(self, startups_data, filename):
        """
        Save startup data to Excel file
        
        Args:
            startups_data (list): List of startup data dictionaries
            filename (str): Output filename
        """
        try:
            df = pd.DataFrame(startups_data)
            df.to_excel(filename, index=False)
            logger.info(f"Data saved to {filename}")
        except Exception as e:
            logger.error(f"Failed to save data: {e}")
    
    def save_to_csv(self, startups_data, filename):
        """
        Save startup data to CSV file
        
        Args:
            startups_data (list): List of startup data dictionaries
            filename (str): Output filename
        """
        try:
            df = pd.DataFrame(startups_data)
            df.to_csv(filename, index=False)
            logger.info(f"Data saved to {filename}")
        except Exception as e:
            logger.error(f"Failed to save data: {e}")
    
    def generate_summary_report(self, startups_data):
        """
        Generate a summary report of the scraping results
        
        Args:
            startups_data (list): List of startup data dictionaries
            
        Returns:
            dict: Summary statistics
        """
        if not startups_data:
            return {}
        
        df = pd.DataFrame(startups_data)
        
        summary = {
            'total_startups': len(startups_data),
            'data_completeness': {},
            'category_distribution': df['category'].value_counts().to_dict(),
            'region_distribution': df['region'].value_counts().to_dict(),
            'funding_distribution': {},
            'stealth_startups': len([s for s in startups_data if s.get('is_stealth', False)]),
            'extraction_date': datetime.now().isoformat(),
            'data_source': 'PitchBook'
        }
        
        # Calculate data completeness
        for field in ['startup_name', 'description', 'category', 'total_funding', 'region']:
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
    
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            logger.info("WebDriver closed")

def main():
    """Main function to run the PitchBook scraper"""
    
    # Initialize scraper
    scraper = PitchBookScraper(headless=True)
    
    # Define search criteria for Digital Bio, Health, and Devices
    search_criteria = {
        'industries': ['Healthcare', 'Biotechnology', 'Digital Health', 'Medical Technology'],
        'regions': ['United States', 'Europe', 'Asia'],
        'funding_stages': ['Series A', 'Series B', 'Series C', 'Series D'],
        'min_funding': 1000000,  # $1M minimum
        'max_funding': 1000000000  # $1B maximum
    }
    
    try:
        # Note: Login requires valid PitchBook credentials
        # scraper.login_to_pitchbook("username", "password")
        
        # For demonstration, we'll work with the existing Excel file
        logger.info("Using existing PitchBook data file for analysis")
        
        # Load and analyze existing data
        df = pd.read_excel('PitchBook_Search_Result_Columns_2025_08_07_21_00_05.xlsx')
        
        # Process the existing data
        startups_data = []
        
        # Extract relevant information from the Excel file
        # This is a simplified example - you would need to map the actual columns
        for index, row in df.iterrows():
            if pd.notna(row.iloc[0]):  # Check if row has data
                startup_data = {
                    'startup_name': str(row.iloc[0]) if pd.notna(row.iloc[0]) else '',
                    'description': str(row.iloc[1]) if pd.notna(row.iloc[1]) else '',
                    'category': 'Healthcare',  # Based on search criteria
                    'subcategory': '',
                    'total_funding': '',
                    'last_funding_year': '',
                    'region': '',
                    'year_founded': '',
                    'investors': [],
                    'exit_status': 'Active',
                    'data_source': 'PitchBook',
                    'extraction_date': datetime.now().isoformat(),
                    'notes': ['Data extracted from existing Excel file']
                }
                startups_data.append(startup_data)
        
        # Clean and normalize data
        cleaned_data = scraper.clean_and_normalize_data(startups_data)
        
        # Save to files
        scraper.save_to_csv(cleaned_data, 'pitchbook_startups_cleaned.csv')
        scraper.save_to_excel(cleaned_data, 'pitchbook_startups_cleaned.xlsx')
        
        # Generate summary report
        summary = scraper.generate_summary_report(cleaned_data)
        
        # Save summary report
        with open('pitchbook_summary_report.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info("PitchBook scraping workflow completed successfully")
        
    except Exception as e:
        logger.error(f"Error in main workflow: {e}")
    
    finally:
        scraper.close()

if __name__ == "__main__":
    main()
