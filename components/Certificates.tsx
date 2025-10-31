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
      <h2 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Certificates</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">Organize certificates for your resume.</p>
      
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
