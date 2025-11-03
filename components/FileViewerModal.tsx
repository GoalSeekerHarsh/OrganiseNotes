import React, { useState } from 'react';
import type { Document } from '../types';
import { getFileIcon, fileTypeColors } from '../utils/fileIcons';
import { forceDownload } from '../utils/forceDownload';

interface FileViewerModalProps {
  document: Document;
  onClose: () => void;
  onDelete: (docId: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ document: doc, onClose, onDelete, showToast }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const colorInfo = fileTypeColors[doc.type] || fileTypeColors.other;

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const getViewerUrl = (d: Document): string => {
        if (d.type === 'pdf' || d.type === 'docx') {
            return `https://docs.google.com/gview?url=${encodeURIComponent(d.url)}&embedded=true`;
        }
        return d.url;
    }

   const handleDownload = async () => {
        setIsDownloading(true);
        try {
            if (doc.url.startsWith('blob:') || doc.url.startsWith('data:')) {
                const a = window.document.createElement('a');
                a.href = doc.url;
                a.download = doc.name;
                window.document.body.appendChild(a);
                a.click();
                window.document.body.removeChild(a);
            } else {
                await forceDownload(doc.url, doc.name);
            }
        } catch (error) {
            console.error('Download failed', error);
            showToast('Download failed. Please try again.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden transition-transform transform scale-95 animate-fade-in-up" style={{animationDuration: '0.3s'}} onClick={e => e.stopPropagation()}>
            <div className={`h-2 w-full ${colorInfo.bg.replace('dark:bg-', 'dark:bg-').replace('bg-', 'bg-')}`}></div>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="p-6 flex items-start space-x-4">
                <div className="flex-shrink-0 pt-1">{getFileIcon(doc.type, 'h-10 w-10')}</div>
                <div>
                    <h2 className="text-2xl font-semibold mb-1 text-slate-800 dark:text-slate-100 break-all">{doc.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Uploaded on: {formatDate(doc.uploadDate)}</p>
                </div>
            </div>

            <div className="px-6 pb-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Tags</h3>
                <div className="flex flex-wrap gap-2 pt-2">
                    {doc.tags.map(tag => (
                        <span key={tag} className={`px-3 py-1 text-sm font-medium ${colorInfo.icon} ${colorInfo.bg} rounded-full`}>
                            {tag}
                        </span>
                    ))}
                    {doc.tags.length === 0 && <p className="text-sm text-slate-500 italic">No tags.</p>}
                </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center rounded-b-2xl">
                <button 
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                            onDelete(doc.id);
                        }
                    }}
                    className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-100 rounded-lg hover:bg-rose-200 dark:text-rose-300 dark:bg-rose-900/40 dark:hover:bg-rose-900/60"
                >
                    Delete
                </button>
                <div className="flex space-x-3">
                    <a href={getViewerUrl(doc)} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-slate-800 bg-slate-200 rounded-lg hover:bg-slate-300 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
                        View
                    </a>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="px-4 py-2 w-32 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center justify-center"
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