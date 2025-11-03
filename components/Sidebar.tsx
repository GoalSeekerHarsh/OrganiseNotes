import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M3.27 6.96L12 12l8.73-5.04"></path>
    <path d="M12 22.08V12"></path>
  </svg>
);


interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
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
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isCollapsed ? 'justify-center' : ''
      } ${
        isActive
          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
      }`}
    >
      {icon}
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  );
};

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SkillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m6 0l-3 3M9 12a3 3 0 11-6 0 3 3 0 016 0zm12 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CertificateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const CurriculumIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18M5.455 5.455A9.004 9.004 0 0012 3c2.372 0 4.54-.87 6.165-2.288A9.004 9.004 0 0121 12c0 3.314-1.79 6.188-4.398 7.712A9.004 9.004 0 0112 21c-2.372 0-4.54-.87-6.165-2.288A9.004 9.004 0 003 12c0-3.314 1.79-6.188 4.398-7.712A9.004 9.004 0 005.455 5.455z" /></svg>;

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen }) => {
  const navItems = [
    { pageName: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { pageName: 'skills', label: 'Skills Earned', icon: <SkillIcon /> },
    { pageName: 'certificates', label: 'Certificates', icon: <CertificateIcon /> },
    { pageName: 'curriculum', label: 'Curriculum', icon: <CurriculumIcon /> },
  ];
  
  const isCollapsed = !isOpen;

  return (
    <aside className={`flex-shrink-0 bg-transparent p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm h-full p-4 flex flex-col border border-slate-200 dark:border-slate-700`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'} mb-8 transition-all duration-300`}>
          <LogoIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden">SkillHub</span>
          )}
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map(item => (
            <NavItem key={item.pageName} {...item} currentPage={currentPage} onNavigate={onNavigate} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;