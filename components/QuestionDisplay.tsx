import React, { useState, useMemo } from 'react';
import type { Question } from '../types';
import { QuestionType } from '../types';
import { Tooltip } from './Tooltip';

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183" />
    </svg>
);

const ButtonSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


interface QuestionDisplayProps {
    questions: Question[];
    onGenerateMore: () => void;
    isGeneratingMore: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questions, onGenerateMore, isGeneratingMore }) => {
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    
    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = useMemo(() => {
        return questions.reduce((count, q) => {
            if (userAnswers[q.id] && userAnswers[q.id] === q.answer) {
                return count + 1;
            }
            return count;
        }, 0);
    }, [userAnswers, questions]);

    const handleAnswerSelect = (questionId: number, selectedOption: string) => {
        if (userAnswers[questionId]) return; // Prevent changing answer
        setUserAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    };

    const resetQuiz = () => {
        setUserAnswers({});
    }

    const getOptionClass = (q: Question, option: string) => {
        const isAnswered = !!userAnswers[q.id];
        if (!isAnswered) {
            return 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/80 hover:border-slate-600 cursor-pointer';
        }
        
        const isCorrectAnswer = option === q.answer;
        const isSelectedAnswer = userAnswers[q.id] === option;

        if (isCorrectAnswer) {
            return 'bg-teal-900/50 border-teal-700 text-teal-300 font-semibold cursor-not-allowed';
        }
        if (isSelectedAnswer && !isCorrectAnswer) {
            return 'bg-red-900/50 border-red-700 text-red-300 font-semibold cursor-not-allowed';
        }
        return 'bg-slate-800/80 border-slate-700/50 text-slate-500 cursor-not-allowed';
    };


    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white">Interactive Quiz</h3>
                    <p className="text-slate-400">Test your knowledge. Your results are private.</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-center bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800 w-full">
                         <p className="text-xs text-slate-400">Score</p>
                         <p className="font-bold text-lg text-white">
                            {correctCount} / {answeredCount}
                         </p>
                    </div>
                     <Tooltip text="Reset Quiz">
                        <button onClick={resetQuiz} className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 transition-all">
                        <p className="font-semibold text-slate-300 mb-4">
                           <span className="text-blue-400 font-bold mr-2">Q{index + 1}:</span> 
                           {q.question}
                        </p>
                        
                        {q.type === QuestionType.MCQ && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {q.options.map((option, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleAnswerSelect(q.id, option)}
                                        disabled={!!userAnswers[q.id]}
                                        className={`p-3 rounded-md border text-start transition-all duration-200 ${getOptionClass(q, option)}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === QuestionType.TF && (
                            <div className="flex gap-4">
                               {['True', 'False'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswerSelect(q.id, option)}
                                        disabled={!!userAnswers[q.id]}
                                        className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${getOptionClass(q, option)}`}
                                    >
                                        {option}
                                    </button>
                               ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
                <button
                    onClick={onGenerateMore}
                    disabled={isGeneratingMore}
                    className="flex items-center justify-center text-base font-semibold text-white bg-blue-600 rounded-md px-6 py-3 transition-all duration-300 transform hover:scale-105 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-blue-500/30"
                >
                    {isGeneratingMore ? (
                        <>
                            <ButtonSpinner />
                            Generating...
                        </>
                    ) : (
                        'Generate More Questions'
                    )}
                </button>
            </div>
        </div>
    );
};