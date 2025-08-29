import React, { useState } from 'react';
import { api } from '../services/geminiService';
import { useLanguage } from './InputSection';
import { LoadingSpinner } from './LoadingSpinner';
import { Tooltip } from './Tooltip';

const GlobeAltIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0012 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12c0-.778.099-1.533.284-2.253" />
    </svg>
);

const ArrowUturnLeftIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);

const LANGUAGES = [
    { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'en', name: 'English' },
];

interface SummaryDisplayProps {
  summary: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const { t } = useLanguage();
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  const handleTranslate = async (targetLanguage: string) => {
    setSelectorOpen(false);
    setIsTranslating(true);
    setError(null);
    try {
      const result = await api.translateText(summary, targetLanguage);
      setTranslatedSummary(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('translationFailed');
      setError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleShowOriginal = () => {
    setTranslatedSummary(null);
    setError(null);
  };
  
  const currentSummary = translatedSummary ?? summary;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-2xl font-bold text-white">{t('summary')}</h3>
        
        <div className="relative">
          {translatedSummary ? (
            <Tooltip text={t('showOriginal')}>
              <button onClick={handleShowOriginal} className="flex items-center gap-2 text-sm font-semibold text-slate-300 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 transition-colors hover:bg-slate-700/80 hover:text-white">
                <ArrowUturnLeftIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip text={t('translate')}>
              <button onClick={() => setSelectorOpen(!isSelectorOpen)} className="flex items-center gap-2 text-sm font-semibold text-slate-300 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-2 transition-colors hover:bg-slate-700/80 hover:text-white">
                <GlobeAltIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t('translate')}</span>
              </button>
            </Tooltip>
          )}

          {isSelectorOpen && (
            <div className="absolute end-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10 animate-fadeIn" style={{ animationDuration: '150ms' }}>
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800">{t('selectLanguage')}</p>
              {LANGUAGES.map(lang => (
                <button 
                  key={lang.code} 
                  onClick={() => handleTranslate(lang.name)} 
                  className="block w-full text-start px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isTranslating && (
        <div className="flex flex-col justify-center items-center gap-3 py-10">
            <LoadingSpinner />
            <p className="text-slate-400">{t('translating')}</p>
        </div>
      )}
      
      {error && !isTranslating && (
           <div className="text-center text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg p-4">
             <p>{error}</p>
           </div>
        )}

      {!isTranslating && (
        <div className="text-slate-300 leading-relaxed space-y-4 prose prose-invert max-w-none prose-p:my-2">
          {currentSummary.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};