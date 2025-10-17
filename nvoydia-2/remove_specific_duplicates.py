#!/usr/bin/env python3

import re

def remove_specific_duplicates():
    # Read the file
    with open('data-service.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # List of duplicate companies to remove (keeping the first occurrence)
    duplicates_to_remove = [
        "OpenAI", "Hugging Face", "Runway", "ElevenLabs", "GitHub Copilot", 
        "CodiumAI", "Replit", "Tome", "Notion", "Figma", "Canva", "AWS", 
        "Azure", "Google Cloud", "Vercel", "Baseten", "Weights & Biases", 
        "DataBricks", "Pinecone", "LangChain", "LlamaIndex", "cuDNN", 
        "TensorRT", "RAPIDS", "Triton Inference Server", "CUDA Toolkit"
    ]
    
    # Find all company name lines
    company_lines = []
    for i, line in enumerate(lines):
        for duplicate in duplicates_to_remove:
            if f'name: "{duplicate}"' in line and line.strip().endswith(','):
                company_lines.append((i, duplicate))
    
    print(f"Found {len(company_lines)} potential duplicate lines")
    
    # Group by company name to find duplicates
    companies_by_name = {}
    for line_num, name in company_lines:
        if name not in companies_by_name:
            companies_by_name[name] = []
        companies_by_name[name].append(line_num)
    
    # Find duplicates (keep first, remove others)
    blocks_to_remove = []
    for name, line_nums in companies_by_name.items():
        if len(line_nums) > 1:
            print(f"Found {len(line_nums)} instances of '{name}' at lines: {line_nums}")
            # Keep the first one, remove the rest
            for line_num in line_nums[1:]:
                # Find the complete company object block
                start_line = line_num
                while start_line > 0 and '{' not in lines[start_line]:
                    start_line -= 1
                
                # Find the end of the block
                end_line = line_num
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
                print(f"Will remove '{name}' block from line {start_line + 1} to {end_line + 1}")
    
    # Remove blocks in reverse order
    for start_line, end_line in reversed(blocks_to_remove):
        del lines[start_line:end_line + 1]
    
    # Write the updated file
    with open('data-service.js', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"✅ Removed {len(blocks_to_remove)} duplicate company blocks")
    return True

if __name__ == "__main__":
    remove_specific_duplicates()
