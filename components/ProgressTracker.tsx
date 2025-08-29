import React from 'react';

export const ProgressTracker: React.FC = () => {
    return (
        <div className="space-y-6 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-blue-900/50 border-2 border-blue-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Progress Tracker Coming Soon!</h3>
            <p className="max-w-xl text-slate-400">
                Soon, you'll be able to track your completed sessions, see your quiz scores over time, and watch your study habits improve right here.
            </p>
        </div>
    );
};
