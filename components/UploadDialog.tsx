import React, { useState, useCallback } from 'react';
import type { Document, DocumentType } from '../types';

interface UploadDialogProps {
  onClose: () => void;
  onUpload: (newDoc: Omit<Document, 'id' | 'uploadDate' | 'url'>) => Promise<void>;
}

const getDocumentType = (fileName: string): DocumentType => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf': return 'pdf';
        case 'doc': case 'docx': return 'docx';
        case 'png': return 'png';
        case 'jpg': case 'jpeg': return 'jpg';
        case 'txt': return 'txt';
        default: return 'other';
    }
}

const UploadDialog: React.FC<UploadDialogProps> = ({ onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size cannot exceed 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => setTags(tags.filter(tag => tag !== tagToRemove));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please select a file to upload.'); return; }
    setIsLoading(true);
    setError(null);
    try {
        const newDoc: Omit<Document, 'id' | 'uploadDate' | 'url'> = {
            name: file.name, type: getDocumentType(file.name), tags: tags, file: file
        };
        await onUpload(newDoc);
        onClose();
    } catch (uploadError) {
        setError('Upload failed. Please try again.');
        console.error(uploadError);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg relative transition-transform transform scale-95 animate-fade-in-up" style={{animationDuration: '0.3s'}} onClick={e => e.stopPropagation()}>
            <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Upload Document</h2>
                    {error && <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded-md mb-4" role="alert">{error}</div>}

                    <div 
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'} ${isLoading ? 'opacity-50' : ''}`}
                    >
                        <input type="file" className="hidden" id="file-upload" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} disabled={isLoading} />
                        <label htmlFor="file-upload" className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}>
                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><span className="font-semibold text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500">PDF, DOCX, PNG, JPG up to 10MB</p>
                            {file && <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">{file.name}</p>}
                        </label>
                    </div>

                    <div className={`mt-4 ${isLoading ? 'opacity-50' : ''}`}>
                        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custom Tags (press Enter to add)</label>
                        <div className="mt-1 flex flex-wrap gap-2 items-center p-2 border border-slate-300 dark:border-slate-600 rounded-md">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200" disabled={isLoading}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </span>
                            ))}
                            <input type="text" id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-grow bg-transparent focus:outline-none text-sm text-slate-800 dark:text-slate-200" placeholder={tags.length === 0 ? "e.g., Physics, Midterm" : ""} disabled={isLoading}/>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl">
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 disabled:opacity-50">Cancel</button>
                    <button type="submit" disabled={isLoading || !file} className="px-4 py-2 w-28 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Upload'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default UploadDialog;