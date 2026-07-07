#!/usr/bin/env python3
"""
Parks Commission Report Renamer

Usage:
    python rename_parks_reports.py

Run this script in the folder containing your downloaded report PDFs.
It will rename them to the standard format: YYYYMM-division.pdf
"""

import os
import re

# Month name to number mapping
MONTHS = {
    'january': '01', 'february': '02', 'march': '03', 'april': '04',
    'may': '05', 'june': '06', 'july': '07', 'august': '08',
    'september': '09', 'october': '10', 'november': '11', 'december': '12',
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09',
    'oct': '10', 'nov': '11', 'dec': '12'
}

def get_month_num(month_name):
    """Convert month name to two-digit number."""
    return MONTHS.get(month_name.lower(), None)

def parse_filename(filename):
    """
    Parse a filename and return (YYYYMM, division) or (None, None) if no match.
    """
    name = filename.lower()
    
    # Build month pattern from keys
    month_pattern = '|'.join(MONTHS.keys())
    
    # Pattern: "Administrative Resources Division Commission Report_January 2026.pdf"
    if 'admin' in name:
        match = re.search(rf'({month_pattern})[_\s]*(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "admin"
    
    # Pattern: "Operations Division Commission Report_January 2026_P.pdf"
    elif 'operations' in name:
        match = re.search(rf'({month_pattern})[_\s]*(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "operations"
    
    # Pattern: "Recreation Division Commission Report_January 2026_P.pdf"
    elif 'recreation' in name:
        match = re.search(rf'({month_pattern})[_\s]*(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "recreation"
    
    # Pattern: "Volunteer Division Commission Report_January 2026.pdf"
    elif 'volunteer' in name:
        match = re.search(rf'({month_pattern})[_\s]*(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "volunteer"
    
    # Pattern: "Org Safety Division..." or "Safety Division..."
    elif 'safety' in name:
        match = re.search(rf'({month_pattern})[_\s]*(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "safety"
    
    # Pattern: "December_10_2025 Meeting Minutes_P.pdf"
    elif 'meeting' in name and 'minutes' in name:
        # Try: Month_DD_YYYY or Month DD YYYY
        match = re.search(rf'({month_pattern})[_\s]+\d{{1,2}}[_\s]+(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "minutes"
    
    # Pattern: "Meeting Agenda_January_14_2026_P.pdf"
    elif 'meeting' in name and 'agenda' in name:
        match = re.search(rf'({month_pattern})[_\s]+\d{{1,2}}[_\s]+(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "agenda"
    
    # Pattern: "LRPR Parks Commission Meeting Schedule 2026..."
    elif 'schedule' in name:
        match = re.search(r'(\d{4})', filename)
        if match:
            year = match.group(1)
            return year, "schedule"
    
    # Pattern: "PARKS COMMISSION UPDATED BYLAWS-12.11.24-January 2025.pdf"
    elif 'bylaws' in name:
        match = re.search(rf'({month_pattern})[_\s]*(\d{{4}})', filename, re.IGNORECASE)
        if match:
            month, year = match.group(1), match.group(2)
            month_num = get_month_num(month)
            if month_num:
                return f"{year}{month_num}", "reference-bylaws"
    
    return None, None


def main():
    # Get all PDF files in current directory
    pdf_files = [f for f in os.listdir('.') if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print("No PDF files found in current directory.")
        return
    
    print(f"Found {len(pdf_files)} PDF file(s)\n")
    
    renamed = 0
    skipped = 0
    
    for filename in pdf_files:
        period, division = parse_filename(filename)
        
        if period and division:
            new_name = f"{period}-{division}.pdf"
            
            if filename == new_name:
                print(f"SKIP (already named): {filename}")
                skipped += 1
            elif os.path.exists(new_name):
                print(f"SKIP (target exists): {filename} -> {new_name}")
                skipped += 1
            else:
                print(f"RENAME: {filename}")
                print(f"     -> {new_name}")
                os.rename(filename, new_name)
                renamed += 1
        else:
            print(f"SKIP (no pattern match): {filename}")
            skipped += 1
    
    print(f"\n{'='*50}")
    print(f"Done! Renamed: {renamed}, Skipped: {skipped}")
    print(f"\nNext step: Upload renamed files to GitHub pdfs/ folder")


if __name__ == "__main__":
    main()
