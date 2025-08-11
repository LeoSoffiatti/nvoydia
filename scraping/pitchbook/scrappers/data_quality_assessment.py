#!/usr/bin/env python3
"""
Data Quality Assessment for PitchBook Scraping Results

This script analyzes the quality of scraped data and generates
comprehensive reports on data completeness, accuracy, and limitations.
"""

import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import numpy as np
from typing import Dict, List, Any

class DataQualityAssessment:
    def __init__(self, data_file: str):
        """
        Initialize data quality assessment
        
        Args:
            data_file (str): Path to the data file (CSV or Excel)
        """
        self.data_file = data_file
        self.df = None
        self.load_data()
        
    def load_data(self):
        """Load data from file"""
        try:
            if self.data_file.endswith('.csv'):
                self.df = pd.read_csv(self.data_file)
            elif self.data_file.endswith('.xlsx'):
                self.df = pd.read_excel(self.data_file)
            else:
                raise ValueError("Unsupported file format")
                
            print(f"Loaded {len(self.df)} records from {self.data_file}")
            
        except Exception as e:
            print(f"Error loading data: {e}")
            self.df = pd.DataFrame()
    
    def assess_completeness(self) -> Dict[str, float]:
        """
        Assess data completeness for each field
        
        Returns:
            Dict[str, float]: Completeness percentage for each field
        """
        if self.df.empty:
            return {}
        
        completeness = {}
        total_records = len(self.df)
        
        for column in self.df.columns:
            if column in ['notes', 'extraction_date', 'data_source']:
                continue
                
            non_null_count = self.df[column].notna().sum()
            completeness[column] = (non_null_count / total_records) * 100
        
        return completeness
    
    def assess_duplicates(self) -> Dict[str, Any]:
        """
        Assess duplicate records
        
        Returns:
            Dict[str, Any]: Duplicate analysis results
        """
        if self.df.empty:
            return {}
        
        # Check for exact duplicates
        exact_duplicates = self.df.duplicated().sum()
        
        # Check for duplicates based on startup name
        name_duplicates = self.df['startup_name'].duplicated().sum() if 'startup_name' in self.df.columns else 0
        
        # Check for similar names (fuzzy matching)
        similar_names = self._find_similar_names()
        
        return {
            'exact_duplicates': exact_duplicates,
            'name_duplicates': name_duplicates,
            'similar_names': similar_names,
            'total_records': len(self.df)
        }
    
    def _find_similar_names(self) -> List[Dict[str, str]]:
        """Find startups with similar names"""
        if 'startup_name' not in self.df.columns:
            return []
        
        similar_names = []
        names = self.df['startup_name'].dropna().tolist()
        
        for i, name1 in enumerate(names):
            for j, name2 in enumerate(names[i+1:], i+1):
                similarity = self._calculate_similarity(name1, name2)
                if similarity > 0.8:  # 80% similarity threshold
                    similar_names.append({
                        'name1': name1,
                        'name2': name2,
                        'similarity': similarity
                    })
        
        return similar_names
    
    def _calculate_similarity(self, name1: str, name2: str) -> float:
        """Calculate similarity between two startup names"""
        from difflib import SequenceMatcher
        return SequenceMatcher(None, name1.lower(), name2.lower()).ratio()
    
    def assess_funding_data(self) -> Dict[str, Any]:
        """
        Assess funding data quality
        
        Returns:
            Dict[str, Any]: Funding data analysis
        """
        if self.df.empty or 'total_funding' not in self.df.columns:
            return {}
        
        funding_data = self.df['total_funding'].dropna()
        
        if funding_data.empty:
            return {'error': 'No funding data available'}
        
        # Convert funding to numeric values
        numeric_funding = []
        for funding in funding_data:
            try:
                # Remove $ and commas, convert to float
                clean_funding = str(funding).replace('$', '').replace(',', '')
                numeric_funding.append(float(clean_funding))
            except:
                continue
        
        if not numeric_funding:
            return {'error': 'No valid funding data found'}
        
        return {
            'total_funding_records': len(funding_data),
            'valid_funding_records': len(numeric_funding),
            'min_funding': min(numeric_funding),
            'max_funding': max(numeric_funding),
            'avg_funding': sum(numeric_funding) / len(numeric_funding),
            'median_funding': sorted(numeric_funding)[len(numeric_funding)//2]
        }
    
    def assess_category_distribution(self) -> Dict[str, int]:
        """
        Assess category distribution
        
        Returns:
            Dict[str, int]: Category frequency counts
        """
        if self.df.empty or 'category' not in self.df.columns:
            return {}
        
        return self.df['category'].value_counts().to_dict()
    
    def assess_geographic_distribution(self) -> Dict[str, int]:
        """
        Assess geographic distribution
        
        Returns:
            Dict[str, int]: Region frequency counts
        """
        if self.df.empty or 'region' not in self.df.columns:
            return {}
        
        return self.df['region'].value_counts().to_dict()
    
    def assess_temporal_data(self) -> Dict[str, Any]:
        """
        Assess temporal data quality (founding years, funding years)
        
        Returns:
            Dict[str, Any]: Temporal data analysis
        """
        temporal_analysis = {}
        
        # Analyze founding years
        if 'year_founded' in self.df.columns:
            founding_years = pd.to_datetime(self.df['year_founded'], errors='coerce')
            valid_founding = founding_years.dropna()
            
            if not valid_founding.empty:
                temporal_analysis['founding_years'] = {
                    'total_records': len(founding_years),
                    'valid_records': len(valid_founding),
                    'earliest_year': valid_founding.dt.year.min(),
                    'latest_year': valid_founding.dt.year.max(),
                    'most_common_year': valid_founding.dt.year.mode().iloc[0] if not valid_founding.dt.year.mode().empty else None
                }
        
        # Analyze funding years
        if 'last_funding_year' in self.df.columns:
            funding_years = pd.to_datetime(self.df['last_funding_year'], errors='coerce')
            valid_funding = funding_years.dropna()
            
            if not valid_funding.empty:
                temporal_analysis['funding_years'] = {
                    'total_records': len(funding_years),
                    'valid_records': len(valid_funding),
                    'earliest_year': valid_funding.dt.year.min(),
                    'latest_year': valid_funding.dt.year.max(),
                    'most_common_year': valid_funding.dt.year.mode().iloc[0] if not valid_funding.dt.year.mode().empty else None
                }
        
        return temporal_analysis
    
    def generate_quality_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive data quality report
        
        Returns:
            Dict[str, Any]: Complete quality assessment report
        """
        report = {
            'assessment_date': datetime.now().isoformat(),
            'data_source': 'PitchBook',
            'file_path': self.data_file,
            'total_records': len(self.df) if not self.df.empty else 0,
            'completeness': self.assess_completeness(),
            'duplicates': self.assess_duplicates(),
            'funding_analysis': self.assess_funding_data(),
            'category_distribution': self.assess_category_distribution(),
            'geographic_distribution': self.assess_geographic_distribution(),
            'temporal_analysis': self.assess_temporal_data(),
            'data_quality_score': self._calculate_quality_score()
        }
        
        return report
    
    def _calculate_quality_score(self) -> float:
        """Calculate overall data quality score (0-100)"""
        if self.df.empty:
            return 0.0
        
        scores = []
        
        # Completeness score
        completeness = self.assess_completeness()
        if completeness:
            avg_completeness = sum(completeness.values()) / len(completeness)
            scores.append(avg_completeness)
        
        # Duplicate penalty
        duplicates = self.assess_duplicates()
        if duplicates and duplicates['total_records'] > 0:
            duplicate_rate = (duplicates['exact_duplicates'] + duplicates['name_duplicates']) / duplicates['total_records']
            duplicate_penalty = duplicate_rate * 20  # Penalty up to 20 points
            scores.append(max(0, 100 - duplicate_penalty))
        
        # Funding data quality
        funding_analysis = self.assess_funding_data()
        if funding_analysis and 'valid_funding_records' in funding_analysis:
            funding_quality = (funding_analysis['valid_funding_records'] / funding_analysis['total_funding_records']) * 100
            scores.append(funding_quality)
        
        return sum(scores) / len(scores) if scores else 0.0
    
    def save_report(self, report: Dict[str, Any], output_file: str):
        """
        Save quality report to file
        
        Args:
            report (Dict[str, Any]): Quality assessment report
            output_file (str): Output file path
        """
        try:
            with open(output_file, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"Quality report saved to {output_file}")
        except Exception as e:
            print(f"Error saving report: {e}")
    
    def generate_visualizations(self, output_dir: str = '.'):
        """
        Generate data quality visualizations
        
        Args:
            output_dir (str): Directory to save visualizations
        """
        if self.df.empty:
            print("No data available for visualization")
            return
        
        # Set up plotting style
        plt.style.use('seaborn-v0_8')
        
        # 1. Completeness heatmap
        completeness = self.assess_completeness()
        if completeness:
            plt.figure(figsize=(10, 6))
            fields = list(completeness.keys())
            values = list(completeness.values())
            
            colors = ['red' if v < 50 else 'orange' if v < 80 else 'green' for v in values]
            bars = plt.bar(fields, values, color=colors)
            plt.title('Data Completeness by Field')
            plt.ylabel('Completeness (%)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(f'{output_dir}/completeness_heatmap.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        # 2. Category distribution
        category_dist = self.assess_category_distribution()
        if category_dist:
            plt.figure(figsize=(12, 6))
            categories = list(category_dist.keys())
            counts = list(category_dist.values())
            
            plt.pie(counts, labels=categories, autopct='%1.1f%%')
            plt.title('Startup Category Distribution')
            plt.axis('equal')
            plt.savefig(f'{output_dir}/category_distribution.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        # 3. Geographic distribution
        geo_dist = self.assess_geographic_distribution()
        if geo_dist:
            plt.figure(figsize=(10, 6))
            regions = list(geo_dist.keys())
            counts = list(geo_dist.values())
            
            plt.bar(regions, counts)
            plt.title('Geographic Distribution')
            plt.ylabel('Number of Startups')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(f'{output_dir}/geographic_distribution.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        print(f"Visualizations saved to {output_dir}")

def main():
    """Main function to run data quality assessment"""
    
    # Test with the existing PitchBook data
    data_file = 'pitchbook_startups_cleaned.csv'
    
    try:
        # Initialize assessment
        assessment = DataQualityAssessment(data_file)
        
        # Generate comprehensive report
        report = assessment.generate_quality_report()
        
        # Save report
        assessment.save_report(report, 'data_quality_report.json')
        
        # Generate visualizations
        assessment.generate_visualizations('.')
        
        # Print summary
        print("\n=== DATA QUALITY ASSESSMENT SUMMARY ===")
        print(f"Total Records: {report['total_records']}")
        print(f"Overall Quality Score: {report['data_quality_score']:.1f}/100")
        
        if report['completeness']:
            avg_completeness = sum(report['completeness'].values()) / len(report['completeness'])
            print(f"Average Completeness: {avg_completeness:.1f}%")
        
        if report['duplicates']:
            duplicate_rate = (report['duplicates']['exact_duplicates'] + report['duplicates']['name_duplicates']) / report['duplicates']['total_records']
            print(f"Duplicate Rate: {duplicate_rate:.1%}")
        
        print("=== END SUMMARY ===")
        
    except Exception as e:
        print(f"Error in data quality assessment: {e}")

if __name__ == "__main__":
    main()
