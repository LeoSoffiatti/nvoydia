#!/usr/bin/env python3
"""
Configuration file for PitchBook ScrapingAnt scraper

This file contains configuration settings and example usage for the scraper.
"""

import os
from typing import List, Dict, Any

# ScrapingAnt Configuration
SCRAPINGANT_CONFIG = {
    'api_key': os.getenv('SCRAPINGANT_API_KEY', ''),  # Set this environment variable
    'base_url': 'https://api.scrapingant.com/v2',
    'request_delay': 1.0,  # seconds between requests
    'max_retries': 3,
    'timeout': 30,
    'proxy_country': 'US',  # US, UK, DE, etc.
    'render_js': True,  # Whether to render JavaScript
}

# PitchBook Search Configuration
SEARCH_CONFIG = {
    'max_pages_per_query': 5,
    'max_startups_per_query': 100,
    'delay_between_searches': 2.0,  # seconds
}

# Search Queries for Different Startup Categories
SEARCH_QUERIES = {
    'healthcare': [
        'healthcare startups',
        'digital health companies',
        'biotech startups',
        'medical technology companies',
        'health tech companies'
    ],
    'technology': [
        'AI companies',
        'machine learning startups',
        'software startups',
        'SaaS companies',
        'tech startups'
    ],
    'finance': [
        'fintech startups',
        'financial technology companies',
        'insurtech companies',
        'payments startups'
    ],
    'other': [
        'ecommerce startups',
        'marketplace companies',
        'clean energy startups',
        'edtech companies'
    ]
}

# Data Extraction Configuration
EXTRACTION_CONFIG = {
    'required_fields': ['startup_name', 'description'],
    'optional_fields': [
        'category', 'subcategory', 'total_funding', 'last_funding_year',
        'region', 'year_founded', 'investors', 'exit_status',
        'website', 'linkedin_url', 'employee_count', 'headquarters'
    ],
    'funding_formats': ['K', 'M', 'B', 'T'],  # Thousand, Million, Billion, Trillion
    'date_formats': ['%Y', '%Y-%m', '%Y-%m-%d'],
}

# Output Configuration
OUTPUT_CONFIG = {
    'formats': ['csv', 'excel', 'json'],
    'include_timestamp': True,
    'output_directory': 'scraped_data',
    'filename_prefix': 'pitchbook_startups_scrapingant',
}

# Logging Configuration
LOGGING_CONFIG = {
    'level': 'INFO',
    'format': '%(asctime)s - %(levelname)s - %(message)s',
    'log_file': 'pitchbook_scraping_ant.log',
    'max_file_size': 10 * 1024 * 1024,  # 10MB
    'backup_count': 5,
}

# Rate Limiting Configuration
RATE_LIMIT_CONFIG = {
    'requests_per_minute': 60,
    'requests_per_hour': 1000,
    'burst_limit': 10,
}

# Error Handling Configuration
ERROR_CONFIG = {
    'max_consecutive_failures': 5,
    'retry_delay': 5.0,  # seconds
    'exponential_backoff': True,
    'skip_failed_urls': True,
}

# Data Cleaning Configuration
CLEANING_CONFIG = {
    'remove_duplicates': True,
    'normalize_categories': True,
    'standardize_dates': True,
    'clean_text': True,
    'min_description_length': 10,
}

# Category Mapping for Normalization
CATEGORY_MAPPING = {
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
    'marketplace': 'Marketplace',
    'insurtech': 'Insurance Technology',
    'edtech': 'Education Technology',
    'cleantech': 'Clean Technology',
    'proptech': 'Property Technology',
    'legaltech': 'Legal Technology',
}

def get_config() -> Dict[str, Any]:
    """Get complete configuration dictionary"""
    return {
        'scrapingant': SCRAPINGANT_CONFIG,
        'search': SEARCH_CONFIG,
        'queries': SEARCH_QUERIES,
        'extraction': EXTRACTION_CONFIG,
        'output': OUTPUT_CONFIG,
        'logging': LOGGING_CONFIG,
        'rate_limit': RATE_LIMIT_CONFIG,
        'error': ERROR_CONFIG,
        'cleaning': CLEANING_CONFIG,
        'categories': CATEGORY_MAPPING,
    }

def validate_config() -> bool:
    """Validate configuration settings"""
    if not SCRAPINGANT_CONFIG['api_key']:
        print("ERROR: SCRAPINGANT_API_KEY environment variable not set")
        print("Please set it with: export SCRAPINGANT_API_KEY='your_api_key_here'")
        return False
    
    if SCRAPINGANT_CONFIG['request_delay'] < 0.5:
        print("WARNING: Request delay is very low, may hit rate limits")
    
    if SEARCH_CONFIG['max_pages_per_query'] > 20:
        print("WARNING: Max pages per query is high, may take a long time")
    
    return True

def print_config_summary():
    """Print a summary of the current configuration"""
    config = get_config()
    
    print("PitchBook ScrapingAnt Configuration Summary:")
    print("=" * 50)
    
    print(f"API Key: {'✓ Set' if config['scrapingant']['api_key'] else '✗ Not set'}")
    print(f"Base URL: {config['scrapingant']['base_url']}")
    print(f"Request Delay: {config['scrapingant']['request_delay']}s")
    print(f"Proxy Country: {config['scrapingant']['proxy_country']}")
    print(f"JavaScript Rendering: {'✓ Enabled' if config['scrapingant']['render_js'] else '✗ Disabled'}")
    
    print(f"\nSearch Configuration:")
    print(f"Max Pages per Query: {config['search']['max_pages_per_query']}")
    print(f"Max Startups per Query: {config['search']['max_startups_per_query']}")
    print(f"Delay Between Searches: {config['search']['delay_between_searches']}s")
    
    print(f"\nOutput Formats: {', '.join(config['output']['formats'])}")
    print(f"Log Level: {config['logging']['level']}")
    
    print(f"\nTotal Search Queries: {sum(len(queries) for queries in config['queries'].values())}")

if __name__ == "__main__":
    print_config_summary()
    print("\n" + "=" * 50)
    
    if validate_config():
        print("✓ Configuration is valid")
    else:
        print("✗ Configuration has issues")
