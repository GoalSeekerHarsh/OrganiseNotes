import React, { useState } from 'react';
import { loginOrRegisterUser } from '../services/userService';
import type { UserData } from '../App';

interface LoginProps {
  onLogin: (userData: UserData) => void;
}

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

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentEmail = e.target.value;
    const trimmedEmail = currentEmail.trim().toLowerCase();
    setEmail(currentEmail);
    
    try {
        const users = JSON.parse(localStorage.getItem('skillhub_users') || '{}');
        if (trimmedEmail.endsWith('@iiserb.ac.in') && !users[trimmedEmail]) {
            setIsNewUser(true);
        } else {
            setIsNewUser(false);
        }
    } catch (e) {
        // In case localStorage is corrupt, default to not a new user
        setIsNewUser(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password.trim()) {
      setError('Please enter both Email and Password.');
      return;
    }

    if (!trimmedEmail.toLowerCase().endsWith('@iiserb.ac.in')) {
      setError('Invalid email. Please use your official @iiserb.ac.in address.');
      return;
    }

    setError('');
    
    const user = loginOrRegisterUser(trimmedEmail, password);

    if (user) {
        onLogin({ profile: user.profile, documents: user.documents });
    } else {
        setError('Incorrect password. Please try again.');
        setIsNewUser(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in-down">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
             <LogoIcon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
             <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">SkillHub</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Student Document Organiser</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isNewUser && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-center">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Welcome! It looks like you're new here. We'll create an account for you.
              </p>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              IISERB Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="student@iiserb.ac.in"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-800"
            >
              {isNewUser ? 'Register & Sign In' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;