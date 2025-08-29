import React, { useState, useMemo } from 'react';
import type { Question } from '../types';

export const FlashcardModeDisplay: React.FC<{ questions: Question[] }> = ({ questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

    const goToNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
    };

    const goToPrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            setIsFlipped(f => !f);
        } else if (event.key === 'ArrowRight') {
            goToNext();
        } else if (event.key === 'ArrowLeft') {
            goToPrev();
        }
    };
    
    if (!questions || questions.length === 0) {
        return (
            <div className="text-center text-slate-400">
                <p>No questions available to generate flashcards.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white">Flashcards</h3>

            <div className="w-full max-w-2xl h-80 [perspective:1000px]">
                <div 
                    className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900/50 focus:ring-blue-500 rounded-lg ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label="Flashcard. Press Space or Enter to flip. Use arrow keys to navigate."
                >
                    {/* Front of Card */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] bg-slate-800 border-2 border-blue-600 rounded-lg flex flex-col justify-center items-center p-6 text-center shadow-lg">
                        <p className="text-sm text-slate-400 mb-2">Question {currentIndex + 1} of {questions.length}</p>
                        <p className="text-xl font-semibold text-slate-100">{currentQuestion.question}</p>
                        <span className="absolute bottom-4 text-xs text-slate-500">Click or press Space/Enter to flip</span>
                    </div>

                    {/* Back of Card */}
                     <div className="absolute w-full h-full [backface-visibility:hidden] rotate-y-180 bg-slate-800 border-2 border-teal-500 rounded-lg flex flex-col justify-center items-center p-6 text-center shadow-lg">
                         <p className="text-sm text-slate-400 mb-2">Answer</p>
                         <p className="text-2xl font-bold text-teal-300">{currentQuestion.answer}</p>
                         {currentQuestion.options && (
                             <div className="mt-4 text-xs text-slate-400">
                                 Options were: {currentQuestion.options.join(', ')}
                            </div>
                         )}
                         <span className="absolute bottom-4 text-xs text-slate-500">Click or press Space/Enter to flip</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm font-medium text-slate-300">{currentIndex + 1} / {questions.length}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6">
                <button onClick={goToPrev} className="px-6 py-2 bg-slate-700/80 hover:bg-slate-700 text-white font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
                    Previous
                </button>
                <button onClick={goToNext} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Next
                </button>
            </div>
        </div>
    );
};