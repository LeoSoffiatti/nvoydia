#!/usr/bin/env python3

import re

# Read the full data service file
with open('data-service-full.js', 'r') as f:
    content = f.read()

# Define sector mappings based on industry
sector_mappings = {
    'frontier-model-builders': 'Software',
    'ai-infrastructure': 'Software', 
    'ai-applications': 'Software',
    'automotive': 'Auto',
    'fintech': 'FinTech',
    'healthcare': 'HCLS',
    'media': 'Media',
    'networking': 'Networking',
    'robotics': 'Robotics',
    'energy': 'Energy/Climate',
    'climate': 'Energy/Climate',
    'clean-tech': 'Energy/Climate',
    'biotech': 'HCLS',
    'pharma': 'HCLS'
}

# Add sector field to each company
def add_sector_to_company(match):
    company_block = match.group(0)
    industry_match = re.search(r'industry:\s*["\']([^"\']+)["\']', company_block)
    
    if industry_match:
        industry = industry_match.group(1)
        # Map industry to sector
        sector = 'Software'  # default
        for key, value in sector_mappings.items():
            if key in industry.lower():
                sector = value
                break
        
        # Add sector field after industry field
        sector_field = f',\n                sector: "{sector}"'
        company_block = re.sub(r'(industry:\s*["\'][^"\']+["\'])', r'\1' + sector_field, company_block)
    
    return company_block

# Find all company blocks and add sector field
pattern = r'{\s*id:\s*\d+,[^}]+}'
companies = re.findall(pattern, content, re.DOTALL)

for company in companies:
    updated_company = add_sector_to_company(re.match(r'({.*})', company, re.DOTALL))
    content = content.replace(company, updated_company)

# Write the updated content
with open('data-service-full.js', 'w') as f:
    f.write(content)

print("Added sector fields to all companies")
