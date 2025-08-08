# Nvidia Market Intelligence Dashboard

A real-time market intelligence dashboard for tracking venture activity, innovation trends, and strategic signals across Digital Bio, Digital Health, and Digital Devices sectors.

## Project Overview

This project delivers a live, filterable, web-based interface that synthesizes venture activity data from multiple sources including CB Insights, PitchBook, Rock Health, Crunchbase, and BiopharmaTrend.

### Timeline
- **Duration**: 2-3 weeks
- **Focus Areas**: Digital Bio, Digital Health, Digital Devices

## Project Structure

```
nvoydia/
├── data/                           # Data storage and management
│   ├── raw/                       # Raw scraped data
│   ├── processed/                 # Cleaned and normalized data
│   └── exports/                   # Exportable datasets
├── scraping/                      # Data scraping workflows
│   ├── crunchbase/               # Crunchbase scraping tools
│   ├── pitchbook/                # PitchBook scraping tools
│   ├── rock_health/              # Rock Health scraping tools
│   ├── cb_insights/              # CB Insights scraping tools
│   ├── biopharmatrend/           # BiopharmaTrend scraping tools
│   └── other_sources/            # Additional data sources
├── dashboard/                     # Dashboard application
│   ├── frontend/                 # UI components and pages
│   ├── backend/                  # API and data processing
│   └── assets/                   # Static assets (images, CSS, etc.)
├── analysis/                      # Data analysis and insights
│   ├── funding_trends/           # 10-year funding trajectory analysis
│   ├── startup_rankings/         # Startup ranking algorithms
│   ├── investor_analysis/        # VC and investor insights
│   └── geographic_analysis/      # Regional innovation hotspots
├── documentation/                 # Project documentation
│   ├── workflows/                # Scraping workflow documentation
│   ├── api_docs/                 # API documentation
│   └── data_schemas/             # Data structure definitions
├── config/                        # Configuration files
│   ├── database/                 # Database configurations
│   ├── api_keys/                 # API key management
│   └── environment/              # Environment variables
├── tests/                         # Testing suite
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── scraping_tests/           # Scraping workflow tests
└── utils/                         # Utility functions
    ├── data_cleaning/            # Data cleaning scripts
    ├── validation/               # Data validation tools
    └── export_tools/             # Export functionality
```

## Key Deliverables

1. **Live, filterable dashboard** - Interactive web interface
2. **Exportable datasets** - Top startups, VCs, funding trends
3. **One-page insight summary** - Strategic insights and recommendations
4. **Documented codebase** - Complete documentation and workflows

## Target Data Fields

- Startup name
- Description
- Category/subcategory
- Total funding
- Last funding year
- Region
- Year founded
- Investors
- Exit status

## Data Sources

- **Crunchbase** - Comprehensive startup database
- **PitchBook** - Private market intelligence
- **Rock Health** - Digital health focused data
- **CB Insights** - Market intelligence platform
- **BiopharmaTrend** - Biotech and pharma insights

## Getting Started

1. Set up data scraping workflows in the `scraping/` directory
2. Configure data sources and API keys in `config/`
3. Develop dashboard components in `dashboard/`
4. Run analysis scripts from `analysis/`
5. Export results using tools in `utils/export_tools/`

