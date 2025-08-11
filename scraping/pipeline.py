# pipeline.py
from capital_iq_scraper import get_startup_info
import csv

companies = [
    ("Rippling", "https://www.rippling.com/blog"),
    ("Anthropic", "https://www.anthropic.com/news"),
    ("Palantir", "https://www.palantir.com/newsroom/"),
]

rows = [get_startup_info(name, newsroom) for name, newsroom in companies]

with open("startup_info_output.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("✅ Data written to startup_info_output.csv")
