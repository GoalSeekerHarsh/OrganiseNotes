import React from 'react';
import DocumentGrid from './DocumentGrid';
import type { Document, DocumentTag } from '../types';

interface DashboardProps {
  documents: Document[];
  onOpenFile: (doc: Document) => void;
  onOpenUploadDialog: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, onOpenFile, onOpenUploadDialog }) => {
  const allTags = [...new Set(documents.flatMap(d => d.tags))] as DocumentTag[];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Dashboard</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Overview of your documents and activities.</p>
      </div>
      
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">All Documents</h3>
      <DocumentGrid 
        documents={documents} 
        availableTags={allTags}
        onOpenFile={onOpenFile}
        onOpenUploadDialog={onOpenUploadDialog}
      />
    </div>
  );
};

export default Dashboard;
