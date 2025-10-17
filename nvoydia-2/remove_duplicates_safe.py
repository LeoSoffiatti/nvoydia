#!/usr/bin/env python3

import re
import json

def remove_duplicate_companies_safely():
    # Read the file
    with open('data-service.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the loadSampleData function and extract the companies array
    start_marker = 'loadSampleData() {\n        // Load comprehensive AI and tech companies data organized by categories\n        this.companies = ['
    end_marker = '];\n    }'
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Could not find loadSampleData function")
        return False
    
    # Find the end of the companies array
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        print("Could not find end of companies array")
        return False
    
    # Extract the array content
    array_start = start_idx + len(start_marker)
    array_content = content[array_start:end_idx]
    
    # Parse companies by finding complete objects
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
                    # Complete object found
                    companies.append(current_obj)
                    current_obj = ""
                    in_object = False
    
    print(f"Found {len(companies)} company objects")
    
    # Extract names and remove duplicates
    unique_companies = []
    seen_names = set()
    
    for company_str in companies:
        # Extract name using regex
        name_match = re.search(r'"name":\s*"([^"]*)"', company_str)
        if name_match:
            name = name_match.group(1)
            if name not in seen_names:
                seen_names.add(name)
                unique_companies.append(company_str)
            else:
                print(f"Removing duplicate: {name}")
    
    print(f"Original companies: {len(companies)}")
    print(f"Unique companies: {len(unique_companies)}")
    print(f"Duplicates removed: {len(companies) - len(unique_companies)}")
    
    # Reconstruct the array content
    new_array_content = '\n' + ',\n'.join(unique_companies) + '\n'
    
    # Replace in original content
    new_content = content[:array_start] + new_array_content + content[end_idx:]
    
    # Write back to file
    with open('data-service.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Duplicate companies removed successfully!")
    return True

if __name__ == "__main__":
    if remove_duplicate_companies_safely():
        print("Updated data-service.js with unique companies only")
    else:
        print("Failed to remove duplicates")
