#!/usr/bin/env python3
"""
Example usage of the CompanyNewsCollector

This script demonstrates how to use the CompanyNewsCollector class programmatically.
"""

from top_n_news import CompanyNewsCollector
import os

def main():
    """Example usage of the news collector."""
    
    # Option 1: Using environment variable for API key
    # Set NEWS_API_KEY in your .env file or environment
    try:
        collector = CompanyNewsCollector()
    except ValueError as e:
        print(f"Error: {e}")
        print("Please set the NEWS_API_KEY environment variable or use option 2 below.")
        return
    
    # Option 2: Pass API key directly (uncomment and replace with your key)
    collector = CompanyNewsCollector(api_key="47475ac280c24cdfbb0b4cc42aa75787")
    
    # Example companies to search
    companies = ["apple", "meta", "amazon"]
    
    for company in companies:
        print(f"\n{'='*60}")
        print(f"Collecting news for: {company}")
        print(f"{'='*60}")
        
        # Collect news for different time periods
        results = collector.collect_news(
            company_name=company,
            max_articles_per_period=20  # Limit to 20 articles per period for demo
        )
        
        # Print summary
        summary = collector.create_summary_report(results)
        print(summary)
        
        # Save results to JSON file in newsdata folder
        output_file = f"../data/newsdata/{company.lower().replace(' ', '_')}_news.json"
        collector.save_results(results, output_file)
        
        # Also save to CSV for easy analysis
        csv_file = f"../data/newsdata/{company.lower().replace(' ', '_')}_news.csv"
        collector.export_to_csv(results, csv_file)
        
        print(f"\nFiles saved to newsdata folder:")
        print(f"  - JSON: {output_file}")
        print(f"  - CSV: {csv_file}")

if __name__ == "__main__":
    main()
