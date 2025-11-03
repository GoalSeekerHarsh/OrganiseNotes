import React, { useState, useEffect, useRef } from 'react';
import Chatbot from './components/Chatbot';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Curriculum from './components/Curriculum';
import UploadDialog from './components/UploadDialog';
import FileViewerModal from './components/FileViewerModal';
import Toast from './components/Toast';
import { mockDocuments } from './data/mockData';
import { uploadFile } from './services/fileUploadService';
import type { UserProfile, Document } from './types';

// --- Icons ---
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> );
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );
const CloseIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );

// Helper function to determine the initial theme
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // If no theme in storage, check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  // Default to light
  return 'light';
};

const App: React.FC = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'IISERB Student',
    email: 'student@iiserb.ac.in',
    major: 'Biological Sciences',
    yearOfStudy: '3rd Year',
    contact: '+91-XXXXXXXXXX',
    avatarUrl: 'S',
  });

  const [isUploadOpen, setUploadOpen] = useState(false);
  const [isFileViewerOpen, setFileViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);
  const handleNavigate = (page: string) => setCurrentPage(page);
  const handleUpdateProfile = (updatedProfile: UserProfile) => setProfile(updatedProfile);

  const handleOpenFile = (doc: Document) => {
    setSelectedDocument(doc);
    setFileViewerOpen(true);
  };
  
  const handleUploadDocument = async (newDoc: Omit<Document, 'id' | 'uploadDate' | 'url'>) => {
    if (!newDoc.file) return;
    
    const fileUrl = await uploadFile(newDoc.file);
    
    const docToAdd: Document = {
      ...newDoc,
      id: crypto.randomUUID(),
      uploadDate: new Date().toISOString(),
      url: fileUrl,
    };
    setDocuments(prev => [docToAdd, ...prev]);
  };
  
  const handleDeleteDocument = (docId: string) => {
    // First, update the documents list by filtering out the deleted document.
    // Using a functional update ensures we're working with the latest state.
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== docId));

    // Then, close the file viewer modal and clear the selected document state.
    setFileViewerOpen(false);
    setSelectedDocument(null);

    // Finally, show a confirmation toast to the user.
    showToast('Document deleted successfully!', 'success');
  };

  const renderPage = () => {
    const commonProps = { 
        documents: documents, 
        onOpenFile: handleOpenFile, 
        onOpenUploadDialog: () => setUploadOpen(true)
    };
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'skills':
        return <Skills {...commonProps} />;
      case 'certificates':
        return <Certificates {...commonProps} />;
      case 'curriculum':
        return <Curriculum {...commonProps} />;
      case 'profile':
        return <Profile profile={profile} onUpdateProfile={handleUpdateProfile} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
             <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                {isSidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                {profile.name.charAt(0)}
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <button onClick={() => { handleNavigate('profile'); setProfileMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <UserIcon /><span>Profile</span>
                  </button>
                  <button onClick={() => { /* Logout logic */ setProfileMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LogoutIcon /><span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
      <Chatbot />
      {isUploadOpen && <UploadDialog onClose={() => setUploadOpen(false)} onUpload={handleUploadDocument} />}
      {isFileViewerOpen && selectedDocument && (
        <FileViewerModal 
          document={selectedDocument} 
          onClose={() => setFileViewerOpen(false)}
          onDelete={handleDeleteDocument}
          showToast={showToast}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;