from openai import OpenAI
import pandas as pd
import os
from dotenv import load_dotenv
import csv

df = pd.read_csv("../data/newsdata/apple_news.csv")


# Load environment variables from .env file
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


resp = client.responses.create(
    model="gpt-5",              # widely available, fast/cost-effective
    input="give me a sentence pitch for a startup idea",
    temperature = 0.1
)
print(resp.output_text)

