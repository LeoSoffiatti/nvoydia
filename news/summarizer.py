from openai import OpenAI
import pandas as pd
import os
from dotenv import load_dotenv
import csv
import json


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
for time in window_mapping:
    resp = client.chat.completions.create(
        model="gpt-4",              # Use gpt-4 instead of gpt-5
        messages=[
            {
                "role": "system",
                "content": "Answer only using the provided context. Do not make up any information."
            }, 
            {
                "role": "user",
                "content": f"Summarize the most important news from all articles in the provided context, focusing only on details that directly relate to {company}. Limit the summary to a maximum of 3 sentences. Prioritize extracting and including all available numbers, statistics, and financial figures. Ensure the summary is concise yet comprehensive. \n\n Context: {window_mapping[time]}"
            }
        ],
    )
    print(f"Time: {time}")
    print(resp.choices[0].message.content)
    print("-"*100)


