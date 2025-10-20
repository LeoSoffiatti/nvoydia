from openai import OpenAI
import pandas as pd
import os
from dotenv import load_dotenv
import csv
import json
from datetime import datetime


# Load environment variables from .env file
load_dotenv()

#csv processing (current version is just testing it)
# Check if JSON file exists, otherwise use CSV
json_path = "newsdata/palantir_news.json"
csv_path = "newsdata/palantir_news.csv"

if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
elif os.path.exists(csv_path):
    # If JSON doesn't exist, read CSV and convert to similar structure
    df = pd.read_csv(csv_path)
    data = {"periods": {}}
    for period in df['period'].unique():
        period_data = df[df['period'] == period]
        data["periods"][period] = {
            "articles": period_data.to_dict('records')
        }
else:
    print(f"Error: Neither {json_path} nor {csv_path} found!")
    exit(1)


window_mapping = {}
for window_name, window in data["periods"].items():
    parts = []
    # Check if articles exist and handle cases where they might not
    if "articles" in window and window["articles"]:
        article_count = len(window["articles"])
        print(f"Processing {window_name}: {article_count} articles")
        for article in window["articles"]:
            title = article.get("title", "")
            desc = article.get("description", "")
            content = article.get("content", "")
            parts.append(" ".join([title, desc, content]).strip())
        window_mapping[window_name] = "\n\n".join(parts).strip()
    else:
        print(f"Warning: No articles found for period {window_name}")
        window_mapping[window_name] = "No articles available for this time period."
        
        

#OpenAI Model details
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

company = "palantir"
summaries = {}

for time in window_mapping:
    # Create context with previous summaries (limit to last 2 to manage tokens)
    previous_context = ""
    if summaries:
        # Get only the last 2 summaries to avoid token limits
        recent_summaries = list(summaries.items())[-2:]
        previous_summaries = "\n".join([f"{period}: {summary}" for period, summary in recent_summaries])
        previous_context = f"\n\nPrevious summaries for context:\n{previous_summaries}\n\n"
    
    resp = client.chat.completions.create(
        model="gpt-4",              # Use gpt-4 instead of gpt-5
        messages=[
            {
                "role": "system",
                "content": "Answer only using the provided context. Do not make up any information."
            }, 
            {
                "role": "user",
                "content": f"Summarize the most important news from all articles in the provided context, focusing only on details that directly relate to {company}. Limit the summary to a maximum of 3 sentences. Prioritize extracting and including all available numbers, statistics, and financial figures. Ensure the summary is concise yet comprehensive. Avoid repeating information from previous summaries unless it provides additional context, new details, or different perspectives.{previous_context}Current time period context: {window_mapping[time]}"
            }
        ]
    )
    
    summary = resp.choices[0].message.content
    summaries[time] = summary
    
    print(f"Time: {time}")
    print(summary)
    print("-"*100)

# Export summaries to JSON file
output_data = {
    "company": company,
    "generated_at": datetime.now().isoformat(),
    "summaries": summaries
}

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"\nSummaries exported to: output.json")


