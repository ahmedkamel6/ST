import React, { useState } from 'react';
import type { ProcessedData } from '../types';
import { SummaryDisplay } from './SummaryDisplay';
import { QuestionDisplay } from './QuestionDisplay';
import { MindMapDisplay } from './MindMapDisplay';
import { AnalysisDisplay } from './AnalysisDisplay';
import { generatePdf } from '../services/pdfGenerator';
import { Tooltip } from './Tooltip';
import { FlashcardModeDisplay } from './FlashcardModeDisplay';
import { NotesSection } from './NotesSection';
import { ShareSection } from './ShareSection';
import { ProgressTracker } from './ProgressTracker';
import { useLanguage } from './InputSection';

interface ResultsSectionProps {
  data: ProcessedData;
  onNotesChange: (notes: string) => void;
  onGenerateMoreQuestions: () => void;
  isGeneratingMore: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ data, onNotesChange, onGenerateMoreQuestions, isGeneratingMore }) => {
    const { t } = useLanguage();
    const [activeSectionKey, setActiveSectionKey] = useState<string>('Summary');

    const handleDownloadPdf = () => {
      generatePdf(data, data.notes || '');
    }

    const sections = [
      { key: 'Summary', title: t('summary'), component: <SummaryDisplay summary={data.summary} /> },
      { key: 'Questions', title: t('questions'), component: <QuestionDisplay questions={data.questions} onGenerateMore={onGenerateMoreQuestions} isGeneratingMore={isGeneratingMore} /> },
      { key: 'Flashcards', title: t('flashcards'), component: <FlashcardModeDisplay questions={data.questions} /> },
      { key: 'Mind Map', title: t('mindMap'), component: <MindMapDisplay rootNode={data.mindMap} /> },
      { key: 'Analysis', title: t('analysis'), component: <AnalysisDisplay data={data.analysis} /> },
      { key: 'Notes', title: t('notes'), component: <NotesSection notes={data.notes || ''} onNotesChange={onNotesChange} /> },
      { key: 'Progress', title: t('progress'), component: <ProgressTracker /> },
      { key: 'Share', title: t('share'), component: <ShareSection /> },
    ];
    
    const activeSection = sections.find(s => s.key === activeSectionKey);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                 <h2 className="text-3xl font-bold text-gradient">Analysis Results</h2>
                 <Tooltip text="Download a comprehensive PDF report of the analysis.">
                  <button
                      onClick={handleDownloadPdf}
                      className="text-sm font-semibold text-white bg-teal-600 rounded-full px-5 py-2.5 transition-all duration-300 transform hover:scale-105 hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50 flex-shrink-0"
                  >
                     {t('downloadPdf')}
                  </button>
                </Tooltip>
            </div>
            
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/50 border border-slate-800 rounded-lg">
              {sections.map(section => (
                <button
                  key={section.key}
                  onClick={() => setActiveSectionKey(section.key)}
                  className={`flex-grow px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${activeSectionKey === section.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60'
                    }`
                  }
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 md:p-8 min-h-[400px] animate-fadeIn" style={{ animationDuration: '400ms' }}>
              {activeSection ? activeSection.component : <p>Select a section to view.</p>}
            </div>
        </div>
    );
};


// --- SHARED ICONS ---
// (Kept in this file to satisfy file update constraints)

export const CodeBracketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);
export const CircleStackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
  </svg>
);
export const CommandLineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
export const RocketLaunchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a6 6 0 01-2.56 5.84m-2.56-5.84a6 6 0 017.38-5.84m-7.38 5.84L5.63 21m9.96-6.63l2.56-2.56a6 6 0 00-5.84-7.38m-7.38 5.84a6 6 0 005.84 2.56" />
  </svg>
);
export const PaintBrushIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.62-3.385m0 0a15.998 15.998 0 013.388-1.62m-5.043-.025a15.998 15.998 0 00-3.388-1.622m0 0a15.998 15.998 0 01-3.388 1.622m5.043.025a15.998 15.998 0 01-1.622 3.385" />
  </svg>
);
export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
  </svg>
);
export const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
export const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868 4.66 4.66 0 0 0 1.447 6.212 4.623 4.623 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.738 4.566 4.621 4.621 0 0 1-2.104.08 4.662 4.662 0 0 0 4.35 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.455 9.455 0 0 0 2.323-2.41l.002-.003z"></path></svg>
);
export const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg>
);
export const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
);
export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);
export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
export const ArrowsPointingOutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);