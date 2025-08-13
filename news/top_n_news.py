#!/usr/bin/env python3
"""
Company News Collector using NewsAPI

This script collects prominent news articles about a company across different time periods:
- Last 2 weeks
- Last 1 month  
- Last 1 quarter (3 months)
- Last 1 year

Usage:
    python top_n_news.py "Apple Inc"
    python top_n_news.py "Tesla" --api-key YOUR_API_KEY
    python top_n_news.py "Microsoft" --output microsoft_news.json
"""

import os
import json
import argparse
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import requests
from dotenv import load_dotenv
import pandas as pd

# Load environment variables
load_dotenv()

class CompanyNewsCollector:
    """Collects news articles about companies using NewsAPI."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the news collector.
        
        Args:
            api_key: NewsAPI key. If not provided, will try to get from environment.
        """
        self.api_key = api_key or os.getenv('NEWS_API_KEY')
        if not self.api_key:
            raise ValueError(
                "NewsAPI key is required. Set NEWS_API_KEY environment variable "
                "or pass it as a parameter."
            )
        
        self.base_url = "https://newsapi.org/v2/everything"
        self.session = requests.Session()
    
    def _calculate_date_range(self, days_back: int, window_size: int = 7) -> tuple[str, str]:
        """
        Calculate date range for API query.
        
        Args:
            days_back: Number of days to look back
            
        Returns:
            Tuple of (from_date, to_date) in ISO format
        """
        start_date = datetime.now() - timedelta(days=days_back)
        end_date = start_date + timedelta(days=window_size)
        
        return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
    
    def _make_api_request(self, company_name: str, from_date: str, to_date: str, 
                         page_size: int = 100, sort_by: str = 'popularity') -> Dict[str, Any]:
        """
        Make a request to NewsAPI.
        
        Args:
            company_name: Name of the company to search for
            from_date: Start date in YYYY-MM-DD format
            to_date: End date in YYYY-MM-DD format
            page_size: Number of results per page (max 100)
            sort_by: Sort order ('relevancy', 'popularity', 'publishedAt')
            
        Returns:
            API response as dictionary
        """
        params = {
            'q': f'"{company_name}"',  # Exact phrase match
            'from': from_date,
            'to': to_date,
            'sortBy': sort_by,
            'pageSize': page_size,
            'language': 'en',  # English articles only
            'apiKey': self.api_key
        }
        
        try:
            response = self.session.get(self.base_url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error making API request: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def collect_news(self, company_name: str, max_articles_per_period: int = 50) -> Dict[str, Any]:
        """
        Collect news articles for different time periods.
        
        Args:
            company_name: Name of the company to search for
            max_articles_per_period: Maximum number of articles to collect per period
            
        Returns:
            Dictionary containing news articles organized by time period
        """
        time_periods = {
            '2_weeks': 14,
            '1_month': 30,
            '1_quarter': 90,
            '1_year': 365
        }
        
        results = {
            'company_name': company_name,
            'collected_at': datetime.now().isoformat(),
            'periods': {}
        }
        
        print(f"Collecting news for '{company_name}'...")
        
        for period_name, days_back in time_periods.items():
            print(f"  - {period_name.replace('_', ' ')}: ", end='')
            
            from_date, to_date = self._calculate_date_range(days_back, window_size = 7)
            
            # Make API request
            response = self._make_api_request(
                company_name=company_name,
                from_date=from_date,
                to_date=to_date,
                page_size=min(max_articles_per_period, 100),
                sort_by='popularity'  # Get most popular articles first
            )
            
            if response.get('status') == 'ok':
                articles = response.get('articles', [])
                total_results = response.get('totalResults', 0)
                
                # Process and clean articles
                processed_articles = self._process_articles(articles)
                
                results['periods'][period_name] = {
                    'date_range': {
                        'from': from_date,
                        'to': to_date
                    },
                    'total_results': total_results,
                    'articles_collected': len(processed_articles),
                    'articles': processed_articles
                }
                
                print(f"{len(processed_articles)} articles (total available: {total_results})")
            else:
                error_msg = response.get('message', 'Unknown error')
                print(f"Error: {error_msg}")
                results['periods'][period_name] = {
                    'error': error_msg,
                    'date_range': {'from': from_date, 'to': to_date}
                }
        
        return results
    
    def _process_articles(self, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process and clean articles from API response.
        
        Args:
            articles: Raw articles from API
            
        Returns:
            Processed articles with relevant fields
        """
        processed = []
        
        for article in articles:
            # Extract relevant fields
            processed_article = {
                'title': article.get('title', ''),
                'description': article.get('description', ''),
                'url': article.get('url', ''),
                'published_at': article.get('publishedAt', ''),
                'source': {
                    'name': article.get('source', {}).get('name', ''),
                    'id': article.get('source', {}).get('id', '')
                },
                'author': article.get('author', ''),
                'url_to_image': article.get('urlToImage', ''),
                'content': article.get('content', '')
            }
            
            # Only include articles with meaningful content
            if processed_article['title'] and processed_article['url']:
                processed.append(processed_article)
        
        return processed
    
    def save_results(self, results: Dict[str, Any], output_file: str) -> None:
        """
        Save results to a JSON file.
        
        Args:
            results: Results dictionary
            output_file: Output file path
        """
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\nResults saved to: {output_file}")
        except Exception as e:
            print(f"Error saving results: {e}")
    
    def create_summary_report(self, results: Dict[str, Any]) -> str:
        """
        Create a summary report of the collected news.
        
        Args:
            results: Results dictionary
            
        Returns:
            Formatted summary report
        """
        company_name = results['company_name']
        collected_at = results['collected_at']
        
        report = f"""
COMPANY NEWS SUMMARY REPORT
==========================
Company: {company_name}
Generated: {collected_at}

PERIOD SUMMARY:
"""
        
        for period_name, period_data in results['periods'].items():
            if 'error' in period_data:
                report += f"\n{period_name.replace('_', ' ').title()}: ERROR - {period_data['error']}"
            else:
                date_range = period_data['date_range']
                total_results = period_data['total_results']
                articles_collected = period_data['articles_collected']
                
                report += f"\n{period_name.replace('_', ' ').title()}:"
                report += f"\n  Date Range: {date_range['from']} to {date_range['to']}"
                report += f"\n  Total Available: {total_results} articles"
                report += f"\n  Collected: {articles_collected} articles"
                
                # Show top 3 articles by title
                if period_data['articles']:
                    report += f"\n  Top Articles:"
                    for i, article in enumerate(period_data['articles'][:3], 1):
                        title = article['title'][:80] + "..." if len(article['title']) > 80 else article['title']
                        report += f"\n    {i}. {title}"
                report += "\n"
        
        return report
    
    def export_to_csv(self, results: Dict[str, Any], output_file: str) -> None:
        """
        Export results to CSV format for easy analysis.
        
        Args:
            results: Results dictionary
            output_file: Output CSV file path
        """
        all_articles = []
        
        for period_name, period_data in results['periods'].items():
            if 'articles' in period_data:
                for article in period_data['articles']:
                    article_row = {
                        'period': period_name,
                        'title': article['title'],
                        'description': article['description'],
                        'url': article['url'],
                        'published_at': article['published_at'],
                        'source_name': article['source']['name'],
                        'author': article['author'],
                        'url_to_image': article['url_to_image']
                    }
                    all_articles.append(article_row)
        
        if all_articles:
            df = pd.DataFrame(all_articles)
            df.to_csv(output_file, index=False, encoding='utf-8')
            print(f"CSV export saved to: {output_file}")
        else:
            print("No articles to export to CSV")


def main():
    """Main function to run the news collector."""
    parser = argparse.ArgumentParser(
        description="Collect news articles about a company using NewsAPI"
    )
    parser.add_argument(
        'company_name',
        help='Name of the company to search for'
    )
    parser.add_argument(
        '--api-key',
        help='NewsAPI key (optional if NEWS_API_KEY env var is set)'
    )
    parser.add_argument(
        '--output',
        default='company_news.json',
        help='Output JSON file path (default: company_news.json)'
    )
    parser.add_argument(
        '--csv',
        help='Also export to CSV file'
    )
    parser.add_argument(
        '--max-articles',
        type=int,
        default=50,
        help='Maximum articles per time period (default: 50)'
    )
    parser.add_argument(
        '--summary-only',
        action='store_true',
        help='Only print summary report, don\'t save files'
    )
    
    args = parser.parse_args()
    
    try:
        # Initialize collector
        collector = CompanyNewsCollector(api_key=args.api_key)
        
        # Collect news
        results = collector.collect_news(
            company_name=args.company_name,
            max_articles_per_period=args.max_articles
        )
        
        # Print summary
        summary = collector.create_summary_report(results)
        print(summary)
        
        # Save results if not summary-only
        if not args.summary_only:
            # Save JSON
            collector.save_results(results, args.output)
            
            # Save CSV if requested
            if args.csv:
                collector.export_to_csv(results, args.csv)
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
