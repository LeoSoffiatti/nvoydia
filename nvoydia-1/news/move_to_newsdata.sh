#!/bin/bash

# Script to move all generated news files to the newsdata folder

# Create newsdata directory if it doesn't exist
mkdir -p ../data/newsdata

# Move all JSON and CSV files to newsdata folder
echo "Moving files to newsdata folder..."

# Move JSON files
if ls *.json 1> /dev/null 2>&1; then
    mv *.json ../data/newsdata/
    echo "Moved JSON files to ../data/newsdata/"
else
    echo "No JSON files found to move"
fi

# Move CSV files
if ls *.csv 1> /dev/null 2>&1; then
    mv *.csv ../data/newsdata/
    echo "Moved CSV files to ../data/newsdata/"
else
    echo "No CSV files found to move"
fi

echo "Done! All files moved to ../data/newsdata/"
