"""
Configuration file for PitchBook scraping workflow
"""

# Search Criteria Configuration
SEARCH_CRITERIA = {
    'industries': [
        'Healthcare',
        'Biotechnology', 
        'Digital Health',
        'Medical Technology',
        'Healthcare Technology',
        'Biopharma',
        'Digital Bio'
    ],
    'regions': [
        'United States',
        'Europe',
        'Asia',
        'North America'
    ],
    'funding_stages': [
        'Seed',
        'Series A',
        'Series B', 
        'Series C',
        'Series D',
        'Series E+'
    ],
    'min_funding': 1000000,  # $1M minimum
    'max_funding': 1000000000,  # $1B maximum
    'max_startups': 30  # Target number of startups per platform
}

# Data Fields Configuration
TARGET_FIELDS = [
    'startup_name',
    'description', 
    'category',
    'subcategory',
    'total_funding',
    'last_funding_year',
    'region',
    'year_founded',
    'investors',
    'exit_status'
]

# Data Quality Settings
DATA_QUALITY = {
    'remove_duplicates': True,
    'normalize_categories': True,
    'standardize_dates': True,
    'normalize_funding': True,
    'mark_stealth_startups': True
}

# Output Configuration
OUTPUT_SETTINGS = {
    'csv_output': 'pitchbook_startups_cleaned.csv',
    'excel_output': 'pitchbook_startups_cleaned.xlsx',
    'summary_report': 'pitchbook_summary_report.json',
    'include_notes': True,
    'include_timestamps': True
}

# Scraping Settings
SCRAPING_SETTINGS = {
    'headless': True,
    'timeout': 10,
    'page_load_wait': 2,
    'max_retries': 3,
    'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

# Category Normalization Mapping
CATEGORY_MAPPING = {
    'healthcare': 'Healthcare',
    'health tech': 'Healthcare Technology',
    'biotech': 'Biotechnology',
    'digital health': 'Digital Health',
    'medtech': 'Medical Technology',
    'biopharma': 'Biopharmaceuticals',
    'digital bio': 'Digital Bio',
    'fintech': 'Financial Technology',
    'ai': 'Artificial Intelligence',
    'machine learning': 'Artificial Intelligence',
    'ml': 'Artificial Intelligence',
    'iot': 'Internet of Things',
    'cybersecurity': 'Cybersecurity',
    'enterprise software': 'Enterprise Software'
}

# Funding Normalization
FUNDING_MULTIPLIERS = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
}

# Date Formats
DATE_FORMATS = [
    '%Y-%m-%d',
    '%Y/%m/%d',
    '%m/%d/%Y',
    '%Y',
    '%Y-%m'
]
