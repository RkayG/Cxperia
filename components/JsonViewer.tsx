// components/JsonViewer.tsx
'use client';
import { useState } from 'react';

interface JsonViewerProps {
  data: any;
  title?: string;
}

export default function JsonViewer({ data, title = 'JSON Data' }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatJson = (obj: any) => {
    if (!obj) return 'No data';
    try {
      const parsed = typeof obj === 'string' ? JSON.parse(obj) : obj;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return 'Invalid JSON';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      <pre className={`text-sm text-gray-800 overflow-x-auto font-mono ${
        isExpanded ? 'max-h-96' : 'max-h-32'
      } transition-all duration-200`}>
        {formatJson(data)}
      </pre>
    </div>
  );
}