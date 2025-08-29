import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputSection, useLanguage } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { AuthModal } from './components/ThemeToggleButton';
import { LoadingSpinner } from './components/LoadingSpinner';
import { api } from './services/geminiService';
import type { ProcessedData, Difficulty } from './types';

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? 'bg-teal-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg animate-fadeIn z-50`}>
      {message}
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const [mcqCount, setMcqCount] = useState(3);
  const [tfCount, setTfCount] = useState(2);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');


  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleProcessContent = async (text: string, files: File[], pageRange: string) => {
    setIsLoading(true);
    setError(null);
    setProcessedData(null);
    
    try {
      let combinedText = text.trim();
      if (files.length > 0) {
        const filesText = await api.parseFiles(files, pageRange);
        combinedText = combinedText ? `${combinedText}\n\n--- (Uploaded Content) ---\n\n${filesText}` : filesText;
      }
      
      if (!combinedText) {
        showToast("Please enter some text or upload a file to process.", "error");
        setIsLoading(false);
        return;
      }

      setOriginalText(combinedText);
      const data = await api.processContent(combinedText, { mcq: mcqCount, tf: tfCount, difficulty });
      setProcessedData({ ...data, notes: '' }); // Initialize with empty notes
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred processing your request with the AI. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateMoreQuestions = async () => {
    if (!originalText || !processedData) return;

    setIsGeneratingMore(true);
    setError(null);
    try {
      const newQuestions = await api.generateMoreQuestions(originalText, processedData.questions);
      
      const questionsWithIds = newQuestions.map((q, index) => ({
        ...q,
        id: processedData.questions.length + index + 1,
      }));

      setProcessedData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          questions: [...prevData.questions, ...questionsWithIds],
        };
      });
      showToast("Generated 5 new questions!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred while generating more questions.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsGeneratingMore(false);
    }
  };


  const handleNotesChange = (notes: string) => {
    if (processedData) {
      setProcessedData(prevData => prevData ? { ...prevData, notes } : null);
    }
  };


  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <Header 
        onLoginClick={() => setAuthModalOpen(true)}
      />
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            <span className="text-gradient">{t('mainHeading')}</span>
        </h1>
        <p className="max-w-3xl text-center mx-auto text-lg text-slate-300 mb-12">
            {t('subHeading')}
        </p>
        
        <InputSection 
          onProcess={handleProcessContent} 
          isLoading={isLoading} 
          showToast={showToast}
          mcqCount={mcqCount}
          setMcqCount={setMcqCount}
          tfCount={tfCount}
          setTfCount={setTfCount}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        {isLoading && (
          <div className="mt-12 flex flex-col justify-center items-center gap-4">
            <LoadingSpinner />
            <p className="text-slate-400">{t('thinkingMessage')}</p>
          </div>
        )}
        
        {error && !isLoading && (
           <div className="mt-12 text-center text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg p-6">
             <h3 className="font-bold text-lg mb-2">{t('processingFailed')}</h3>
             <p>{error}</p>
           </div>
        )}

        {processedData && !isLoading && (
          <div className="mt-12 animate-fadeIn">
            <ResultsSection 
              data={processedData} 
              onNotesChange={handleNotesChange}
              onGenerateMoreQuestions={handleGenerateMoreQuestions}
              isGeneratingMore={isGeneratingMore}
            />
          </div>
        )}

      </main>
      <Footer />
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setAuthModalOpen(false)}
          showToast={showToast}
        />
      )}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;