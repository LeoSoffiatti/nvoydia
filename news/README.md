# Company News Collector

This module provides tools to collect prominent news articles about companies using the NewsAPI across different time periods.

## Features

- Collect news articles for companies across multiple time periods:
  - Last 2 weeks
  - Last 1 month
  - Last 1 quarter (3 months)
  - Last 1 year
- Sort articles by popularity to get the most prominent news
- Export results in JSON and CSV formats
- Generate summary reports
- Command-line interface and programmatic API

## Setup

### 1. Get a NewsAPI Key

1. Visit [NewsAPI](https://newsapi.org/register) to register for a free account
2. Get your API key from the dashboard
3. The free tier allows 1,000 requests per day

### 2. Set up your API Key

**Option A: Environment Variable (Recommended)**
```bash
# Create a .env file in the news directory
echo "NEWS_API_KEY=your_api_key_here" > .env
```

**Option B: Pass directly in code**
```python
collector = CompanyNewsCollector(api_key="your_api_key_here")
```

## Usage

### Command Line Interface

```bash
# Basic usage
python top_n_news.py "Apple Inc"

# With custom output file
python top_n_news.py "Tesla" --output tesla_news.json

# With CSV export
python top_n_news.py "Microsoft" --csv microsoft_news.csv

# Limit articles per period
python top_n_news.py "Google" --max-articles 25

# Summary only (no file saving)
python top_n_news.py "Amazon" --summary-only

# Help
python top_n_news.py --help
```

### Programmatic Usage

```python
from top_n_news import CompanyNewsCollector

# Initialize collector
collector = CompanyNewsCollector()

# Collect news for a company
results = collector.collect_news("Apple Inc", max_articles_per_period=50)

# Print summary
summary = collector.create_summary_report(results)
print(summary)

# Save to files
collector.save_results(results, "apple_news.json")
collector.export_to_csv(results, "apple_news.csv")
```

### Example Script

Run the example script to see it in action:
```bash
python example_usage.py
```

## Output Format

### JSON Structure
```json
{
  "company_name": "Apple Inc",
  "collected_at": "2024-01-15T10:30:00",
  "periods": {
    "2_weeks": {
      "date_range": {
        "from": "2024-01-01",
        "to": "2024-01-15"
      },
      "total_results": 150,
      "articles_collected": 20,
      "articles": [
        {
          "title": "Article Title",
          "description": "Article description...",
          "url": "https://example.com/article",
          "published_at": "2024-01-15T08:00:00Z",
          "source": {
            "name": "Source Name",
            "id": "source-id"
          },
          "author": "Author Name",
          "url_to_image": "https://example.com/image.jpg",
          "content": "Article content..."
        }
      ]
    }
  }
}
```

### CSV Format
The CSV export includes columns:
- `period`: Time period (2_weeks, 1_month, etc.)
- `title`: Article title
- `description`: Article description
- `url`: Article URL
- `published_at`: Publication date
- `source_name`: News source name
- `author`: Article author
- `url_to_image`: Image URL

## API Parameters

The script uses the following NewsAPI parameters:
- **q**: Company name in quotes for exact phrase matching
- **sortBy**: "popularity" to get most prominent articles first
- **language**: "en" for English articles only
- **pageSize**: Configurable (max 100)
- **from/to**: Date range for each time period

## Error Handling

The script handles various error scenarios:
- Missing API key
- Network errors
- API rate limiting
- Invalid responses

## Dependencies

- `requests`: HTTP requests
- `python-dotenv`: Environment variable loading
- `pandas`: CSV export functionality

All dependencies are already included in the project's `requirements.txt`.

## Rate Limiting

The free NewsAPI tier allows 1,000 requests per day. Each company search uses 4 requests (one per time period). Plan accordingly for multiple companies or frequent usage.

## Tips

1. **Company Names**: Use exact company names for better results (e.g., "Apple Inc" vs "Apple")
2. **Date Ranges**: The script automatically calculates date ranges based on current date
3. **Popularity Sorting**: Articles are sorted by popularity to get the most prominent news first
4. **Content Filtering**: Only articles with titles and URLs are included in results
5. **File Formats**: JSON preserves all data, CSV is better for analysis in Excel/Google Sheets
