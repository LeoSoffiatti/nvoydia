# PitchBook Scraping Workflow

This directory contains comprehensive scraping tools and workflows for extracting startup data from PitchBook, specifically designed for the Nvidia Market Intelligence Dashboard project.

## Overview

The PitchBook scraper extracts startup data including:
- **Startup name, description, category, subcategory**
- **Total funding, last funding year, region, year founded**
- **Investors, exit status**
- **Stealth startup identification**

## Files Structure

```
pitchbook/
├── pitchbook_scraper.py          # Main scraping script
├── config.py                     # Configuration settings
├── data_quality_assessment.py    # Data quality analysis
├── README.md                     # This documentation
├── PitchBook_Search_Result_Columns_2025_08_07_21_00_05.xlsx  # Raw data
├── pitchbook_startups_cleaned.csv    # Cleaned data (output)
├── pitchbook_startups_cleaned.xlsx   # Cleaned data (output)
├── pitchbook_summary_report.json     # Summary report (output)
└── data_quality_report.json          # Quality assessment (output)
```

## Target Data Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| startup_name | Company name | String | "HealthTech Inc." |
| description | Company description | String | "AI-powered healthcare platform" |
| category | Primary business category | String | "Healthcare" |
| subcategory | Specific business focus | String | "Digital Health" |
| total_funding | Total funding raised | USD | "$50,000,000" |
| last_funding_year | Year of most recent funding | YYYY-MM-DD | "2024-01-15" |
| region | Geographic location | String | "United States" |
| year_founded | Company founding year | YYYY-MM-DD | "2018-03-01" |
| investors | List of investors | Array | ["Sequoia", "Andreessen"] |
| exit_status | Current status | String | "Active" |

## Search Criteria

### Industries (Digital Bio, Health, Devices Focus)
- Healthcare
- Biotechnology
- Digital Health
- Medical Technology
- Healthcare Technology
- Biopharma
- Digital Bio

### Regions
- United States
- Europe
- Asia
- North America

### Funding Stages
- Seed
- Series A
- Series B
- Series C
- Series D
- Series E+

### Funding Range
- Minimum: $1,000,000
- Maximum: $1,000,000,000

## Data Quality Standards

### Completeness Requirements
- **Startup Name**: 100% required
- **Description**: 80% minimum
- **Category**: 90% minimum
- **Funding Data**: 70% minimum
- **Geographic Data**: 85% minimum

### Data Cleaning Process
1. **Remove Duplicates**: Based on startup name
2. **Normalize Categories**: Standardize category names
3. **Standardize Dates**: Convert to YYYY-MM-DD format
4. **Normalize Funding**: Convert to USD format
5. **Mark Stealth Startups**: Identify and flag stealth companies

### Quality Metrics
- **Completeness Score**: Percentage of non-null fields
- **Duplicate Rate**: Percentage of duplicate records
- **Data Accuracy**: Validation against known standards
- **Temporal Consistency**: Date format consistency

## Usage Instructions

### 1. Setup Environment

```bash
# Install required packages
pip install -r ../../requirements.txt

# Install Chrome WebDriver (for Selenium)
# Download from: https://chromedriver.chromium.org/
```

### 2. Configure Settings

Edit `config.py` to customize:
- Search criteria
- Data quality settings
- Output formats
- Scraping parameters

### 3. Run Scraping Workflow

```bash
# Run main scraper
python pitchbook_scraper.py

# Run data quality assessment
python data_quality_assessment.py
```

### 4. Review Outputs

Generated files:
- `pitchbook_startups_cleaned.csv` - Cleaned startup data
- `pitchbook_startups_cleaned.xlsx` - Excel format
- `pitchbook_summary_report.json` - Summary statistics
- `data_quality_report.json` - Quality assessment

## Data Quality Assessment

The `data_quality_assessment.py` script provides:

### Completeness Analysis
- Field-by-field completeness percentages
- Missing data identification
- Data quality scoring

### Duplicate Detection
- Exact duplicate identification
- Similar name detection (fuzzy matching)
- Duplicate rate calculation

### Funding Analysis
- Funding data validation
- Statistical analysis (min, max, avg, median)
- Currency normalization

### Geographic Distribution
- Regional startup distribution
- Geographic data quality assessment

### Temporal Analysis
- Founding year analysis
- Funding year trends
- Date format consistency

## Limitations and Considerations

### Technical Limitations
1. **Rate Limiting**: PitchBook may limit request frequency
2. **Authentication**: Requires valid PitchBook credentials
3. **Dynamic Content**: Website structure may change
4. **CAPTCHA**: May encounter anti-bot measures

### Data Limitations
1. **Incomplete Data**: Some fields may be unavailable
2. **Stealth Startups**: Limited information available
3. **Regional Bias**: Data may be skewed toward certain regions
4. **Temporal Lag**: Data may not be real-time

### Compliance Considerations
1. **Terms of Service**: Ensure compliance with PitchBook ToS
2. **Rate Limiting**: Respect platform rate limits
3. **Data Usage**: Follow data usage guidelines
4. **Privacy**: Respect startup privacy preferences

## Troubleshooting

### Common Issues

1. **WebDriver Errors**
   ```bash
   # Install ChromeDriver
   brew install chromedriver
   ```

2. **Authentication Failures**
   - Verify PitchBook credentials
   - Check account status
   - Ensure proper login flow

3. **Data Quality Issues**
   - Review data quality report
   - Adjust scraping parameters
   - Validate data manually

4. **Rate Limiting**
   - Increase delays between requests
   - Use proxy rotation
   - Implement exponential backoff

### Debug Mode

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Integration with Dashboard

The scraped data integrates with the dashboard through:

1. **Data Pipeline**: Automated data processing
2. **API Integration**: Real-time data updates
3. **Visualization**: Interactive charts and graphs
4. **Export Functionality**: Download capabilities

## Next Steps

1. **Test with Real Credentials**: Implement actual PitchBook login
2. **Expand to Other Sources**: Crunchbase, Rock Health, CB Insights
3. **Automate Workflow**: Schedule regular data updates
4. **Enhance Quality**: Improve data validation and cleaning
5. **Dashboard Integration**: Connect to main dashboard application

## Contact

For questions or issues with the PitchBook scraping workflow, contact the development team.
