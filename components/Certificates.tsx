import React from 'react';
import DocumentGrid from './DocumentGrid';
import { mockDocuments } from '../data/mockData';
import type { Document, DocumentTag } from '../types';

interface CertificatesProps {
  documents: Document[];
  onOpenFile: (doc: Document) => void;
  onOpenUploadDialog: () => void;
}

const Certificates: React.FC<CertificatesProps> = ({ documents, onOpenFile, onOpenUploadDialog }) => {
  const certificateDocs = documents.filter(doc => doc.tags.includes('Certificate'));
  const availableTags: DocumentTag[] = ['Certificate'];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">Certificates</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Organize certificates for your resume.</p>
      
      <DocumentGrid 
        documents={certificateDocs} 
        availableTags={availableTags}
        defaultTag="Certificate"
        onOpenFile={onOpenFile}
        onOpenUploadDialog={onOpenUploadDialog}
      />
    </div>
  );
};

export default Certificates;
