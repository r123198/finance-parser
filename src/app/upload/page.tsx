'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import type { FileUploadResponse } from '@/types';

export default function UploadPage() {
  const [uploadStatus, setUploadStatus] = useState<FileUploadResponse | null>(null);

  const handleUploadComplete = (response: FileUploadResponse) => {
    setUploadStatus(response);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 drop-shadow-md">Upload Statement</h1>
        
        <FileUpload onUploadComplete={handleUploadComplete} />

        {uploadStatus && (
          <div className={`mt-6 p-4 rounded-lg ${
            uploadStatus.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}>
            <p className="font-medium">{uploadStatus.message}</p>
            {uploadStatus.error && (
              <p className="mt-2 text-sm">{uploadStatus.error}</p>
            )}
          </div>
        )}

        <div className="mt-8 text-sm text-gray-300">
          <h2 className="font-medium mb-2 text-gray-100">Supported File Types:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>PDF bank statements</li>
            <li>Excel spreadsheets (XLS, XLSX)</li>
          </ul>
          <p className="mt-4">
            Your data is processed locally and never leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
} 