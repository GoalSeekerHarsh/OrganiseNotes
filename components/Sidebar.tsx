import React from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  pageName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
}> = ({ icon, label, pageName, currentPage, onNavigate, isCollapsed }) => {
  const isActive = currentPage === pageName;
  return (
    <button
      onClick={() => onNavigate(pageName)}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isCollapsed ? 'justify-center' : ''
      } ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  );
};

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SkillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const CertificateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const CurriculumIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18M5.455 5.455A9.004 9.004 0 0012 3c2.372 0 4.54-.87 6.165-2.288A9.004 9.004 0 0121 12c0 3.314-1.79 6.188-4.398 7.712A9.004 9.004 0 0112 21c-2.372 0-4.54-.87-6.165-2.288A9.004 9.004 0 003 12c0-3.314 1.79-6.188 4.398-7.712A9.004 9.004 0 005.455 5.455z" /></svg>;

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isCollapsed }) => {
  const navItems = [
    { pageName: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { pageName: 'skills', label: 'Skills Earned', icon: <SkillIcon /> },
    { pageName: 'certificates', label: 'Certificates', icon: <CertificateIcon /> },
    { pageName: 'curriculum', label: 'Curriculum', icon: <CurriculumIcon /> },
  ];

  return (
    <aside className={`flex-shrink-0 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <NavItem key={item.pageName} {...item} currentPage={currentPage} onNavigate={onNavigate} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
