#!/usr/bin/env python3
"""
PitchBook Scraper - Full Column Preservation

This script processes the original PitchBook Excel file and preserves
all original columns while cleaning and normalizing the data.
"""

import pandas as pd
import json
import logging
from datetime import datetime
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PitchBookFullScraper:
    def __init__(self):
        """Initialize the full PitchBook scraper"""
        self.original_columns = [
            'Deal ID',
            'Companies', 
            'Deal Date',
            'Deal Type',
            'Deal Type 2',
            'Deal Size',
            'Post Valuation',
            'Deal Synopsis',
            'Deal Status',
            'Financing Status',
            'Business Status',
            'Investors',
            'Primary Industry Code',
            'Verticals',
            'Description',
            'HQ Location',
            'Company Website',
            'View Company Online'
        ]
        
    def load_and_clean_data(self, file_path):
        """
        Load the original Excel file and clean the data
        
        Args:
            file_path (str): Path to the original Excel file
            
        Returns:
            pd.DataFrame: Cleaned data with all original columns
        """
        try:
            # Load the Excel file
            df = pd.read_excel(file_path)
            logger.info(f"Loaded Excel file with shape: {df.shape}")
            
            # Find the header row (row 6 contains the actual column headers)
            header_row = 6
            data_start_row = 7
            
            # Extract the actual data starting from row 7
            data_df = df.iloc[data_start_row:].copy()
            
            # Set the column names from row 6
            data_df.columns = df.iloc[header_row].values
            
            # Reset index
            data_df = data_df.reset_index(drop=True)
            
            # Remove rows that are completely empty
            data_df = data_df.dropna(how='all')
            
            # Remove the copyright row at the end
            data_df = data_df[~data_df['Deal ID'].str.contains('© PitchBook', na=False)]
            
            logger.info(f"Cleaned data shape: {data_df.shape}")
            return data_df
            
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            return pd.DataFrame()
    
    def normalize_deal_size(self, deal_size):
        """
        Normalize deal size to USD format
        
        Args:
            deal_size: Raw deal size value
            
        Returns:
            str: Normalized deal size in USD
        """
        if pd.isna(deal_size):
            return ''
        
        try:
            # Convert to string and clean
            size_str = str(deal_size).strip()
            
            # If it's already a number, format it
            if size_str.replace('.', '').replace(',', '').isdigit():
                amount = float(size_str.replace(',', ''))
                return f"${amount:,.0f}"
            
            # Handle different formats
            if 'K' in size_str:
                amount = float(size_str.replace('K', '')) * 1000
                return f"${amount:,.0f}"
            elif 'M' in size_str:
                amount = float(size_str.replace('M', '')) * 1000000
                return f"${amount:,.0f}"
            elif 'B' in size_str:
                amount = float(size_str.replace('B', '')) * 1000000000
                return f"${amount:,.0f}"
            
            return size_str
            
        except:
            return str(deal_size)
    
    def normalize_date(self, date_value):
        """
        Normalize date format
        
        Args:
            date_value: Raw date value
            
        Returns:
            str: Normalized date in YYYY-MM-DD format
        """
        if pd.isna(date_value):
            return ''
        
        try:
            # Convert to datetime and format
            parsed_date = pd.to_datetime(date_value)
            return parsed_date.strftime('%Y-%m-%d')
        except:
            return str(date_value)
    
    def clean_and_normalize_data(self, df):
        """
        Clean and normalize the data while preserving all columns
        
        Args:
            df (pd.DataFrame): Raw data
            
        Returns:
            pd.DataFrame: Cleaned and normalized data
        """
        if df.empty:
            return df
        
        cleaned_df = df.copy()
        
        # Normalize deal size
        if 'Deal Size' in cleaned_df.columns:
            cleaned_df['Deal Size'] = cleaned_df['Deal Size'].apply(self.normalize_deal_size)
        
        # Normalize post valuation
        if 'Post Valuation' in cleaned_df.columns:
            cleaned_df['Post Valuation'] = cleaned_df['Post Valuation'].apply(self.normalize_deal_size)
        
        # Normalize deal date
        if 'Deal Date' in cleaned_df.columns:
            cleaned_df['Deal Date'] = cleaned_df['Deal Date'].apply(self.normalize_date)
        
        # Clean company names
        if 'Companies' in cleaned_df.columns:
            cleaned_df['Companies'] = cleaned_df['Companies'].str.strip()
        
        # Clean deal synopsis
        if 'Deal Synopsis' in cleaned_df.columns:
            cleaned_df['Deal Synopsis'] = cleaned_df['Deal Synopsis'].str.strip()
        
        # Clean description
        if 'Description' in cleaned_df.columns:
            cleaned_df['Description'] = cleaned_df['Description'].str.strip()
        
        # Clean HQ location
        if 'HQ Location' in cleaned_df.columns:
            cleaned_df['HQ Location'] = cleaned_df['HQ Location'].str.strip()
        
        # Remove duplicates based on Deal ID
        if 'Deal ID' in cleaned_df.columns:
            cleaned_df = cleaned_df.drop_duplicates(subset=['Deal ID'])
        
        # Add metadata columns
        cleaned_df['data_source'] = 'PitchBook'
        cleaned_df['extraction_date'] = datetime.now().isoformat()
        cleaned_df['processing_notes'] = 'Data extracted from original Excel file with all columns preserved'
        
        logger.info(f"Cleaned data: {len(cleaned_df)} unique deals")
        return cleaned_df
    
    def generate_summary_report(self, df):
        """
        Generate a comprehensive summary report
        
        Args:
            df (pd.DataFrame): Cleaned data
            
        Returns:
            dict: Summary statistics
        """
        if df.empty:
            return {}
        
        summary = {
            'total_deals': len(df),
            'data_completeness': {},
            'deal_type_distribution': {},
            'industry_distribution': {},
            'geographic_distribution': {},
            'deal_size_analysis': {},
            'extraction_date': datetime.now().isoformat(),
            'data_source': 'PitchBook',
            'original_columns_preserved': list(df.columns)
        }
        
        # Calculate completeness for each column
        for column in df.columns:
            if column not in ['data_source', 'extraction_date', 'processing_notes']:
                completeness = (df[column].notna().sum() / len(df)) * 100
                summary['data_completeness'][column] = f"{completeness:.1f}%"
        
        # Deal type distribution
        if 'Deal Type' in df.columns:
            summary['deal_type_distribution'] = df['Deal Type'].value_counts().to_dict()
        
        # Industry distribution
        if 'Primary Industry Code' in df.columns:
            summary['industry_distribution'] = df['Primary Industry Code'].value_counts().to_dict()
        
        # Geographic distribution
        if 'HQ Location' in df.columns:
            summary['geographic_distribution'] = df['HQ Location'].value_counts().to_dict()
        
        # Deal size analysis
        if 'Deal Size' in df.columns:
            deal_sizes = []
            for size in df['Deal Size']:
                if size and '$' in str(size):
                    try:
                        amount = float(str(size).replace('$', '').replace(',', ''))
                        deal_sizes.append(amount)
                    except:
                        continue
            
            if deal_sizes:
                summary['deal_size_analysis'] = {
                    'min': min(deal_sizes),
                    'max': max(deal_sizes),
                    'avg': sum(deal_sizes) / len(deal_sizes),
                    'total_deals_with_size': len(deal_sizes)
                }
        
        return summary
    
    def save_data(self, df, base_filename):
        """
        Save data to multiple formats
        
        Args:
            df (pd.DataFrame): Data to save
            base_filename (str): Base filename without extension
        """
        try:
            # Save to CSV
            csv_filename = f"{base_filename}_full_columns.csv"
            df.to_csv(csv_filename, index=False)
            logger.info(f"Data saved to {csv_filename}")
            
            # Save to Excel
            excel_filename = f"{base_filename}_full_columns.xlsx"
            df.to_excel(excel_filename, index=False)
            logger.info(f"Data saved to {excel_filename}")
            
        except Exception as e:
            logger.error(f"Error saving data: {e}")
    
    def save_summary_report(self, summary, filename):
        """
        Save summary report to JSON
        
        Args:
            summary (dict): Summary report
            filename (str): Output filename
        """
        try:
            with open(filename, 'w') as f:
                json.dump(summary, f, indent=2)
            logger.info(f"Summary report saved to {filename}")
        except Exception as e:
            logger.error(f"Error saving summary report: {e}")

def main():
    """Main function to run the full PitchBook scraper"""
    
    # Initialize scraper
    scraper = PitchBookFullScraper()
    
    # Load and clean data
    input_file = 'PitchBook_Search_Result_Columns_2025_08_07_21_00_05.xlsx'
    df = scraper.load_and_clean_data(input_file)
    
    if df.empty:
        logger.error("No data loaded")
        return
    
    # Clean and normalize data
    cleaned_df = scraper.clean_and_normalize_data(df)
    
    # Save data with all original columns
    scraper.save_data(cleaned_df, 'pitchbook_deals')
    
    # Generate and save summary report
    summary = scraper.generate_summary_report(cleaned_df)
    scraper.save_summary_report(summary, 'pitchbook_full_summary_report.json')
    
    # Print summary
    print("\n=== PITCHBOOK FULL COLUMN SCRAPING SUMMARY ===")
    print(f"Total Deals: {summary.get('total_deals', 0)}")
    print(f"Original Columns Preserved: {len(summary.get('original_columns_preserved', []))}")
    print(f"Data Source: {summary.get('data_source', 'Unknown')}")
    
    if 'deal_size_analysis' in summary:
        analysis = summary['deal_size_analysis']
        print(f"Deal Size Range: ${analysis.get('min', 0):,.0f} - ${analysis.get('max', 0):,.0f}")
        print(f"Average Deal Size: ${analysis.get('avg', 0):,.0f}")
    
    print("=== END SUMMARY ===")
    
    logger.info("PitchBook full column scraping completed successfully")

if __name__ == "__main__":
    main()
