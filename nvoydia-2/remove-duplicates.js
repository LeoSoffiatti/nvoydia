#!/usr/bin/env node

// Script to remove duplicate companies from data-service.js
const fs = require('fs');
const path = require('path');

// Read the data-service.js file
const filePath = path.join(__dirname, 'data-service.js');
let content = fs.readFileSync(filePath, 'utf8');

// Extract the companies array from the file
const companiesMatch = content.match(/this\.companies = \[([\s\S]*?)\];/);
if (!companiesMatch) {
    console.error('Could not find companies array in data-service.js');
    process.exit(1);
}

// Parse the companies array (this is a simplified approach)
// We'll use a more robust method by evaluating the JavaScript
const companiesArrayStart = content.indexOf('this.companies = [');
const companiesArrayEnd = content.indexOf('];', companiesArrayStart) + 2;

// Extract the array content
const arrayContent = content.substring(companiesArrayStart, companiesArrayEnd);

// Create a temporary file to evaluate the JavaScript
const tempFile = 'temp_companies.js';
fs.writeFileSync(tempFile, `
const companies = ${arrayContent.replace('this.companies = ', '')};
module.exports = companies;
`);

// Load the companies array
const companies = require(`./${tempFile}`);

// Remove duplicates based on company name
const seenNames = new Set();
const uniqueCompanies = [];

for (const company of companies) {
    if (!seenNames.has(company.name)) {
        seenNames.add(company.name);
        uniqueCompanies.push(company);
    } else {
        console.log(`Removing duplicate: ${company.name}`);
    }
}

console.log(`Original companies: ${companies.length}`);
console.log(`Unique companies: ${uniqueCompanies.length}`);
console.log(`Duplicates removed: ${companies.length - uniqueCompanies.length}`);

// Clean up temp file
fs.unlinkSync(tempFile);

// Replace the companies array in the original file
const newArrayContent = `this.companies = ${JSON.stringify(uniqueCompanies, null, 8)};`;
const newContent = content.substring(0, companiesArrayStart) + newArrayContent + content.substring(companiesArrayEnd);

// Write the updated file
fs.writeFileSync(filePath, newContent);

console.log('✅ Duplicate companies removed successfully!');
console.log('Updated data-service.js with unique companies only.');
