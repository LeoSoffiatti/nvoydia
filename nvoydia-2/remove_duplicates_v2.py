#!/usr/bin/env python3

import re

def remove_duplicate_companies():
    # Read the file
    with open('data-service.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find all company name lines
    company_lines = []
    for i, line in enumerate(lines):
        if 'name: "' in line and line.strip().endswith(','):
            match = re.search(r'name: "([^"]*)"', line)
            if match:
                company_lines.append((i, match.group(1)))
    
    print(f"Found {len(company_lines)} company name lines")
    
    # Find duplicates
    seen_names = {}
    duplicates_to_remove = []
    
    for line_num, name in company_lines:
        if name in seen_names:
            print(f"Duplicate found: {name} at line {line_num + 1} (first at line {seen_names[name] + 1})")
            duplicates_to_remove.append(line_num)
        else:
            seen_names[name] = line_num
    
    print(f"Found {len(duplicates_to_remove)} duplicate companies to remove")
    
    # Find the company blocks to remove (from opening { to closing })
    blocks_to_remove = []
    
    for dup_line in duplicates_to_remove:
        # Find the start of this company block (look backwards for opening {)
        start_line = dup_line
        while start_line > 0 and '{' not in lines[start_line]:
            start_line -= 1
        
        # Find the end of this company block (look forwards for closing })
        end_line = dup_line
        brace_count = 0
        found_opening = False
        
        while end_line < len(lines):
            line = lines[end_line]
            if '{' in line and not found_opening:
                found_opening = True
                brace_count = line.count('{')
            elif found_opening:
                brace_count += line.count('{') - line.count('}')
                if brace_count <= 0:
                    break
            end_line += 1
        
        blocks_to_remove.append((start_line, end_line))
        print(f"Will remove company block from line {start_line + 1} to {end_line + 1}")
    
    # Remove blocks in reverse order to maintain line numbers
    for start_line, end_line in reversed(blocks_to_remove):
        del lines[start_line:end_line + 1]
    
    # Write the updated file
    with open('data-service.js', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"✅ Removed {len(blocks_to_remove)} duplicate company blocks")
    print("Updated data-service.js with unique companies only")

if __name__ == "__main__":
    remove_duplicate_companies()
