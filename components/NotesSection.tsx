import React from 'react';

interface NotesSectionProps {
    notes: string;
    onNotesChange: (notes: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes, onNotesChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Personal Notes</h3>
            <p className="text-slate-400">
                Use this space to jot down your thoughts, questions, or connections you've made. These notes will be saved with your report.
            </p>
            <div>
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Start writing your notes here..."
                    className="w-full h-96 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Personal notes section"
                />
            </div>
        </div>
    )
};
