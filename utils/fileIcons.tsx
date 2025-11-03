import React from 'react';
import type { DocumentType } from '../types';

const PdfIcon: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}><path d="M4 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4ZM14 12.5a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.379a.5.5 0 0 0 .353-.146l1.147-1.147a.5.5 0 0 0 .146-.354V12.5ZM16 10a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6Z" fill="currentColor"/></svg>;
const DocxIcon: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}><path d="M4 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4ZM9 16h6v-1.5H9V16ZM9 12h6V9H9v3Z" fill="currentColor"/></svg>;
const ImageIcon: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}><path d="M4 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4Zm4-8 2.5-4 3.5 6 2-3 3 6H8Z" fill="currentColor"/></svg>;
const TxtIcon: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}><path d="M4 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4ZM8 9h8v1.5H8V9Zm0 4.5h8V15H8v-1.5Z" fill="currentColor"/></svg>;
const OtherIcon: React.FC<{ className?: string }> = ({ className }) => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}><path d="M9 3h9a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8l4-5ZM8 9V4l-3 4h3Z" fill="currentColor"/></svg>;

export const fileTypeColors: { [key in DocumentType | 'other']: { icon: string; bg: string; border: string; } } = {
  pdf: { icon: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'text-rose-500' },
  docx: { icon: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'text-blue-500' },
  png: { icon: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'text-emerald-500' },
  jpg: { icon: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'text-emerald-500' },
  txt: { icon: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'text-slate-500' },
  other: { icon: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'text-slate-400' }
};

export const getFileIcon = (type: DocumentType, className: string = 'h-8 w-8'): React.ReactNode => {
  const colorClass = (fileTypeColors[type] || fileTypeColors.other).icon;
  const combinedClassName = `${className} ${colorClass}`;
  switch (type) {
    case 'pdf': return <PdfIcon className={combinedClassName} />;
    case 'docx': return <DocxIcon className={combinedClassName} />;
    case 'png':
    case 'jpg': return <ImageIcon className={combinedClassName} />;
    case 'txt': return <TxtIcon className={combinedClassName} />;
    case 'other':
    default: return <OtherIcon className={combinedClassName} />;
  }
};
