import React, { useRef, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SpreadsheetData, CellData } from "../types";

interface CSVUploadProps {
  onDataLoad: (data: SpreadsheetData) => void;
  glassStyle: string;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onDataLoad, glassStyle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (csvText: string): SpreadsheetData => {
  // Split on newlines but be careful about quoted multi-line entries
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  
  // Add the last line if it exists
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse CSV with proper handling of quoted fields (keep this function as is)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Handle escaped quotes
          current += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote state - DON'T add the quote to the content
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field - DON'T trim here to preserve formatting
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field - DON'T trim here either
    result.push(current);
    return result;
  };

  // Rest of your function remains the same...
  const headers = parseCSVLine(lines[0]);
  const maxColumns = Math.min(headers.length, 5);
  const limitedHeaders = headers.slice(0, maxColumns);

  const rows: CellData[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const values = parseCSVLine(line);
      const row: CellData[] = [];
      
      for (let j = 0; j < maxColumns; j++) {
        row.push({
          value: values[j] || '',
          sources: [],
          enriched: false,
          loading: false
        });
      }
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    const emptyRow: CellData[] = [];
    for (let j = 0; j < maxColumns; j++) {
      emptyRow.push({
        value: '',
        sources: [],
        enriched: false,
        loading: false
      });
    }
    rows.push(emptyRow);
  }

  return {
    headers: limitedHeaders,
    rows: rows
  };
};

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      onDataLoad(data);
    } catch (err) {
      setError(`Error parsing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className={`${glassStyle} transition-all duration-200 ${
        isDragOver ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload CSV File
        </h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50/20'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Processing CSV file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                {isDragOver ? (
                  <FileText className="w-8 h-8 text-blue-500" />
                ) : (
                  <Upload className="w-8 h-8 text-blue-500" />
                )}
              </div>
              
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragOver ? 'Drop your CSV file here' : 'Upload your CSV file'}
              </p>
              
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop your file here, or click to browse
              </p>
              
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={triggerFileInput}
              >
                Choose File
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <motion.div
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          <p>• Maximum 5 columns will be imported</p>
          <p>• CSV files with headers are recommended</p>
          <p>• Empty cells will be created as needed</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CSVUpload;