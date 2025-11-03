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
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Overview of your documents and activities.</p>
      </div>
      
      <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">All Documents</h3>
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
