import React from 'react';
import { XMarkIcon } from './ResultsSection';
import { Tooltip } from './Tooltip';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <Tooltip text="Close">
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};