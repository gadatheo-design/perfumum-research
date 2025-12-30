/**
 * CSV Utility Functions for Import/Export
 * 
 * Provides functions to convert database records to CSV format and vice versa.
 */

/**
 * Convert an array of objects to CSV string
 */
export function objectsToCSV<T extends Record<string, any>>(data: T[]): string {
  if (data.length === 0) return '';
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.map(escapeCSVField).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return escapeCSVField(formatValue(value));
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Parse CSV string to array of objects
 */
export function csvToObjects<T extends Record<string, any>>(
  csvContent: string,
  parseRow: (row: Record<string, string>) => T
): T[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return []; // Need at least header + 1 data row
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const results: T[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue; // Skip malformed rows
    
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    
    try {
      results.push(parseRow(row));
    } catch (error) {
      console.error(`Error parsing row ${i}:`, error);
      // Skip invalid rows
    }
  }
  
  return results;
}

/**
 * Escape a field for CSV format
 */
function escapeCSVField(value: string): string {
  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current);
  
  return result;
}

/**
 * Format a value for CSV export
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Parse a value from CSV import
 */
export function parseValue(value: string, type: 'string' | 'number' | 'boolean' | 'date' | 'json'): any {
  if (value === '' || value === null || value === undefined) return null;
  
  switch (type) {
    case 'string':
      return value;
    case 'number':
      const num = Number(value);
      return isNaN(num) ? null : num;
    case 'boolean':
      return value.toLowerCase() === 'true' || value === '1';
    case 'date':
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    default:
      return value;
  }
}
