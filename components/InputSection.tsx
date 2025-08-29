import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { api } from '../services/geminiService';
import type { User, AuthContextType, Language, LanguageContextType, Difficulty } from '../types';
import { translations } from '../constants';
import { TrashIcon } from './ResultsSection';
import { Tooltip } from './Tooltip';

// --- LANGUAGE CONTEXT ---
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// --- AUTH CONTEXT ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('st_user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const login = async (email: string, pass: string) => {
        const userData = await api.login(email, pass);
        localStorage.setItem('st_user', JSON.stringify(userData));
        setUser(userData);
    };

    const signup = async (name: string, email: string, pass: string) => {
        const userData = await api.signup(name, email, pass);
        localStorage.setItem('st_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('st_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// --- ICONS ---
const FileIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);


// --- INPUTSECTION UI COMPONENT ---

interface InputSectionProps {
    onProcess: (text: string, files: File[], pageRange: string) => void;
    isLoading: boolean;
    showToast: (message: string, type: 'success' | 'error') => void;
    mcqCount: number;
    setMcqCount: (count: number) => void;
    tfCount: number;
    setTfCount: (count: number) => void;
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onProcess, isLoading, showToast, mcqCount, setMcqCount, tfCount, setTfCount, difficulty, setDifficulty }) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [pageRange, setPageRange] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const { t } = useLanguage();

    const hasPdf = useMemo(() => files.some(f => f.type === 'application/pdf'), [files]);

    const handleFileProcessing = (newFiles: FileList | null) => {
        if (!newFiles) return;
        setFiles(prev => [...prev, ...Array.from(newFiles)]);
    };
    
    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files?.length) {
            handleFileProcessing(event.dataTransfer.files);
        }
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    
    const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFileProcessing(event.target.files);
            event.target.value = ''; 
        }
    };
    
    const isDisabled = isLoading;
    const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

    return (
        <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('inputTextareaPlaceholder')}
                    className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-base p-4 transition-colors"
                    disabled={isDisabled}
                />
                
                <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className={`
                        border-2 border-dashed border-slate-700 rounded-lg p-8 text-center
                        transition-colors duration-300 relative
                        ${isDragging ? 'border-blue-500 bg-slate-800/50' : ''}
                    `}
                >
                   <p className="text-slate-400">{t('dropzoneText')}{' '}
                    <label htmlFor="file-upload" className="font-semibold text-blue-400 hover:text-blue-300 cursor-pointer underline underline-offset-2">
                        {t('browse')}
                    </label>
                   </p>
                    <input id="file-upload" type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={handleFileChange} disabled={isDisabled} multiple/>
                </div>
            </div>


            {files.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 animate-fadeIn" style={{animationDuration: '300ms'}}>
                     <h3 className="text-sm font-semibold text-slate-300 mb-3">{t('uploadedFiles')}</h3>
                     <div className="space-y-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md">
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <span className="text-sm text-slate-200 truncate" title={file.name}>{file.name}</span>
                                </div>
                                <Tooltip text={t('removeFile')}>
                                    <button onClick={() => removeFile(index)} disabled={isDisabled} className="text-slate-500 hover:text-red-400 disabled:opacity-50 flex-shrink-0 ml-2">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </Tooltip>
                            </div>
                        ))}
                     </div>
                </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Customization Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label htmlFor="mcq-count" className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
                            <span>Multiple Choice Questions</span>
                            <span className="font-bold text-blue-400 bg-slate-800 px-2 py-0.5 rounded-md">{mcqCount}</span>
                        </label>
                        <input
                            type="range"
                            id="mcq-count"
                            min="0"
                            max="50"
                            value={mcqCount}
                            onChange={(e) => setMcqCount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            disabled={isDisabled}
                        />
                    </div>
                    <div>
                        <label htmlFor="tf-count" className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
                            <span>True/False Questions</span>
                             <span className="font-bold text-blue-400 bg-slate-800 px-2 py-0.5 rounded-md">{tfCount}</span>
                        </label>
                        <input
                            type="range"
                            id="tf-count"
                            min="0"
                            max="50"
                            value={tfCount}
                            onChange={(e) => setTfCount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            disabled={isDisabled}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-center text-sm font-medium text-slate-300 mb-3">{t('difficulty')}</label>
                    <div className="flex justify-center bg-slate-800/70 rounded-lg p-1">
                        {difficulties.map(level => (
                             <button 
                                key={level}
                                onClick={() => setDifficulty(level)}
                                disabled={isDisabled}
                                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                                    ${difficulty === level 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-slate-300 hover:bg-slate-700/60'
                                    }`}
                            >
                                {t(level)}
                            </button>
                        ))}
                    </div>
                </div>
                {hasPdf && (
                    <div className="mt-6 animate-fadeIn" style={{animationDuration: '300ms'}}>
                         <label htmlFor="page-range" className="block text-center text-sm font-medium text-slate-300 mb-2">Page Range (for PDFs)</label>
                         <input
                            type="text"
                            id="page-range"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            placeholder="e.g., 1-5, 8, 10-12"
                            className="w-full max-w-sm mx-auto bg-slate-800/70 border border-slate-700 rounded-md p-2 text-sm text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            disabled={isDisabled}
                         />
                    </div>
                )}
            </div>

            <button
                onClick={() => onProcess(text, files, pageRange)}
                disabled={isDisabled || (!text.trim() && files.length === 0)}
                className="w-full text-lg font-semibold text-white bg-blue-600 rounded-md px-8 py-4 transition-all duration-300 transform hover:scale-105 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-blue-500/30"
            >
                {isLoading ? t('processingButton') : t('processButton')}
            </button>
        </div>
    );
};