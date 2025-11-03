import React, { useState, useMemo } from 'react';
import type { Document, DocumentTag, DocumentType } from '../types';
import { getFileIcon, fileTypeColors } from '../utils/fileIcons';

interface DocumentGridProps {
  documents: Document[];
  availableTags: DocumentTag[];
  defaultTag?: DocumentTag;
  onOpenFile: (doc: Document) => void;
  onOpenUploadDialog: () => void;
}

type SortKey = 'uploadDate' | 'name';
type SortDirection = 'asc' | 'desc';

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, availableTags, defaultTag, onOpenFile, onOpenUploadDialog }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<Set<DocumentTag>>(
    defaultTag ? new Set([defaultTag]) : new Set()
  );
  const [sortKey, setSortKey] = useState<SortKey>('uploadDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleTagClick = (tag: DocumentTag) => {
    setActiveTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) newTags.delete(tag);
      else newTags.add(tag);
      return newTags;
    });
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let processedDocs = [...documents];

    if (searchQuery) {
      processedDocs = processedDocs.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (activeTags.size > 0) {
      processedDocs = processedDocs.filter(doc => doc.tags.some(tag => activeTags.has(tag)));
    }
    
    processedDocs.sort((a, b) => {
        if (sortKey === 'name') {
            return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        const dateA = new Date(a.uploadDate).getTime();
        const dateB = new Date(b.uploadDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return processedDocs;
  }, [documents, searchQuery, activeTags, sortKey, sortDirection]);

  const handleSortChange = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection(key === 'uploadDate' ? 'desc' : 'asc');
    }
  };
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl shadow-sm backdrop-blur-sm border border-slate-200 dark:border-slate-700">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => handleSortChange('uploadDate')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortKey === 'uploadDate' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Date {sortKey === 'uploadDate' && (sortDirection === 'desc' ? '↓' : '↑')}</button>
            <button onClick={() => handleSortChange('name')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortKey === 'name' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Name {sortKey === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeTags.has(tag)
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-500'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredAndSortedDocuments.length > 0 || documents.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedDocuments.map((doc) => {
              const colorInfo = fileTypeColors[doc.type] || fileTypeColors.other;
              return (
                 <div key={doc.id} onClick={() => onOpenFile(doc)} className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-64 hover:-translate-y-1`}>
                    <div className={`absolute inset-0 border-2 border-transparent group-hover:border-current rounded-xl transition-colors duration-300 ${colorInfo.border}`}></div>
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center space-x-3 mb-4">
                            {getFileIcon(doc.type, 'w-8 h-8 flex-shrink-0')}
                            <h3 className="font-semibold text-md text-slate-800 dark:text-slate-100 truncate flex-grow" title={doc.name}>{doc.name}</h3>
                        </div>
                        <div className="flex-grow"></div> {/* Spacer */}
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatDate(doc.uploadDate)}</p>
                        <div className="flex flex-wrap gap-1 pt-3 mt-auto border-t border-slate-100 dark:border-slate-700">
                          {doc.tags.slice(0, 2).map(tag => (
                               <span key={tag} className={`px-2 py-0.5 text-xs font-medium ${colorInfo.icon} ${colorInfo.bg} rounded-full`}>
                                  {tag}
                              </span>
                          ))}
                          {doc.tags.length > 2 && (
                              <span className="px-2 py-0.5 text-xs font-medium text-slate-600 bg-slate-200 dark:bg-slate-600 dark:text-slate-300 rounded-full">
                                  +{doc.tags.length - 2}
                              </span>
                          )}
                        </div>
                  </div>
                </div>
              );
          })}
           <div onClick={onOpenUploadDialog} className="group rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-4 flex flex-col items-center justify-center space-y-2 hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-300 cursor-pointer h-64 hover:-translate-y-1">
             <div className="flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-300">Upload Document</p>
            </div>
        </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-500 dark:text-slate-400">No documents found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;