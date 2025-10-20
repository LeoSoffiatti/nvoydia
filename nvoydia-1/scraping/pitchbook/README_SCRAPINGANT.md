# PitchBook ScrapingAnt Scraper

A powerful and flexible web scraper for PitchBook using ScrapingAnt's API service. This scraper can extract comprehensive startup data from PitchBook without requiring login credentials or browser automation.

## Features

- **No Login Required**: Uses ScrapingAnt's API to access public PitchBook pages
- **Comprehensive Data Extraction**: Captures startup names, descriptions, categories, funding, location, and more
- **Smart Pagination**: Automatically handles multiple result pages
- **Data Cleaning**: Normalizes and standardizes extracted data
- **Multiple Output Formats**: Export to CSV, Excel, and JSON
- **Rate Limiting**: Built-in rate limiting to avoid API limits
- **Error Handling**: Robust error handling and retry mechanisms
- **Logging**: Comprehensive logging for debugging and monitoring
- **Configurable**: Easy to customize search queries and extraction parameters

## Requirements

- Python 3.7+
- ScrapingAnt API key (get from [https://scrapingant.com/](https://scrapingant.com/))
- Required Python packages (see requirements.txt)

## Installation

1. **Clone or download the scraper files**:
   ```bash
   # Make sure you're in the scraping/pitchbook directory
   cd scraping/pitchbook
   ```

2. **Install required dependencies**:
   ```bash
   pip install requests pandas beautifulsoup4 openpyxl
   ```

3. **Get your ScrapingAnt API key**:
   - Sign up at [https://scrapingant.com/](https://scrapingant.com/)
   - Get your API key from the dashboard
   - Set it as an environment variable:
     ```bash
     # On Windows (PowerShell)
     $env:SCRAPINGANT_API_KEY="your_api_key_here"
     
     # On Windows (Command Prompt)
     set SCRAPINGANT_API_KEY=your_api_key_here
     
     # On Linux/Mac
     export SCRAPINGANT_API_KEY="your_api_key_here"
     ```

## Quick Start

### Basic Usage

```python
from pitchbook_scraping_ant import PitchBookScrapingAnt

# Initialize scraper
scraper = PitchBookScrapingAnt("your_api_key_here")

# Search for startups
startups = scraper.search_startups("healthcare startups", max_pages=3)

# Save results
scraper.save_to_csv(startups, "healthcare_startups.csv")
```

### Run the Main Scraper

```bash
python pitchbook_scraping_ant.py
```

### Run Examples

```bash
python example_usage.py
```

### Check Configuration

```bash
python config_scrapingant.py
```

## Configuration

The scraper is highly configurable through the `config_scrapingant.py` file:

### ScrapingAnt Settings
- **API Key**: Your ScrapingAnt API key
- **Request Delay**: Time between requests (default: 1 second)
- **Proxy Country**: Country for proxy rotation (US, UK, DE, etc.)
- **JavaScript Rendering**: Whether to render JavaScript (recommended: True)

### Search Settings
- **Max Pages per Query**: Maximum pages to scrape per search (default: 5)
- **Max Startups per Query**: Maximum startups to extract per search (default: 100)
- **Delay Between Searches**: Delay between different search queries (default: 2 seconds)

### Output Settings
- **Formats**: CSV, Excel, JSON (all enabled by default)
- **Timestamp**: Include timestamp in filenames (recommended: True)
- **Output Directory**: Where to save scraped data

## Usage Examples

### 1. Basic Startup Search

```python
from pitchbook_scraping_ant import PitchBookScrapingAnt

scraper = PitchBookScrapingAnt("your_api_key")

# Search for healthcare startups
startups = scraper.search_startups("healthcare startups", max_pages=3)
print(f"Found {len(startups)} startups")

# Save to CSV
scraper.save_to_csv(startups, "healthcare_startups.csv")
```

### 2. Multiple Search Queries

```python
queries = ["AI companies", "fintech startups", "biotech companies"]
all_startups = []

for query in queries:
    startups = scraper.search_startups(query, max_pages=2)
    all_startups.extend(startups)
    print(f"Found {len(startups)} startups for '{query}'")

# Remove duplicates and save
unique_startups = scraper.clean_and_normalize_data(all_startups)
scraper.save_to_excel(unique_startups, "all_startups.xlsx")
```

### 3. Custom Configuration

```python
# Initialize with custom settings
scraper = PitchBookScrapingAnt(
    api_key="your_api_key",
    base_url="https://api.scrapingant.com/v2"
)

# Customize rate limiting
scraper.request_delay = 2.0  # Slower requests

# Search with custom parameters
startups = scraper.search_startups("software startups", max_pages=5)
```

### 4. Data Analysis

```python
# Generate comprehensive report
summary = scraper.generate_summary_report(startups)

print(f"Total Startups: {summary['total_startups']}")
print(f"Data Completeness: {summary['data_completeness']}")
print(f"Category Distribution: {summary['category_distribution']}")
```

## Data Structure

Each startup record contains the following fields:

### Required Fields
- `startup_name`: Company name
- `description`: Company description/summary
- `data_source`: Source of data (always "PitchBook")
- `extraction_date`: When data was extracted
- `source_url`: URL where data was found

### Optional Fields
- `category`: Primary industry category
- `subcategory`: Secondary industry category
- `total_funding`: Total funding amount
- `last_funding_year`: Year of last funding round
- `region`: Geographic location
- `year_founded`: Year company was founded
- `investors`: List of investors
- `exit_status`: Exit status (Active, Acquired, etc.)
- `website`: Company website URL
- `linkedin_url`: LinkedIn profile URL
- `employee_count`: Number of employees
- `headquarters`: Headquarters location
- `is_stealth`: Whether company is in stealth mode
- `notes`: Additional notes or flags

## Output Files

The scraper generates several output files:

1. **CSV File**: `pitchbook_startups_scrapingant_YYYYMMDD_HHMMSS.csv`
2. **Excel File**: `pitchbook_startups_scrapingant_YYYYMMDD_HHMMSS.xlsx`
3. **JSON File**: `pitchbook_startups_scrapingant_YYYYMMDD_HHMMSS.json`
4. **Summary Report**: `pitchbook_summary_scrapingant_YYYYMMDD_HHMMSS.json`
5. **Log File**: `pitchbook_scraping_ant.log`

## Rate Limiting and Best Practices

### Rate Limiting
- **Default**: 1 request per second
- **Recommended**: 2-3 seconds between requests for large scraping jobs
- **ScrapingAnt Limits**: Check your plan's rate limits

### Best Practices
1. **Start Small**: Begin with 1-2 pages to test
2. **Use Delays**: Don't set request delay below 1 second
3. **Monitor Logs**: Check log files for errors and warnings
4. **Respect Terms**: Follow PitchBook's terms of service
5. **Data Quality**: Review extracted data for accuracy

## Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   Error: No API key provided
   ```
   **Solution**: Set the `SCRAPINGANT_API_KEY` environment variable

2. **Rate Limit Exceeded**
   ```
   Error: Rate limit exceeded
   ```
   **Solution**: Increase `request_delay` in configuration

3. **No Data Extracted**
   ```
   Warning: No content returned for: [URL]
   ```
   **Solution**: Check if the URL is accessible, try different proxy countries

4. **Authentication Error**
   ```
   Error: Invalid API key
   ```
   **Solution**: Verify your ScrapingAnt API key is correct

### Debug Mode

Enable debug logging by modifying the logging level in the main script:

```python
logging.basicConfig(level=logging.DEBUG)
```

### Check Configuration

Run the configuration validator:

```bash
python config_scrapingant.py
```

## Advanced Features

### Custom Selectors

You can customize the HTML selectors used for data extraction by modifying the `_extract_startup_from_element` method:

```python
# Add custom selectors for your specific use case
custom_selectors = {
    'custom_field': ['.custom-selector', '[data-custom]']
}
```

### Proxy Rotation

Use different proxy countries for better success rates:

```python
# Use different proxy countries
scraper.scrape_url(url, proxy_country="UK")
scraper.scrape_url(url, proxy_country="DE")
```

### JavaScript Rendering

Control whether JavaScript is rendered:

```python
# Disable JavaScript for faster scraping (if not needed)
scraper.scrape_url(url, render_js=False)
```

## Data Quality and Validation

### Data Cleaning
- Removes duplicate startups
- Normalizes category names
- Standardizes date formats
- Cleans and validates text content

### Quality Metrics
The scraper provides data quality metrics:
- **Completeness**: Percentage of fields with data
- **Category Distribution**: Breakdown by industry
- **Region Distribution**: Geographic distribution
- **Funding Analysis**: Funding amount statistics

## Legal and Ethical Considerations

1. **Terms of Service**: Always review and comply with PitchBook's terms of service
2. **Rate Limiting**: Respect reasonable rate limits
3. **Data Usage**: Use scraped data responsibly and ethically
4. **Attribution**: Credit PitchBook as the data source when appropriate
5. **Commercial Use**: Check if your use case requires permission

## Support and Contributing

### Getting Help
- Check the log files for detailed error messages
- Review the configuration settings
- Test with a small number of pages first

### Contributing
- Report bugs and issues
- Suggest improvements
- Share custom selectors for specific use cases

## License

This scraper is provided as-is for educational and research purposes. Users are responsible for complying with all applicable laws and terms of service.

## Changelog

### Version 1.0.0
- Initial release
- Basic PitchBook scraping functionality
- Multiple output formats
- Data cleaning and normalization
- Comprehensive logging and error handling

---

**Note**: This scraper is designed to work with public PitchBook pages. Some data may require authentication or may be limited based on your ScrapingAnt plan and PitchBook's access policies.
