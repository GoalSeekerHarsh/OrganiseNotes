import React from 'react';
import DocumentGrid from './DocumentGrid';
import type { Document, DocumentTag } from '../types';

interface CurriculumProps {
  documents: Document[];
  onOpenFile: (doc: Document) => void;
  onOpenUploadDialog: () => void;
}

const Curriculum: React.FC<CurriculumProps> = ({ documents, onOpenFile, onOpenUploadDialog }) => {
  const curriculumDocs = documents.filter(doc => 
    doc.tags.includes('Curriculum') || doc.tags.includes('Notes') || doc.tags.includes('Assignment')
  );
  const availableTags: DocumentTag[] = ['Curriculum', 'Notes', 'Assignment', 'Physics'];


  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-200">College Curriculum</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">Notes, assignments, and resources for your courses.</p>
      
      <DocumentGrid 
        documents={curriculumDocs} 
        availableTags={availableTags}
        onOpenFile={onOpenFile}
        onOpenUploadDialog={onOpenUploadDialog}
      />
    </div>
  );
};

export default Curriculum;
