#!/usr/bin/env python3

import re
import json

def create_clean_companies_list():
    # Read the backup file
    with open('data-service-backup.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the companies array using a more robust method
    # Find the start of the companies array in loadSampleData
    start_pattern = r'loadSampleData\(\) \{\s*// Load comprehensive AI and tech companies data organized by categories\s*this\.companies = \['
    start_match = re.search(start_pattern, content, re.DOTALL)
    
    if not start_match:
        print("Could not find loadSampleData function")
        return False
    
    start_pos = start_match.end()
    
    # Find the end of the companies array
    brace_count = 0
    pos = start_pos
    while pos < len(content):
        if content[pos] == '[':
            brace_count += 1
        elif content[pos] == ']':
            brace_count -= 1
            if brace_count == 0:
                end_pos = pos
                break
        pos += 1
    
    # Extract the array content
    array_content = content[start_pos:end_pos]
    
    # Parse individual company objects
    companies = []
    current_obj = ""
    brace_count = 0
    in_object = False
    
    for char in array_content:
        if char == '{' and not in_object:
            in_object = True
            current_obj = char
            brace_count = 1
        elif in_object:
            current_obj += char
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    companies.append(current_obj)
                    current_obj = ""
                    in_object = False
    
    print(f"Found {len(companies)} company objects")
    
    # Extract unique companies by name
    unique_companies = []
    seen_names = set()
    
    for company_str in companies:
        name_match = re.search(r'"name":\s*"([^"]*)"', company_str)
        if name_match:
            name = name_match.group(1)
            if name not in seen_names:
                seen_names.add(name)
                unique_companies.append(company_str)
            else:
                print(f"Skipping duplicate: {name}")
    
    print(f"Original companies: {len(companies)}")
    print(f"Unique companies: {len(unique_companies)}")
    print(f"Duplicates removed: {len(companies) - len(unique_companies)}")
    
    # Create new content with unique companies
    new_array_content = '\n' + ',\n'.join(unique_companies) + '\n'
    new_content = content[:start_pos] + new_array_content + content[end_pos:]
    
    # Write the clean file
    with open('data-service.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Created clean data-service.js with unique companies")
    return True

if __name__ == "__main__":
    create_clean_companies_list()
