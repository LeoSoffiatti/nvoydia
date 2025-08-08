import pandas as pd
import time
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import os

### ---------- CONFIG ---------- ###
EXCEL_FILE = "scraping/pitchbook/PitchBook_Search_Result_Columns_2025_08_07_21_00_05.xlsx"  # updated path
N_COMPANIES = 50  # You can change this depending on how many top entries you want to process
OUTPUT_FILE = "enriched_pitchbook_output.csv"
FAILED_LOG = "failed_urls.log"

### ---------- SETUP ---------- ###
options = uc.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")
driver = uc.Chrome(options=options)

### ---------- HELPERS ---------- ###
def safe_find_text(by, value):
    try:
        return driver.find_element(by, value).text.strip()
    except NoSuchElementException:
        return ""

def clean_company_name(name):
    if pd.isna(name):
        return ""
    name = str(name).strip()
    name = name.replace("\u00a9 PitchBook Data, Inc. 2025", "")
    return name

### ---------- LOAD EXCEL ---------- ###
df = pd.read_excel(EXCEL_FILE, skiprows=7)  # skip first 7 metadata rows
df["Startup"] = df["Companies"].apply(clean_company_name)
df = df[df["Startup"] != ""]
df = df.drop_duplicates(subset="Startup").head(N_COMPANIES)

### ---------- SCRAPE LOOP ---------- ###
results = []
failed_urls = []

for i, row in df.iterrows():
    startup = row.get("Startup", "")
    print(f"🔍 Processing {startup} ({i+1}/{len(df)})")

    base_url = f"https://dealroom.co/companies/{startup.replace(' ', '-')}"
    driver.get(base_url)
    time.sleep(2.5)

    try:
        data = {
            "Startup": startup,
            "Description": row.get("Description", "") or safe_find_text(By.CSS_SELECTOR, "[data-testid='company-description']"),
            "Category": row.get("Category", ""),
            "Subcategory": row.get("Subcategory", ""),
            "Total Funding": row.get("Total Funding", "") or safe_find_text(By.XPATH, "//*[contains(text(),'Total funding')]/following-sibling::*[1]"),
            "Last Funding Year": row.get("Last Funding Year", ""),
            "Region": row.get("Region", "") or safe_find_text(By.XPATH, "//*[contains(text(),'HQ')]/following-sibling::*[1]"),
            "Year Founded": row.get("Year Founded", "") or safe_find_text(By.XPATH, "//*[contains(text(),'Founded')]/following-sibling::*[1]"),
            "Investors": safe_find_text(By.XPATH, "//*[contains(text(),'Investors')]/following-sibling::*[1]"),
            "Exit Status": safe_find_text(By.XPATH, "//*[contains(text(),'Exit')]/following-sibling::*[1]"),
        }
        results.append(data)
    except Exception as e:
        print(f"❌ Failed to process {startup}: {e}")
        failed_urls.append(base_url)

### ---------- SAVE OUTPUT ---------- ###
output_df = pd.DataFrame(results)
output_df.to_csv(OUTPUT_FILE, index=False)
print(f"✅ Finished. Saved to {OUTPUT_FILE}")

if failed_urls:
    with open(FAILED_LOG, "w") as f:
        for url in failed_urls:
            f.write(url + "\n")
    print(f"⚠️ Logged {len(failed_urls)} failed URLs to {FAILED_LOG}")

### ---------- CLEANUP ---------- ###
driver.quit()


# import pandas as pd
# import time
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.chrome.service import Service
# from selenium.common.exceptions import NoSuchElementException, TimeoutException
# from webdriver_manager.chrome import ChromeDriverManager
# import os

# ### ---------- CONFIG ---------- ###
# EXCEL_FILE = "scraping/pitchbook/PitchBook_Search_Result_Columns_2025_08_07_21_00_05.xlsx"  # updated path
# N_COMPANIES = 50  # You can change this depending on how many top entries you want to process
# OUTPUT_FILE = "enriched_pitchbook_output.csv"

# ### ---------- SETUP ---------- ###
# options = Options()
# options.add_argument("--headless")
# options.add_argument("--disable-gpu")
# options.add_argument("--window-size=1920,1080")
# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# ### ---------- HELPERS ---------- ###
# def safe_find_text(by, value):
#     try:
#         return driver.find_element(by, value).text.strip()
#     except NoSuchElementException:
#         return ""

# def clean_company_name(name):
#     if pd.isna(name):
#         return ""
#     name = str(name).strip()
#     name = name.replace("\u00a9 PitchBook Data, Inc. 2025", "")
#     return name

# ### ---------- LOAD EXCEL ---------- ###
# df = pd.read_excel(EXCEL_FILE, skiprows=7)  # skip first 7 metadata rows
# df["Startup"] = df["Companies"].apply(clean_company_name)
# df = df[df["Startup"] != ""]
# df = df.drop_duplicates(subset="Startup").head(N_COMPANIES)

# ### ---------- SCRAPE LOOP ---------- ###
# results = []
# for i, row in df.iterrows():
#     startup = row.get("Startup", "")
#     print(f"🔍 Processing {startup} ({i+1}/{len(df)})")

#     base_url = f"https://dealroom.co/companies/{startup.replace(' ', '-')}"
#     driver.get(base_url)
#     time.sleep(2.5)

#     data = {
#         "Startup": startup,
#         "Description": row.get("Description", "") or safe_find_text(By.CSS_SELECTOR, "[data-testid='company-description']"),
#         "Category": row.get("Category", ""),
#         "Subcategory": row.get("Subcategory", ""),
#         "Total Funding": row.get("Total Funding", "") or safe_find_text(By.XPATH, "//*[contains(text(),'Total funding')]/following-sibling::*[1]"),
#         "Last Funding Year": row.get("Last Funding Year", ""),
#         "Region": row.get("Region", "") or safe_find_text(By.XPATH, "//*[contains(text(),'HQ')]/following-sibling::*[1]"),
#         "Year Founded": row.get("Year Founded", "") or safe_find_text(By.XPATH, "//*[contains(text(),'Founded')]/following-sibling::*[1]"),
#         "Investors": safe_find_text(By.XPATH, "//*[contains(text(),'Investors')]/following-sibling::*[1]"),
#         "Exit Status": safe_find_text(By.XPATH, "//*[contains(text(),'Exit')]/following-sibling::*[1]"),
#     }
#     results.append(data)

# ### ---------- SAVE OUTPUT ---------- ###
# output_df = pd.DataFrame(results)
# output_df.to_csv(OUTPUT_FILE, index=False)
# print(f"✅ Finished. Saved to {OUTPUT_FILE}")

# ### ---------- CLEANUP ---------- ###
# driver.quit()
