#!/usr/bin/env python3

import re
import json

def remove_duplicate_companies():
    # Read the data-service.js file
    with open('data-service.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the companies array section
    start_marker = 'this.companies = ['
    end_marker = '];'
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Could not find companies array start marker")
        return
    
    # Find the matching closing bracket
    bracket_count = 0
    end_idx = start_idx + len(start_marker)
    for i, char in enumerate(content[start_idx + len(start_marker):], start_idx + len(start_marker)):
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == -1:
                end_idx = i + 1
                break
    
    # Extract the array content
    array_content = content[start_idx:end_idx]
    
    # Parse the JavaScript array (simplified approach)
    # We'll extract individual company objects
    companies = []
    current_company = ""
    brace_count = 0
    in_company = False
    
    for char in array_content:
        if char == '{' and not in_company:
            in_company = True
            current_company = char
            brace_count = 1
        elif in_company:
            current_company += char
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    # End of company object
                    companies.append(current_company)
                    current_company = ""
                    in_company = False
    
    print(f"Found {len(companies)} company objects")
    
    # Extract company names and remove duplicates
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
    
    # Reconstruct the array
    new_array_content = start_marker + '\n' + ',\n'.join(unique_companies) + '\n' + end_marker
    
    # Replace in original content
    new_content = content[:start_idx] + new_array_content + content[end_idx:]
    
    # Write back to file
    with open('data-service.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Duplicate companies removed successfully!")

if __name__ == "__main__":
    remove_duplicate_companies()
