#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
startup_scraper.py
Free + legal pipeline using public sources:
- Wikipedia fallback for core profile fields (description, founded, HQ/region, public/IPO)
- Optional company newsroom parsing for funding clues (private companies)
Requires a ScrapingAnt API key: https://scrapingant.com

Usage:
  export SCRAPINGANT_TOKEN="YOUR_TOKEN_HERE"
  python startup_scraper.py --name "Rippling" --newsroom "https://www.rippling.com/blog"
  python startup_scraper.py --name "Palantir" --newsroom "https://www.palantir.com/newsroom/"

Outputs a single JSON object on stdout.
"""

import os, re
from typing import Optional, Tuple, List, Dict
from dotenv import load_dotenv
from scrapingant_client import ScrapingAntClient
from bs4 import BeautifulSoup

load_dotenv()  # reads .env in the working dir
ANT_TOKEN = os.getenv("SCRAPINGANT_TOKEN")
if not ANT_TOKEN:
    raise RuntimeError("SCRAPINGANT_TOKEN missing. Put it in a .env file next to this script.")

client = ScrapingAntClient(token=ANT_TOKEN)

# ---------------- helpers ----------------
MONEY_RE = re.compile(
    r'(?:(?:USD|US\$|\$)\s*)?([\d]{1,3}(?:[,.\s]\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\s*(k|m|b|thousand|million|billion)?',
    re.I,
)
YEAR_RE = re.compile(r'\b(20\d{2}|19\d{2})\b')

def _to_float_amount(text: str) -> Optional[float]:
    m = MONEY_RE.search(text or "")
    if not m: return None
    raw, unit = m.groups()
    if not raw: return None
    val = float(raw.replace(",", "").replace(" ", ""))
    mult = 1.0
    if unit:
        u = unit.lower()
        mult = 1_000 if u.startswith("k") or u.startswith("thousand") else \
               1_000_000 if u.startswith("m") or u.startswith("million") else \
               1_000_000_000 if u.startswith("b") or u.startswith("billion") else 1.0
    return val * mult

def _first_year(text: str) -> Optional[int]:
    y = YEAR_RE.search(text or "")
    return int(y.group(0)) if y else None

def _soup(url: str) -> Optional[BeautifulSoup]:
    try:
        html = client.general_request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; startup-info/1.0)"}
        ).content
        return BeautifulSoup(html, "html.parser")
    except Exception:
        return None

# ---------------- wikipedia fallback ----------------
def _wiki_profile(name: str) -> Tuple[Optional[str], Optional[int], Optional[str], bool]:
    candidates = [
        f"https://en.wikipedia.org/wiki/{name.replace(' ', '_')}",
        f"https://en.wikipedia.org/wiki/{name.replace(' ', '_')}_(company)",
        f"https://en.wikipedia.org/wiki/{name.replace(' ', '_')}_Inc."
    ]
    soup = None
    for u in candidates:
        s = _soup(u)
        if s and "may refer to" not in s.get_text(" ", strip=True)[:300].lower():
            soup = s; break
    if not soup: return None, None, None, False

    # description = first substantial paragraph
    description = None
    for p in soup.select("p"):
        txt = p.get_text(" ", strip=True)
        if len(txt) > 60:
            description = txt; break

    infobox = soup.select_one("table.infobox")
    founded = None; region = None; is_public = False
    if infobox:
        for row in infobox.select("tr"):
            th, td = row.select_one("th"), row.select_one("td")
            if not th or not td: continue
            key = th.get_text(" ", strip=True)
            val = td.get_text(" ", strip=True)
            if "Founded" in key and not founded:
                y = _first_year(val); founded = y or founded
            if ("Headquarters" in key) and not region:
                region = val
            if "Traded as" in key or ("Type" in key and "public" in val.lower()):
                is_public = True
    # fallback signal
    if not is_public and "traded as" in soup.get_text(" ", strip=True).lower():
        is_public = True

    return description, founded, region, is_public

# ---------------- newsroom scrape (optional) ----------------
FUNDING_KEYS = ("funding", "raise", "raised", "round", "series", "seed", "invest", "investment", "led by")

def _scrape_newsroom(url: str) -> List[Dict]:
    soup = _soup(url)
    if not soup: return []
    items = []
    for el in soup.select("article, .post, .news-item, li, a, div"):
        txt = el.get_text(" ", strip=True)
        low = txt.lower()
        if any(k in low for k in FUNDING_KEYS):
            amt = _to_float_amount(txt)
            yr = _first_year(txt)
            if amt or yr:
                items.append({"text": txt, "amount": amt, "year": yr})
    # de-dupe roughly
    seen, uniq = set(), []
    for it in items:
        key = (it["amount"], it["year"], it["text"][:120])
        if key in seen: continue
        seen.add(key); uniq.append(it)
    return uniq

def _extract_investors(blobs: List[str]) -> List[str]:
    names = set()
    patterns = [
        r'\bled by\s+([A-Z][A-Za-z0-9&.\- ]{2,80})',
        r'\bfrom\s+([A-Z][A-Za-z0-9&.\- ]{2,80})',
        r'\bbacked by\s+([A-Z][A-Za-z0-9&.\- ]{2,80})',
        r'\bparticipation from\s+([A-Z][A-Za-z0-9&.\- ]{2,80})'
    ]
    for t in blobs:
        for pat in patterns:
            m = re.search(pat, t)
            if m: names.add(m.group(1).strip(" .,-"))
    return sorted({re.sub(r'\s{2,}', ' ', n) for n in names if len(n) > 2})

# ---------------- public API ----------------
def get_startup_info(
    name: str,
    newsroom_url: Optional[str] = None,
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    region: Optional[str] = None,
    year_founded: Optional[int] = None,
    description: Optional[str] = None
) -> Dict:
    """Return a dict with the target fields using Wikipedia + optional newsroom."""
    w_desc, w_found, w_region, is_public = _wiki_profile(name)
    description = description or w_desc
    year_founded = year_founded or w_found
    region = region or w_region

    total_funding = None
    last_funding_year = None
    investors = None

    if newsroom_url and not is_public:
        news = _scrape_newsroom(newsroom_url)
        amounts = [n["amount"] for n in news if n.get("amount")]
        years   = [n["year"] for n in news if n.get("year")]
        if amounts: total_funding = round(sum(amounts), 2)
        if years:   last_funding_year = max(y for y in years if y)
        investors = _extract_investors([n["text"] for n in news])

    exit_status = "Exited" if is_public else "Active"

    return {
        "startup_name": name,
        "description": description,
        "category": category,
        "subcategory": subcategory,
        "total_funding": total_funding,
        "last_funding_year": last_funding_year,
        "region": region,
        "year_founded": year_founded,
        "investors": investors,
        "exit_status": exit_status,
    }
