import React, { useState } from 'react';
import { APP_TITLE } from '../constants';
import { useAuth, useLanguage } from './InputSection';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  onLoginClick: () => void;
}

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (lang: 'en' | 'ar') => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Tooltip text="Change language">
                <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0012 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12c0-.778.099-1.533.284-2.253m0 0l-3.95-3.95" />
                    </svg>
                </button>
            </Tooltip>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-50 animate-fadeIn" style={{ animationDuration: '150ms' }}>
                    <button onClick={() => handleLanguageChange('en')} className={`block w-full text-start px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>English</button>
                    <button onClick={() => handleLanguageChange('ar')} className={`block w-full text-start px-4 py-2 text-sm ${language === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>العربية</button>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-slate-950/70 backdrop-blur-lg sticky top-0 z-40 shadow-md shadow-black/20">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="text-3xl font-extrabold text-gradient">
            <a href="#" aria-label="Go to Homepage">
              {APP_TITLE}
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isLoggedIn ? (
              <>
                <span className="text-sm text-slate-300 hidden sm:inline">{t('welcome')}, {user?.name.split(' ')[0]}</span>
                <Tooltip text="Sign out of your account">
                  <button 
                    onClick={logout}
                    className="text-sm font-semibold text-white bg-transparent border-2 border-red-500 rounded-full px-6 py-2 transition-all duration-300 hover:bg-red-500 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
                    {t('logout')}
                  </button>
                </Tooltip>
              </>
            ) : (
              <Tooltip text="Access your account or create a new one">
                <button 
                  onClick={onLoginClick}
                  className="text-sm font-semibold text-white bg-transparent border-2 border-blue-500 rounded-full px-6 py-2 transition-all duration-300 hover:bg-blue-500 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                  {t('loginSignUp')}
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};