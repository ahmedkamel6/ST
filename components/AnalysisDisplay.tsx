import React from 'react';
import type { AnalysisData } from '../types';

interface AnalysisDisplayProps {
    data: AnalysisData;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center">
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-teal-400">{value}</p>
    </div>
);

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Word Count" value={data.wordCount} />
                <StatCard label="Reading Time" value={`${data.readingTime} min`} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-3">
                    {data.keywords.map((keyword, index) => (
                        <span key={index} className="bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-800">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
};