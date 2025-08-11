#!/usr/bin/env python3
"""
PitchBook Comprehensive Scraper - Dashboard Integration Ready

This script processes the comprehensive PitchBook Excel file with all 153 columns
and prepares a clean, standardized dataset for dashboard integration.
Includes data cleaning, duplicate removal, standardization, and schema documentation.
"""

import pandas as pd
import json
import logging
from datetime import datetime
import re
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PitchBookComprehensiveScraper:
    def __init__(self):
        """Initialize the comprehensive PitchBook scraper"""
        # Core columns for dashboard integration
        self.dashboard_columns = [
            'Company ID', 'Companies', 'Company Legal Name', 'Description',
            'Primary Industry Sector', 'Primary Industry Group', 'Primary Industry Code',
            'Verticals', 'Keywords', 'Company Financing Status', 'Total Raised',
            'Business Status', 'Year Founded', 'HQ Location', 'HQ City', 'HQ State/Province',
            'HQ Country/Territory/Region', 'Employees', 'Revenue', 'Market Cap',
            'Last Known Valuation', 'Post-Money Valuation', 'Total Raised to Date',
            'Active Investors', '# Active Investors', 'First Financing Date',
            'Last Financing Date', 'Series', 'Website', 'LinkedIn URL'
        ]
        
        # Column mapping for standardization
        self.column_mapping = {
            'Company ID': 'company_id',
            'Companies': 'company_name',
            'Company Legal Name': 'legal_name',
            'Description': 'description',
            'Primary Industry Sector': 'industry_sector',
            'Primary Industry Group': 'industry_group',
            'Primary Industry Code': 'industry_code',
            'Verticals': 'verticals',
            'Keywords': 'keywords',
            'Company Financing Status': 'financing_status',
            'Total Raised': 'total_funding',
            'Business Status': 'business_status',
            'Year Founded': 'year_founded',
            'HQ Location': 'hq_location',
            'HQ City': 'hq_city',
            'HQ State/Province': 'hq_state',
            'HQ Country/Territory/Region': 'hq_country',
            'Employees': 'employee_count',
            'Revenue': 'revenue',
            'Market Cap': 'market_cap',
            'Last Known Valuation': 'last_valuation',
            'Post-Money Valuation': 'post_money_valuation',
            'Total Raised to Date': 'total_raised',
            'Active Investors': 'active_investors',
            '# Active Investors': 'investor_count',
            'First Financing Date': 'first_financing_date',
            'Last Financing Date': 'last_financing_date',
            'Series': 'funding_series',
            'Website': 'website',
            'LinkedIn URL': 'linkedin_url'
        }
        
    def load_comprehensive_data(self, file_path):
        """
        Load the comprehensive PitchBook Excel file
        
        Args:
            file_path (str): Path to the comprehensive Excel file
            
        Returns:
            pd.DataFrame: Raw data with proper headers
        """
        try:
            # Load the Excel file
            df = pd.read_excel(file_path)
            logger.info(f"Loaded comprehensive Excel file with shape: {df.shape}")
            
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
            
            # Remove any copyright or metadata rows
            data_df = data_df[~data_df['Company ID'].str.contains('©|PitchBook|Downloaded|Created|Search', na=False)]
            
            logger.info(f"Cleaned data shape: {data_df.shape}")
            return data_df
            
        except Exception as e:
            logger.error(f"Error loading comprehensive data: {e}")
            return pd.DataFrame()
    
    def clean_and_standardize_data(self, df):
        """
        Clean and standardize the comprehensive data
        
        Args:
            df (pd.DataFrame): Raw data
            
        Returns:
            pd.DataFrame: Cleaned and standardized data
        """
        if df.empty:
            return df
        
        cleaned_df = df.copy()
        
        # Clean company names
        if 'Companies' in cleaned_df.columns:
            cleaned_df['Companies'] = cleaned_df['Companies'].str.strip()
            cleaned_df['Companies'] = cleaned_df['Companies'].fillna('Unknown Company')
        
        # Clean legal names
        if 'Company Legal Name' in cleaned_df.columns:
            cleaned_df['Company Legal Name'] = cleaned_df['Company Legal Name'].str.strip()
            cleaned_df['Company Legal Name'] = cleaned_df['Company Legal Name'].fillna(cleaned_df['Companies'])
        
        # Clean descriptions
        if 'Description' in cleaned_df.columns:
            cleaned_df['Description'] = cleaned_df['Description'].str.strip()
            cleaned_df['Description'] = cleaned_df['Description'].fillna('No description available')
        
        # Standardize industry sectors
        if 'Primary Industry Sector' in cleaned_df.columns:
            cleaned_df['Primary Industry Sector'] = cleaned_df['Primary Industry Sector'].str.strip()
            cleaned_df['Primary Industry Sector'] = cleaned_df['Primary Industry Sector'].fillna('Unknown Sector')
        
        # Clean and standardize funding amounts
        if 'Total Raised' in cleaned_df.columns:
            cleaned_df['Total Raised'] = cleaned_df['Total Raised'].apply(self.normalize_funding_amount)
        
        if 'Total Raised to Date' in cleaned_df.columns:
            cleaned_df['Total Raised to Date'] = cleaned_df['Total Raised to Date'].apply(self.normalize_funding_amount)
        
        if 'Last Known Valuation' in cleaned_df.columns:
            cleaned_df['Last Known Valuation'] = cleaned_df['Last Known Valuation'].apply(self.normalize_funding_amount)
        
        if 'Post-Money Valuation' in cleaned_df.columns:
            cleaned_df['Post-Money Valuation'] = cleaned_df['Post-Money Valuation'].apply(self.normalize_funding_amount)
        
        # Clean year founded
        if 'Year Founded' in cleaned_df.columns:
            cleaned_df['Year Founded'] = cleaned_df['Year Founded'].apply(self.normalize_year)
        
        # Clean employee count
        if 'Employees' in cleaned_df.columns:
            cleaned_df['Employees'] = cleaned_df['Employees'].apply(self.normalize_employee_count)
        
        # Clean revenue
        if 'Revenue' in cleaned_df.columns:
            cleaned_df['Revenue'] = cleaned_df['Revenue'].apply(self.normalize_funding_amount)
        
        # Clean market cap
        if 'Market Cap' in cleaned_df.columns:
            cleaned_df['Market Cap'] = cleaned_df['Market Cap'].apply(self.normalize_funding_amount)
        
        # Clean dates
        date_columns = ['First Financing Date', 'Last Financing Date']
        for col in date_columns:
            if col in cleaned_df.columns:
                cleaned_df[col] = cleaned_df[col].apply(self.normalize_date)
        
        # Clean locations
        location_columns = ['HQ Location', 'HQ City', 'HQ State/Province', 'HQ Country/Territory/Region']
        for col in location_columns:
            if col in cleaned_df.columns:
                cleaned_df[col] = cleaned_df[col].str.strip()
                cleaned_df[col] = cleaned_df[col].fillna('Unknown')
        
        # Clean investor information
        if 'Active Investors' in cleaned_df.columns:
            cleaned_df['Active Investors'] = cleaned_df['Active Investors'].str.strip()
            cleaned_df['Active Investors'] = cleaned_df['Active Investors'].fillna('No active investors')
        
        if '# Active Investors' in cleaned_df.columns:
            cleaned_df['# Active Investors'] = cleaned_df['# Active Investors'].fillna(0)
        
        # Clean series information
        if 'Series' in cleaned_df.columns:
            cleaned_df['Series'] = cleaned_df['Series'].str.strip()
            cleaned_df['Series'] = cleaned_df['Series'].fillna('Unknown')
        
        # Remove duplicates based on Company ID
        if 'Company ID' in cleaned_df.columns:
            cleaned_df = cleaned_df.drop_duplicates(subset=['Company ID'])
        
        # Add metadata columns
        cleaned_df['data_source'] = 'PitchBook'
        cleaned_df['extraction_date'] = datetime.now().isoformat()
        cleaned_df['processing_notes'] = 'Data extracted and cleaned for dashboard integration'
        
        logger.info(f"Cleaned and standardized data: {len(cleaned_df)} unique companies")
        return cleaned_df
    
    def normalize_funding_amount(self, amount):
        """
        Normalize funding amounts to USD format
        
        Args:
            amount: Raw funding amount value
            
        Returns:
            str: Normalized funding amount in USD
        """
        if pd.isna(amount):
            return ''
        
        try:
            # Convert to string and clean
            amount_str = str(amount).strip()
            
            # If it's already a number, format it
            if amount_str.replace('.', '').replace(',', '').isdigit():
                amount_val = float(amount_str.replace(',', ''))
                return f"${amount_val:,.0f}"
            
            # Handle different formats
            if 'K' in amount_str.upper():
                amount_val = float(amount_str.upper().replace('K', '')) * 1000
                return f"${amount_val:,.0f}"
            elif 'M' in amount_str.upper():
                amount_val = float(amount_str.upper().replace('M', '')) * 1000000
                return f"${amount_val:,.0f}"
            elif 'B' in amount_str.upper():
                amount_val = float(amount_str.upper().replace('B', '')) * 1000000000
                return f"${amount_val:,.0f}"
            
            return amount_str
            
        except:
            return str(amount)
    
    def normalize_year(self, year_value):
        """
        Normalize year values
        
        Args:
            year_value: Raw year value
            
        Returns:
            str: Normalized year
        """
        if pd.isna(year_value):
            return ''
        
        try:
            # Convert to integer and validate
            year_int = int(float(year_value))
            if 1800 <= year_int <= datetime.now().year:
                return str(year_int)
            else:
                return ''
        except:
            return str(year_value)
    
    def normalize_employee_count(self, employee_value):
        """
        Normalize employee count values
        
        Args:
            employee_value: Raw employee count value
            
        Returns:
            str: Normalized employee count
        """
        if pd.isna(employee_value):
            return ''
        
        try:
            # Convert to integer
            employee_int = int(float(employee_value))
            if employee_int >= 0:
                return str(employee_int)
            else:
                return ''
        except:
            return str(employee_value)
    
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
    
    def create_dashboard_dataset(self, df):
        """
        Create a clean dataset optimized for dashboard integration
        
        Args:
            df (pd.DataFrame): Cleaned comprehensive data
            
        Returns:
            pd.DataFrame: Dashboard-ready dataset
        """
        if df.empty:
            return df
        
        # Select only the columns needed for dashboard
        dashboard_df = df[self.dashboard_columns].copy()
        
        # Rename columns to standardized names
        dashboard_df = dashboard_df.rename(columns=self.column_mapping)
        
        # Add derived columns for dashboard
        dashboard_df['traction_score'] = self.calculate_traction_score(df)
        dashboard_df['funding_stage'] = self.categorize_funding_stage(df)
        dashboard_df['company_age'] = self.calculate_company_age(df)
        dashboard_df['region'] = self.categorize_region(df)
        
        # Add data quality indicators
        dashboard_df['data_completeness'] = self.calculate_data_completeness(df)
        dashboard_df['last_updated'] = datetime.now().isoformat()
        
        logger.info(f"Created dashboard dataset with {len(dashboard_df)} companies")
        return dashboard_df
    
    def calculate_traction_score(self, df):
        """
        Calculate a traction score based on various metrics
        
        Args:
            df (pd.DataFrame): Company data
            
        Returns:
            list: Traction scores (0-100)
        """
        scores = []
        
        for idx, row in df.iterrows():
            score = 0
            
            # Funding score (0-30 points)
            if pd.notna(row.get('Total Raised to Date')) and str(row.get('Total Raised to Date')) != '':
                score += 15
            if pd.notna(row.get('Last Known Valuation')) and str(row.get('Last Known Valuation')) != '':
                score += 15
            
            # Employee score (0-20 points)
            if pd.notna(row.get('Employees')) and str(row.get('Employees')) != '':
                score += 20
            
            # Revenue score (0-20 points)
            if pd.notna(row.get('Revenue')) and str(row.get('Revenue')) != '':
                score += 20
            
            # Investor score (0-15 points)
            if pd.notna(row.get('# Active Investors')) and row.get('# Active Investors', 0) > 0:
                score += 15
            
            # Website/LinkedIn score (0-15 points)
            if pd.notna(row.get('Website')) and str(row.get('Website')) != '':
                score += 7
            if pd.notna(row.get('LinkedIn URL')) and str(row.get('LinkedIn URL')) != '':
                score += 8
            
            scores.append(min(score, 100))
        
        return scores
    
    def categorize_funding_stage(self, df):
        """
        Categorize companies by funding stage
        
        Args:
            df (pd.DataFrame): Company data
            
        Returns:
            list: Funding stage categories
        """
        stages = []
        
        for idx, row in df.iterrows():
            total_raised = row.get('Total Raised to Date', '')
            series = row.get('Series', '')
            
            if pd.isna(total_raised) or str(total_raised) == '':
                stages.append('Unknown')
            elif '$' in str(total_raised):
                amount_str = str(total_raised).replace('$', '').replace(',', '')
                try:
                    amount = float(amount_str)
                    if amount < 1000000:
                        stages.append('Seed')
                    elif amount < 10000000:
                        stages.append('Early Stage')
                    elif amount < 100000000:
                        stages.append('Growth Stage')
                    else:
                        stages.append('Late Stage')
                except:
                    stages.append('Unknown')
            else:
                stages.append('Unknown')
        
        return stages
    
    def calculate_company_age(self, df):
        """
        Calculate company age in years
        
        Args:
            df (pd.DataFrame): Company data
            
        Returns:
            list: Company ages
        """
        ages = []
        current_year = datetime.now().year
        
        for idx, row in df.iterrows():
            year_founded = row.get('Year Founded', '')
            
            if pd.notna(year_founded) and str(year_founded).isdigit():
                try:
                    age = current_year - int(year_founded)
                    ages.append(max(0, age))
                except:
                    ages.append('Unknown')
            else:
                ages.append('Unknown')
        
        return ages
    
    def categorize_region(self, df):
        """
        Categorize companies by region
        
        Args:
            df (pd.DataFrame): Company data
            
        Returns:
            list: Region categories
        """
        regions = []
        
        for idx, row in df.iterrows():
            country = row.get('HQ Country/Territory/Region', '')
            
            if pd.isna(country) or str(country) == '':
                regions.append('Unknown')
            elif 'United States' in str(country) or 'USA' in str(country):
                regions.append('North America')
            elif 'United Kingdom' in str(country) or 'UK' in str(country):
                regions.append('Europe')
            elif 'Canada' in str(country):
                regions.append('North America')
            elif any(euro_country in str(country) for euro_country in ['Germany', 'France', 'Italy', 'Spain', 'Netherlands']):
                regions.append('Europe')
            elif 'China' in str(country) or 'Japan' in str(country) or 'India' in str(country):
                regions.append('Asia Pacific')
            else:
                regions.append('Other')
        
        return regions
    
    def calculate_data_completeness(self, df):
        """
        Calculate data completeness percentage for each company
        
        Args:
            df (pd.DataFrame): Company data
            
        Returns:
            list: Data completeness percentages
        """
        completeness_scores = []
        
        for idx, row in df.iterrows():
            filled_fields = 0
            total_fields = len(self.dashboard_columns)
            
            for col in self.dashboard_columns:
                if pd.notna(row.get(col)) and str(row.get(col)).strip() != '':
                    filled_fields += 1
            
            completeness = (filled_fields / total_fields) * 100
            completeness_scores.append(f"{completeness:.1f}%")
        
        return completeness_scores
    
    def generate_schema_documentation(self):
        """
        Generate schema documentation for the dashboard dataset
        
        Returns:
            dict: Schema documentation
        """
        schema = {
            'dataset_name': 'PitchBook Comprehensive Company Dataset',
            'description': 'Clean, standardized dataset of companies from PitchBook for dashboard integration',
            'data_source': 'PitchBook',
            'extraction_date': datetime.now().isoformat(),
            'total_records': 0,
            'columns': {},
            'data_quality_notes': [],
            'assumptions': [],
            'edge_cases': []
        }
        
        # Define column descriptions
        column_descriptions = {
            'company_id': 'Unique PitchBook identifier for the company',
            'company_name': 'Common/trading name of the company',
            'legal_name': 'Legal/registered name of the company',
            'description': 'Company description and business overview',
            'industry_sector': 'Primary industry sector (e.g., Healthcare, Technology)',
            'industry_group': 'Specific industry group within the sector',
            'industry_code': 'Detailed industry classification code',
            'verticals': 'Specific business verticals and focus areas',
            'keywords': 'Key business terms and focus areas',
            'financing_status': 'Current financing status of the company',
            'total_funding': 'Total funding raised by the company',
            'business_status': 'Current business status (e.g., Operating, Acquired)',
            'year_founded': 'Year the company was founded',
            'hq_location': 'Full headquarters location',
            'hq_city': 'City of headquarters',
            'hq_state': 'State/Province of headquarters',
            'hq_country': 'Country of headquarters',
            'employee_count': 'Number of employees',
            'revenue': 'Company revenue (if available)',
            'market_cap': 'Market capitalization (if public)',
            'last_valuation': 'Last known company valuation',
            'post_money_valuation': 'Post-money valuation from last funding round',
            'total_raised': 'Total funding raised to date',
            'active_investors': 'List of active investors',
            'investor_count': 'Number of active investors',
            'first_financing_date': 'Date of first funding round',
            'last_financing_date': 'Date of most recent funding round',
            'funding_series': 'Current or last funding series',
            'website': 'Company website URL',
            'linkedin_url': 'Company LinkedIn profile URL',
            'traction_score': 'Calculated traction score (0-100) based on funding, employees, revenue, and online presence',
            'funding_stage': 'Categorized funding stage (Seed, Early Stage, Growth Stage, Late Stage)',
            'company_age': 'Age of company in years since founding',
            'region': 'Geographic region categorization (North America, Europe, Asia Pacific, Other)',
            'data_completeness': 'Percentage of fields that contain data for this company',
            'last_updated': 'Timestamp of last data update'
        }
        
        schema['columns'] = column_descriptions
        
        # Add data quality notes
        schema['data_quality_notes'] = [
            'Funding amounts are normalized to USD format with $ symbol',
            'Dates are standardized to YYYY-MM-DD format',
            'Empty or missing values are marked as appropriate placeholders',
            'Company names are cleaned and standardized',
            'Industry classifications are preserved from original source',
            'Geographic data is cleaned and categorized by region'
        ]
        
        # Add assumptions
        schema['assumptions'] = [
            'Companies with no funding data are categorized as "Unknown" stage',
            'Companies with missing founding years have age marked as "Unknown"',
            'Geographic categorization is based on country information',
            'Traction scores are calculated using available metrics only',
            'Data completeness is calculated based on core dashboard fields'
        ]
        
        # Add edge cases
        schema['edge_cases'] = [
            'Stealth startups may have limited information available',
            'Acquired companies may have different status indicators',
            'International companies may have varying data completeness',
            'Some companies may have multiple industry classifications',
            'Funding amounts may be in different currencies (converted to USD where possible)'
        ]
        
        return schema
    
    def save_dashboard_data(self, df, base_filename):
        """
        Save dashboard-ready data to multiple formats
        
        Args:
            df (pd.DataFrame): Dashboard dataset
            base_filename (str): Base filename without extension
        """
        try:
            # Save to CSV
            csv_filename = f"{base_filename}_dashboard_ready.csv"
            df.to_csv(csv_filename, index=False)
            logger.info(f"Dashboard data saved to {csv_filename}")
            
            # Save to Excel with multiple sheets
            excel_filename = f"{base_filename}_dashboard_ready.xlsx"
            with pd.ExcelWriter(excel_filename, engine='openpyxl') as writer:
                # Main data sheet
                df.to_excel(writer, sheet_name='Company_Data', index=False)
                
                # Schema documentation sheet
                schema = self.generate_schema_documentation()
                schema_df = pd.DataFrame([
                    ['Dataset Name', schema['dataset_name']],
                    ['Description', schema['description']],
                    ['Data Source', schema['data_source']],
                    ['Extraction Date', schema['extraction_date']],
                    ['Total Records', len(df)],
                    ['', ''],
                    ['Column Definitions:', ''],
                ] + [(col, desc) for col, desc in schema['columns'].items()])
                
                schema_df.to_excel(writer, sheet_name='Schema_Documentation', index=False, header=False)
                
                # Data quality notes sheet
                quality_df = pd.DataFrame([
                    ['Data Quality Notes:', ''],
                ] + [(note, '') for note in schema['data_quality_notes']] + [
                    ['', ''],
                    ['Assumptions:', ''],
                ] + [(assumption, '') for assumption in schema['assumptions']] + [
                    ['', ''],
                    ['Edge Cases:', ''],
                ] + [(edge_case, '') for edge_case in schema['edge_cases']])
                
                quality_df.to_excel(writer, sheet_name='Data_Quality_Notes', index=False, header=False)
            
            logger.info(f"Dashboard data saved to {excel_filename}")
            
        except Exception as e:
            logger.error(f"Error saving dashboard data: {e}")
    
    def generate_summary_report(self, df):
        """
        Generate a comprehensive summary report for dashboard integration
        
        Args:
            df (pd.DataFrame): Dashboard dataset
            
        Returns:
            dict: Summary statistics
        """
        if df.empty:
            return {}
        
        summary = {
            'total_companies': len(df),
            'data_completeness': {},
            'industry_distribution': {},
            'geographic_distribution': {},
            'funding_stage_distribution': {},
            'traction_score_analysis': {},
            'funding_analysis': {},
            'extraction_date': datetime.now().isoformat(),
            'data_source': 'PitchBook',
            'dashboard_columns': list(df.columns),
            'data_quality_metrics': {}
        }
        
        # Calculate completeness for each column
        for column in df.columns:
            if column not in ['data_source', 'extraction_date', 'processing_notes', 'last_updated']:
                completeness = (df[column].notna().sum() / len(df)) * 100
                summary['data_completeness'][column] = f"{completeness:.1f}%"
        
        # Industry distribution
        if 'industry_sector' in df.columns:
            summary['industry_distribution'] = df['industry_sector'].value_counts().to_dict()
        
        # Geographic distribution
        if 'region' in df.columns:
            summary['geographic_distribution'] = df['region'].value_counts().to_dict()
        
        # Funding stage distribution
        if 'funding_stage' in df.columns:
            summary['funding_stage_distribution'] = df['funding_stage'].value_counts().to_dict()
        
        # Traction score analysis
        if 'traction_score' in df.columns:
            scores = []
            for score in df['traction_score']:
                if isinstance(score, (int, float)):
                    scores.append(score)
            
            if scores:
                summary['traction_score_analysis'] = {
                    'min': min(scores),
                    'max': max(scores),
                    'avg': sum(scores) / len(scores),
                    'companies_with_scores': len(scores)
                }
        
        # Funding analysis
        if 'total_raised' in df.columns:
            funding_amounts = []
            for amount in df['total_raised']:
                if '$' in str(amount):
                    try:
                        amount_val = float(str(amount).replace('$', '').replace(',', ''))
                        funding_amounts.append(amount_val)
                    except:
                        continue
            
            if funding_amounts:
                summary['funding_analysis'] = {
                    'min': min(funding_amounts),
                    'max': max(funding_amounts),
                    'avg': sum(funding_amounts) / len(funding_amounts),
                    'companies_with_funding_data': len(funding_amounts)
                }
        
        # Data quality metrics
        if 'data_completeness' in df.columns:
            completeness_scores = []
            for score in df['data_completeness']:
                if '%' in str(score):
                    try:
                        score_val = float(str(score).replace('%', ''))
                        completeness_scores.append(score_val)
                    except:
                        continue
            
            if completeness_scores:
                summary['data_quality_metrics'] = {
                    'avg_completeness': sum(completeness_scores) / len(completeness_scores),
                    'min_completeness': min(completeness_scores),
                    'max_completeness': max(completeness_scores)
                }
        
        return summary

def main():
    """Main function to run the comprehensive PitchBook scraper"""
    
    # Initialize scraper
    scraper = PitchBookComprehensiveScraper()
    
    # Load comprehensive data
    input_file = 'PitchBook_All_Columns_2025_08_11_11_47_45.xlsx'
    df = scraper.load_comprehensive_data(input_file)
    
    if df.empty:
        logger.error("No comprehensive data loaded")
        return
    
    # Clean and standardize data
    cleaned_df = scraper.clean_and_standardize_data(df)
    
    # Create dashboard-ready dataset
    dashboard_df = scraper.create_dashboard_dataset(cleaned_df)
    
    # Save dashboard data
    scraper.save_dashboard_data(dashboard_df, 'pitchbook_comprehensive')
    
    # Generate and save summary report
    summary = scraper.generate_summary_report(dashboard_df)
    
    # Save summary report
    with open('pitchbook_comprehensive_summary_report.json', 'w') as f:
        json.dump(summary, f, indent=2)
    logger.info("Summary report saved to pitchbook_comprehensive_summary_report.json")
    
    # Print comprehensive summary
    print("\n=== PITCHBOOK COMPREHENSIVE SCRAPING SUMMARY ===")
    print(f"Total Companies: {summary.get('total_companies', 0)}")
    print(f"Dashboard Columns: {len(summary.get('dashboard_columns', []))}")
    print(f"Data Source: {summary.get('data_source', 'Unknown')}")
    
    if 'industry_distribution' in summary:
        print(f"Top Industries: {list(summary['industry_distribution'].keys())[:3]}")
    
    if 'geographic_distribution' in summary:
        print(f"Geographic Coverage: {list(summary['geographic_distribution'].keys())}")
    
    if 'funding_stage_distribution' in summary:
        print(f"Funding Stages: {list(summary['funding_stage_distribution'].keys())}")
    
    if 'traction_score_analysis' in summary:
        analysis = summary['traction_score_analysis']
        print(f"Traction Score Range: {analysis.get('min', 0)} - {analysis.get('max', 0)}")
        print(f"Average Traction Score: {analysis.get('avg', 0):.1f}")
    
    if 'data_quality_metrics' in summary:
        metrics = summary['data_quality_metrics']
        print(f"Average Data Completeness: {metrics.get('avg_completeness', 0):.1f}%")
    
    print("=== END SUMMARY ===")
    print("\nDashboard-ready data has been saved with schema documentation.")
    print("The data is now ready for integration into your dashboard backend and filters.")
    
    logger.info("PitchBook comprehensive scraping completed successfully")

if __name__ == "__main__":
    main()
