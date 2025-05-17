'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import type { FileUploadResponse } from '@/types';
import RetroLoader from './RetroLoader';
import ErrorDialog from './ErrorDialog';

interface FileUploadProps {
  onUploadComplete: (response: FileUploadResponse) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Check for transactions in the analysis object
        const transactions = data.analysis?.transactions;
        if (Array.isArray(transactions) && transactions.length > 0) {
          // Redirect to dashboard if we have transactions
          router.push('/dashboard');
        } else {
          // Show error dialog if no transactions were found
          setErrorDialog({
            isOpen: true,
            title: 'No Transactions Found',
            message: 'The uploaded file does not contain any valid transactions. Please try a different file.',
          });
        }
      } else {
        // Show error dialog for other failures
        setErrorDialog({
          isOpen: true,
          title: 'Upload Failed',
          message: data.message || 'Failed to process the file. Please try again.',
        });
      }
      
      onUploadComplete(data);
    } catch (error) {
      setErrorDialog({
        isOpen: true,
        title: 'Upload Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
      onUploadComplete({
        success: false,
        message: 'Failed to upload file',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, router]);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors retro-window
          ${isDragActive || isFocused ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300 hover:border-cyan-400'}`}
        tabIndex={0}
        aria-live="polite"
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-cyan-400" />
        <p className="mt-2 text-lg font-vt323 text-cyan-700">
          {isDragActive
            ? 'Drop your statement file here'
            : 'Drag and drop your statement file here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-cyan-500">
          Supported formats: PDF, XLS, XLSX, CSV
        </p>
        {isUploading && <RetroLoader label="Uploading & Parsing..." />}
      </div>

      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog(prev => ({ ...prev, isOpen: false }))}
        title={errorDialog.title}
        message={errorDialog.message}
      />
    </>
  );
} 