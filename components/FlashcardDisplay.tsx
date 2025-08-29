import React from 'react';
import type { Question } from '../types';
import { QuestionType } from '../types';

interface QuestionDisplayProps {
    questions: Question[];
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questions }) => {
    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Generated Questions</h3>
            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                        <p className="font-semibold text-slate-300 mb-4">
                           <span className="text-blue-400 font-bold mr-2">Q{index + 1}:</span> 
                           {q.question}
                        </p>
                        
                        {q.type === QuestionType.MCQ && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {q.options.map((option, i) => (
                                    <div 
                                        key={i}
                                        className={`
                                            p-3 rounded-md border
                                            ${option === q.answer 
                                                ? 'bg-teal-900/50 border-teal-700 text-teal-300 font-semibold' 
                                                : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                                            }
                                        `}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === QuestionType.TF && (
                            <div className="flex gap-4">
                               <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${q.answer === 'True' ? 'bg-teal-900/50 border border-teal-700 text-teal-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'}`}>
                                 True
                               </span>
                               <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${q.answer === 'False' ? 'bg-teal-900/50 border border-teal-700 text-teal-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'}`}>
                                 False
                               </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};