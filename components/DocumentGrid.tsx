import React, { useState, useMemo } from 'react';
import type { Document, DocumentTag, DocumentType } from '../types';
import { getFileIcon } from '../utils/fileIcons';

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
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let processedDocs = [...documents];

    // Filter by search query
    if (searchQuery) {
      processedDocs = processedDocs.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tags
    if (activeTags.size > 0) {
      processedDocs = processedDocs.filter(doc =>
        doc.tags.some(tag => activeTags.has(tag))
      );
    }
    
    // Sort
    processedDocs.sort((a, b) => {
        if (sortKey === 'name') {
            return sortDirection === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
        }
        // uploadDate
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
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
      });
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        {/* Sorting */}
        <div className="flex items-center gap-2">
            <button onClick={() => handleSortChange('uploadDate')} className={`px-4 py-2 rounded-lg text-sm font-medium ${sortKey === 'uploadDate' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Date {sortKey === 'uploadDate' && (sortDirection === 'desc' ? '↓' : '↑')}</button>
            <button onClick={() => handleSortChange('name')} className={`px-4 py-2 rounded-lg text-sm font-medium ${sortKey === 'name' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Name {sortKey === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</button>
        </div>
      </div>
      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeTags.has(tag)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredAndSortedDocuments.length > 0 || documents.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedDocuments.map((doc) => (
            <div key={doc.id} onClick={() => onOpenFile(doc)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-start space-y-2 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500">
              {getFileIcon(doc.type)}
              <h3 className="font-semibold text-md text-gray-800 dark:text-gray-200 break-all">{doc.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(doc.uploadDate)}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {doc.tags.map(tag => (
                     <span key={tag} className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                        {tag}
                    </span>
                ))}
              </div>
            </div>
          ))}
           <div onClick={onOpenUploadDialog} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 flex flex-col items-center justify-center space-y-2 hover:border-indigo-500 transition-colors cursor-pointer min-h-[160px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Upload Document</p>
        </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No documents found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;
