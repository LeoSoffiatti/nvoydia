# Data Scraping Workflows

This directory contains scraping tools and workflows for extracting startup data from various platforms.

## Supported Platforms

### Crunchbase (`crunchbase/`)
- **Focus**: Comprehensive startup database
- **Target Sample**: 20-30 startups
- **Tools**: Selenium, Beautiful Soup, DataMiner
- **Export Format**: CSV/JSON

### PitchBook (`pitchbook/`)
- **Focus**: Private market intelligence
- **Target Sample**: 20-30 startups
- **Tools**: Built-in export tools, API integration
- **Export Format**: Excel/CSV

### Rock Health (`rock_health/`)
- **Focus**: Digital health startups
- **Target Sample**: 20-30 startups
- **Tools**: Web scraping, API calls
- **Export Format**: CSV/JSON

### CB Insights (`cb_insights/`)
- **Focus**: Market intelligence and trends
- **Target Sample**: 20-30 startups
- **Tools**: API integration, export tools
- **Export Format**: CSV/Excel

### BiopharmaTrend (`biopharmatrend/`)
- **Focus**: Biotech and pharmaceutical insights
- **Target Sample**: 20-30 startups
- **Tools**: Web scraping, content extraction
- **Export Format**: CSV/JSON

## Data Structure Requirements

All scraped data should include the following fields:
- `startup_name`: Company name
- `description`: Brief company description
- `category`: Primary business category
- `subcategory`: More specific business focus
- `total_funding`: Total funding raised (USD)
- `last_funding_year`: Year of most recent funding
- `region`: Geographic location
- `year_founded`: Company founding year
- `investors`: List of investors
- `exit_status`: Current status (active, acquired, IPO, closed)

## Data Quality Standards

1. **No Duplicates**: Ensure unique entries per platform
2. **Standardized Formats**: 
   - Funding in USD
   - Consistent date formats (YYYY-MM-DD)
   - Normalized category names
3. **Missing Data Handling**: Mark unavailable fields clearly
4. **Stealth Startups**: Include if available, mark clearly

## Testing Protocol

1. Extract sample data from each platform
2. Validate data structure and completeness
3. Compare data quality across sources
4. Document limitations and challenges
5. Create summary comparison sheet

## Tools Evaluation

### Recommended Tools
- **Selenium**: Dynamic content scraping
- **Beautiful Soup**: HTML parsing
- **Scrapy**: Large-scale scraping
- **DataMiner**: Browser-based extraction
- **Python Requests**: API interactions
- **Google Sheets Extensions**: Direct export integration

### Evaluation Criteria
- Data quality and completeness
- Export ease and automation
- Rate limiting and compliance
- Maintenance requirements
- Cost considerations
