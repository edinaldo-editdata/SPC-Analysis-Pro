
import React, { useState, useCallback, useRef } from 'react';
import { Card } from './Card';
import { PasteIcon, UploadIcon } from './icons';

declare const Papa: any;

interface DataInputProps {
  onAnalyze: (data: number[], lsl: number | null, usl: number | null, subgroupSize: number | null) => void;
  isLoading: boolean;
}

export const DataInput: React.FC<DataInputProps> = ({ onAnalyze, isLoading }) => {
  const [dataText, setDataText] = useState<string>('');
  const [lsl, setLsl] = useState<string>('');
  const [usl, setUsl] = useState<string>('');
  const [subgroupSize, setSubgroupSize] = useState<string>('5');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        complete: (results: any) => {
          const flatData = results.data.flat().join('\n');
          setDataText(flatData);
        },
        error: (error: any) => {
          console.error("CSV parsing error:", error);
          alert("Error parsing CSV file.");
        }
      });
    }
  }, []);
  
  const handleAnalyzeClick = useCallback(() => {
    const parsedData = dataText
      .split(/[\s,;\n]+/)
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number)
      .filter(n => !isNaN(n));
    
    const parsedLsl = lsl.trim() === '' ? null : parseFloat(lsl);
    const parsedUsl = usl.trim() === '' ? null : parseFloat(usl);
    const parsedSubgroupSize = subgroupSize.trim() === '' ? null : parseInt(subgroupSize, 10);

    onAnalyze(parsedData, parsedLsl, parsedUsl, parsedSubgroupSize);
  }, [dataText, lsl, usl, subgroupSize, onAnalyze]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card title="Data Input & Configuration" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="data-input" className="block text-sm font-medium text-gray-300 mb-2">
            Paste Data (separated by space, comma, semicolon, or new line)
          </label>
          <textarea
            id="data-input"
            rows={10}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-gray-200 p-3 transition"
            placeholder="e.g., 10.2, 10.5, 9.8, 10.1, ..."
            value={dataText}
            onChange={(e) => setDataText(e.target.value)}
          />
           <div className="mt-4 flex space-x-3">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.txt" className="hidden" />
              <button onClick={triggerFileSelect} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors">
                  <UploadIcon className="w-5 h-5 mr-2" />
                  {fileName ? `File: ${fileName}` : 'Import from CSV/TXT'}
              </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="lsl" className="block text-sm font-medium text-gray-300">Lower Specification Limit (LSL)</label>
            <input type="number" id="lsl" value={lsl} onChange={(e) => setLsl(e.target.value)} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" placeholder="Optional" />
          </div>
          <div>
            <label htmlFor="usl" className="block text-sm font-medium text-gray-300">Upper Specification Limit (USL)</label>
            <input type="number" id="usl" value={usl} onChange={(e) => setUsl(e.target.value)} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" placeholder="Optional" />
          </div>
          <div>
            <label htmlFor="subgroup-size" className="block text-sm font-medium text-gray-300">Subgroup Size (for Control Chart)</label>
            <input type="number" id="subgroup-size" value={subgroupSize} onChange={(e) => setSubgroupSize(e.target.value)} min="2" max="10" className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" placeholder="e.g., 5" />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleAnalyzeClick}
          disabled={isLoading || dataText.trim() === ''}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Data'}
        </button>
      </div>
    </Card>
  );
};
