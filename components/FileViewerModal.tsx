import React, { useState } from 'react';
import type { Document } from '../types';
import { getFileIcon } from '../utils/fileIcons';
import { forceDownload } from '../utils/forceDownload';

interface FileViewerModalProps {
  document: Document;
  onClose: () => void;
  onDelete: (docId: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ document, onClose, onDelete, showToast }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
  }

  const getViewerUrl = (doc: Document): string => {
    if (doc.type === 'pdf' || doc.type === 'docx') {
       // Use a viewer for document types that browsers might not render natively
      return `https://docs.google.com/gview?url=${encodeURIComponent(doc.url)}&embedded=true`;
    }
    // For images, text files, etc., the direct URL is fine
    return doc.url;
  }

   const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // For blob/data URLs, the native download works best and avoids unnecessary fetching.
            if (document.url.startsWith('blob:') || document.url.startsWith('data:')) {
                const a = window.document.createElement('a');
                a.href = document.url;
                a.download = document.name;
                window.document.body.appendChild(a);
                a.click();
                window.document.body.removeChild(a);
            } else {
                // For external HTTP(S) URLs, fetch and force download to bypass potential
                // cross-origin issues with the 'download' attribute.
                await forceDownload(document.url, document.name);
            }
        } catch (error) {
            console.error('Download failed', error);
            showToast('Download failed. Please try again.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{getFileIcon(document.type)}</div>
                <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200 break-all">{document.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded on: {formatDate(document.uploadDate)}</p>
                </div>
            </div>
            
            <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tags</h3>
                 <div className="flex flex-wrap gap-2 pt-2">
                    {document.tags.map(tag => (
                         <span key={tag} className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                            {tag}
                        </span>
                    ))}
                  </div>
            </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-between items-center rounded-b-lg">
            <button 
                onClick={() => {
                    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                        onDelete(document.id);
                    }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:text-red-300 dark:bg-red-900/40 dark:hover:bg-red-900/60"
            >
                Delete
            </button>
            <div className="flex space-x-3">
                 <a href={getViewerUrl(document)} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">
                    View
                </a>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-4 py-2 w-32 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isDownloading 
                        ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                        : 'Download'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FileViewerModal;