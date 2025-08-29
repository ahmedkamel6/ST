import type React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<void>;
}

export type Language = 'en' | 'ar';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export enum QuestionType {
  MCQ = 'Multiple Choice',
  TF = 'True/False',
}

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ
  answer: string;
}

export interface MindMapNode {
  id: number;
  text: string;
  children?: MindMapNode[];
}

export interface AnalysisData {
  wordCount: number;
  readingTime: number; // in minutes
  keywords: string[];
}

export interface ProcessedData {
  summary: string;
  questions: Question[];
  mindMap: MindMapNode;
  analysis: AnalysisData;
  notes?: string;
}

// Fix: Add missing type definitions for constants.ts
export type Page = string;

export interface Service {
  id: number;
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

export interface Project {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
}

export interface BlogPost {
  id: number;
  image: string;
  date: string;
  title: string;
  excerpt: string;
}
