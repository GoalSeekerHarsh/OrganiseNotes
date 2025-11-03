import React from 'react';
import DocumentGrid from './DocumentGrid';
import type { Document, DocumentTag } from '../types';

interface SkillsProps {
  documents: Document[];
  onOpenFile: (doc: Document) => void;
  onOpenUploadDialog: () => void;
}

const Skills: React.FC<SkillsProps> = ({ documents, onOpenFile, onOpenUploadDialog }) => {
  const skillDocs = documents.filter(doc => doc.tags.includes('Skill'));
  const availableTags: DocumentTag[] = ['Skill', 'React'];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">Skills Earned</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Upload and manage proofs of your skills.</p>
      
      <DocumentGrid 
        documents={skillDocs} 
        availableTags={availableTags}
        defaultTag="Skill"
        onOpenFile={onOpenFile}
        onOpenUploadDialog={onOpenUploadDialog}
      />
    </div>
  );
};

export default Skills;
