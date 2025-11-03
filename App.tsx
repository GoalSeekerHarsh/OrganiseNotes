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
import Login from './components/Login';
import { Toast } from './components/Toast';
import { uploadFile } from './services/fileUploadService';
import { getUser, updateUserProfile, updateUserDocuments } from './services/userService';
import type { UserProfile, Document } from './types';

// --- Icons ---
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zm-2.12-10.607a1 1 0 011.414 0l.706.707a1 1 0 11-1.414 1.414l-.706-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" /></svg> );
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );

// Helper function to determine the initial theme
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

export interface UserData {
  profile: UserProfile;
  documents: Document[];
}

const App: React.FC = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isUploadOpen, setUploadOpen] = useState(false);
  const [isFileViewerOpen, setFileViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check for authentication state on component mount
  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    if (loggedInEmail) {
        const userData = getUser(loggedInEmail);
        if (userData) {
            setIsAuthenticated(true);
            setProfile(userData.profile);
            setDocuments(userData.documents);
        } else {
            // Data inconsistency, clear session
            sessionStorage.removeItem('loggedInEmail');
        }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogin = (userData: UserData) => {
    setIsAuthenticated(true);
    sessionStorage.setItem('loggedInEmail', userData.profile.email);
    setProfile(userData.profile);
    setDocuments(userData.documents);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('loggedInEmail');
    setCurrentPage('dashboard'); // Reset to default page on logout
    setProfileMenuOpen(false);
    setProfile(null);
    setDocuments([]);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  const handleNavigate = (page: string) => setCurrentPage(page);
  
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    updateUserProfile(updatedProfile.email, updatedProfile);
    showToast('Profile updated successfully!', 'success');
  };

  const handleOpenFile = (doc: Document) => {
    setSelectedDocument(doc);
    setFileViewerOpen(true);
  };
  
  const handleUploadDocument = async (newDoc: Omit<Document, 'id' | 'uploadDate' | 'url'>) => {
    if (!newDoc.file || !profile) return;
    
    const fileUrl = await uploadFile(newDoc.file);
    // Create the final document object for persistence, omitting the temporary 'file' property.
    const docToAdd: Document = {
      id: crypto.randomUUID(),
      name: newDoc.name,
      type: newDoc.type,
      uploadDate: new Date().toISOString(),
      tags: newDoc.tags,
      url: fileUrl, // The persistent URL is what matters.
    };
    
    const updatedDocuments = [docToAdd, ...documents];
    setDocuments(updatedDocuments);
    updateUserDocuments(profile.email, updatedDocuments);
    showToast('Document uploaded successfully!', 'success');
  };
  
  const handleDeleteDocument = (docId: string) => {
    if (!profile) return;

    const updatedDocuments = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocuments);
    updateUserDocuments(profile.email, updatedDocuments);
    
    setFileViewerOpen(false);
    setSelectedDocument(null);
    showToast('Document deleted successfully!', 'success');
  };

  const renderPage = () => {
    const commonProps = { 
        documents: documents, 
        onOpenFile: handleOpenFile, 
        onOpenUploadDialog: () => setUploadOpen(true)
    };
    switch (currentPage) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'skills': return <Skills {...commonProps} />;
      case 'certificates': return <Certificates {...commonProps} />;
      case 'curriculum': return <Curriculum {...commonProps} />;
      case 'profile': 
        if (!profile) return null;
        return <Profile profile={profile} onUpdateProfile={handleUpdateProfile} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  if (!isAuthenticated || !profile) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg p-4 flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <MenuIcon />
          </button>
          <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 ring-2 ring-transparent hover:ring-emerald-300 dark:hover:ring-emerald-600 transition-all">
                {profile.name.charAt(0)}
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-50 border border-slate-200 dark:border-slate-700 animate-fade-in-down">
                  <button onClick={() => { handleNavigate('profile'); setProfileMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <UserIcon /><span>Profile</span>
                  </button>
                  <button onClick={handleLogout} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <LogoutIcon /><span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           <div className="animate-fade-in-up">
              {renderPage()}
            </div>
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
