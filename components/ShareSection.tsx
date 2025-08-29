import React from 'react';

export const ShareSection: React.FC = () => {
    
    const handleAction = (action: string) => {
        alert(`${action} functionality is coming soon!`);
    }

    return (
        <div className="space-y-6 text-center flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white">Share & Export</h3>
            <p className="max-w-xl text-slate-400">
                Collaborate with classmates by sharing a unique link to this study session, or export your materials in different formats.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 w-full max-w-2xl">
                <button
                    onClick={() => handleAction('Copy Link')} 
                    className="p-6 bg-slate-800/70 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-blue-500 transition-all text-white font-semibold"
                >
                    Copy Link
                </button>
                <button
                    onClick={() => handleAction('Export as DOCX')} 
                    className="p-6 bg-slate-800/70 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-blue-500 transition-all text-white font-semibold"
                >
                    Export as DOCX
                </button>
                 <button
                    onClick={() => handleAction('Export as HTML')} 
                    className="p-6 bg-slate-800/70 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-blue-500 transition-all text-white font-semibold"
                >
                    Export Mind Map (HTML)
                </button>
            </div>
        </div>
    );
};
