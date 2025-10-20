#!/usr/bin/env python3
"""
Example usage of PitchBook ScrapingAnt scraper

This script demonstrates various ways to use the scraper for different purposes.
"""

import os
import sys
from datetime import datetime
from pitchbook_scraping_ant import PitchBookScrapingAnt
from config_scrapingant import get_config, validate_config

def example_basic_search():
    """Basic example: Search for startups using a single query"""
    print("=== Basic Search Example ===")
    
    # Get API key
    api_key = os.getenv('SCRAPINGANT_API_KEY')
    if not api_key:
        print("Please set SCRAPINGANT_API_KEY environment variable")
        return
    
    # Initialize scraper
    scraper = PitchBookScrapingAnt(api_key)
    
    try:
        # Search for healthcare startups
        query = "healthcare startups"
        print(f"Searching for: {query}")
        
        startups = scraper.search_startups(query, max_pages=2)
        print(f"Found {len(startups)} startups")
        
        # Save results
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'healthcare_startups_{timestamp}.csv'
        scraper.save_to_csv(startups, filename)
        print(f"Results saved to: {filename}")
        
    except Exception as e:
        print(f"Error: {e}")

def example_multiple_queries():
    """Example: Search multiple categories and combine results"""
    print("\n=== Multiple Queries Example ===")
    
    api_key = os.getenv('SCRAPINGANT_API_KEY')
    if not api_key:
        print("Please set SCRAPINGANT_API_KEY environment variable")
        return
    
    scraper = PitchBookScrapingAnt(api_key)
    
    # Define search queries
    queries = [
        "AI companies",
        "fintech startups", 
        "biotech companies"
    ]
    
    all_startups = []
    
    try:
        for query in queries:
            print(f"Searching for: {query}")
            startups = scraper.search_startups(query, max_pages=2)
            all_startups.extend(startups)
            print(f"Found {len(startups)} startups for '{query}'")
        
        # Remove duplicates
        unique_startups = []
        seen_names = set()
        for startup in all_startups:
            name = startup.get('startup_name', '').lower()
            if name and name not in seen_names:
                unique_startups.append(startup)
                seen_names.add(name)
        
        print(f"Total unique startups: {len(unique_startups)}")
        
        # Save combined results
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        scraper.save_to_csv(unique_startups, f'combined_startups_{timestamp}.csv')
        scraper.save_to_excel(unique_startups, f'combined_startups_{timestamp}.xlsx')
        
    except Exception as e:
        print(f"Error: {e}")

def example_custom_configuration():
    """Example: Use custom configuration settings"""
    print("\n=== Custom Configuration Example ===")
    
    api_key = os.getenv('SCRAPINGANT_API_KEY')
    if not api_key:
        print("Please set SCRAPINGANT_API_KEY environment variable")
        return
    
    # Initialize with custom settings
    scraper = PitchBookScrapingAnt(
        api_key=api_key,
        base_url="https://api.scrapingant.com/v2"
    )
    
    # Customize scraper settings
    scraper.request_delay = 2.0  # Slower rate limiting
    
    try:
        # Search with custom parameters
        query = "software startups"
        print(f"Searching for: {query} with custom settings")
        
        startups = scraper.search_startups(query, max_pages=3)
        print(f"Found {len(startups)} startups")
        
        # Clean and normalize data
        cleaned_data = scraper.clean_and_normalize_data(startups)
        print(f"After cleaning: {len(cleaned_data)} startups")
        
        # Generate summary report
        summary = scraper.generate_summary_report(cleaned_data)
        print(f"Summary: {summary['total_startups']} total startups")
        
        # Save results
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        scraper.save_to_csv(cleaned_data, f'custom_search_{timestamp}.csv')
        
    except Exception as e:
        print(f"Error: {e}")

def example_profile_scraping():
    """Example: Scrape individual startup profile pages"""
    print("\n=== Profile Scraping Example ===")
    
    api_key = os.getenv('SCRAPINGANT_API_KEY')
    if not api_key:
        print("Please set SCRAPINGANT_API_KEY environment variable")
        return
    
    scraper = PitchBookScrapingAnt(api_key)
    
    # Example startup profile URLs (you would get these from search results)
    profile_urls = [
        "https://pitchbook.com/profiles/company/example-1",
        "https://pitchbook.com/profiles/company/example-2"
    ]
    
    try:
        detailed_startups = []
        
        for url in profile_urls:
            print(f"Scraping profile: {url}")
            startup_data = scraper.scrape_startup_profile(url)
            if startup_data:
                detailed_startups.append(startup_data)
                print(f"Successfully scraped: {startup_data.get('startup_name', 'Unknown')}")
            else:
                print(f"Failed to scrape: {url}")
        
        if detailed_startups:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            scraper.save_to_json(detailed_startups, f'detailed_profiles_{timestamp}.json')
            print(f"Detailed profiles saved to JSON")
        
    except Exception as e:
        print(f"Error: {e}")

def example_data_analysis():
    """Example: Analyze scraped data and generate insights"""
    print("\n=== Data Analysis Example ===")
    
    api_key = os.getenv('SCRAPINGANT_API_KEY')
    if not api_key:
        print("Please set SCRAPINGANT_API_KEY environment variable")
        return
    
    scraper = PitchBookScrapingAnt(api_key)
    
    try:
        # Search for startups
        query = "AI companies"
        print(f"Searching for: {query}")
        
        startups = scraper.search_startups(query, max_pages=2)
        print(f"Found {len(startups)} startups")
        
        # Clean data
        cleaned_data = scraper.clean_and_normalize_data(startups)
        
        # Generate comprehensive report
        summary = scraper.generate_summary_report(cleaned_data)
        
        # Print analysis
        print("\n=== Data Analysis Results ===")
        print(f"Total Startups: {summary['total_startups']}")
        
        print("\nData Completeness:")
        for field, completeness in summary['data_completeness'].items():
            print(f"  {field}: {completeness}")
        
        print("\nCategory Distribution:")
        for category, count in summary['category_distribution'].items():
            print(f"  {category}: {count}")
        
        print("\nRegion Distribution:")
        for region, count in summary['region_distribution'].items():
            print(f"  {region}: {count}")
        
        if 'funding_distribution' in summary:
            funding = summary['funding_distribution']
            print(f"\nFunding Distribution:")
            print(f"  Min: ${funding['min']:,.0f}")
            print(f"  Max: ${funding['max']:,.0f}")
            print(f"  Average: ${funding['avg']:,.0f}")
        
        print(f"\nStealth Startups: {summary['stealth_startups']}")
        
        # Save analysis
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        with open(f'data_analysis_{timestamp}.json', 'w') as f:
            import json
            json.dump(summary, f, indent=2)
        
        print(f"\nAnalysis saved to: data_analysis_{timestamp}.json")
        
    except Exception as e:
        print(f"Error: {e}")

def main():
    """Main function to run examples"""
    print("PitchBook ScrapingAnt - Example Usage")
    print("=" * 50)
    
    # Check configuration
    if not validate_config():
        print("\nPlease fix configuration issues before running examples.")
        return
    
    # Print configuration summary
    config = get_config()
    print(f"API Key: {'✓ Set' if config['scrapingant']['api_key'] else '✗ Not set'}")
    print(f"Base URL: {config['scrapingant']['base_url']}")
    print("=" * 50)
    
    # Run examples
    try:
        example_basic_search()
        example_multiple_queries()
        example_custom_configuration()
        example_profile_scraping()
        example_data_analysis()
        
        print("\n" + "=" * 50)
        print("All examples completed successfully!")
        
    except KeyboardInterrupt:
        print("\nExamples interrupted by user")
    except Exception as e:
        print(f"\nError running examples: {e}")

if __name__ == "__main__":
    main()
