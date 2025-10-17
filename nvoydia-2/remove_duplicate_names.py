#!/usr/bin/env python3

import re

def remove_duplicate_companies_simple():
    # Read the file
    with open('data-service.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all company name lines with their line numbers
    lines = content.split('\n')
    company_lines = []
    
    for i, line in enumerate(lines):
        if 'name: "' in line and line.strip().endswith(','):
            match = re.search(r'name: "([^"]*)"', line)
            if match:
                company_lines.append((i, match.group(1)))
    
    print(f"Found {len(company_lines)} company name lines")
    
    # Group by company name
    companies_by_name = {}
    for line_num, name in company_lines:
        if name not in companies_by_name:
            companies_by_name[name] = []
        companies_by_name[name].append(line_num)
    
    # Find duplicates and remove the second occurrence
    lines_to_remove = []
    for name, line_nums in companies_by_name.items():
        if len(line_nums) > 1:
            print(f"Found {len(line_nums)} instances of '{name}' at lines: {[x+1 for x in line_nums]}")
            # Keep the first one, mark the rest for removal
            for line_num in line_nums[1:]:
                lines_to_remove.append(line_num)
    
    # Remove the duplicate lines (in reverse order to maintain indices)
    for line_num in sorted(lines_to_remove, reverse=True):
        del lines[line_num]
    
    # Write back to file
    with open('data-service.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"✅ Removed {len(lines_to_remove)} duplicate company name lines")
    return True

if __name__ == "__main__":
    remove_duplicate_companies_simple()
