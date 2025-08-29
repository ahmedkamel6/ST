import type { Page, Service, Project, BlogPost } from "./types";
import { CodeBracketIcon, CircleStackIcon, CommandLineIcon, RocketLaunchIcon, PaintBrushIcon, ShieldCheckIcon } from './components/ResultsSection';

export const APP_TITLE = "ST";
export const FOOTER_TEXT = `© ${new Date().getFullYear()} ${APP_TITLE}. All Rights Reserved.`;

export const NAV_LINKS: Page[] = ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'];

export const MOTIVATIONAL_QUOTES = [
    "The secret to getting ahead is getting started.",
    "Believe you can and you're halfway there.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The expert in anything was once a beginner.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Well done is better than well said.",
    "Keep going, you’re closer than you think!",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The only way to do great work is to love what you do."
];

export const translations = {
    en: {
        // Header
        welcome: "Welcome",
        logout: "Logout",
        loginSignUp: "Login / Sign Up",
        // Main page
        mainHeading: "Your Personal Study Companion",
        subHeading: "Paste your academic text or upload a file (PDF, DOCX, TXT) to generate summaries, questions, flashcards, mind maps, and more. Let's make studying smarter.",
        // Input section
        inputTextareaPlaceholder: "Paste your academic text here...",
        dropzoneText: "Or, drop files here (.txt, .pdf, .docx), or",
        browse: "browse to upload",
        processButton: "Process Content",
        processingButton: "Processing...",
        parsingFile: "Reading file(s)...",
        uploadedFiles: "Uploaded Files",
        removeFile: "Remove file",
        // Difficulty
        difficulty: "Difficulty",
        Easy: "Easy",
        Medium: "Medium",
        Hard: "Hard",
        // Loading/Error
        thinkingMessage: "Your assistant is thinking, please wait...",
        processingFailed: "Processing Failed",
        fileSupportError: "File type not supported. Please use .txt, .pdf, or .docx.",
        fileReadError: "Error reading file. Please ensure it's not corrupted.",
        // Results Tabs
        summary: "Summary",
        questions: "Questions",
        flashcards: "Flashcards",
        mindMap: "Mind Map",
        analysis: "Analysis",
        notes: "Notes",
        progress: "Progress",
        share: "Share",
        downloadPdf: "Download PDF",
        // Translation
        translate: "Translate",
        translating: "Translating...",
        translationFailed: "Translation failed. Please try again.",
        showOriginal: "Show Original",
        selectLanguage: "Select Language",
    },
    ar: {
        // Header
        welcome: "أهلاً",
        logout: "تسجيل الخروج",
        loginSignUp: "تسجيل الدخول / إنشاء حساب",
        // Main page
        mainHeading: "رفيقك الدراسي الشخصي",
        subHeading: "الصق نصك الأكاديمي أو قم بتحميل ملف (PDF, DOCX, TXT) لإنشاء ملخصات وأسئلة وبطاقات تعليمية وخرائط ذهنية والمزيد. لنجعل الدراسة أذكى.",
        // Input section
        inputTextareaPlaceholder: "الصق نصك الأكاديمي هنا...",
        dropzoneText: "أو، اسحب الملفات إلى هنا (.txt, .pdf, .docx)، أو",
        browse: "تصفح للتحميل",
        processButton: "معالجة المحتوى",
        processingButton: "جاري المعالجة...",
        parsingFile: "جاري قراءة الملفات...",
        uploadedFiles: "الملفات المرفوعة",
        removeFile: "إزالة الملف",
        // Difficulty
        difficulty: "مستوى الصعوبة",
        Easy: "سهل",
        Medium: "متوسط",
        Hard: "صعب",
        // Loading/Error
        thinkingMessage: "مساعدك يفكر، يرجى الانتظار...",
        processingFailed: "فشلت المعالجة",
        fileSupportError: "نوع الملف غير مدعوم. يرجى استخدام .txt أو .pdf أو .docx.",
        fileReadError: "خطأ في قراءة الملف. يرجى التأكد من أنه غير تالف.",
        // Results Tabs
        summary: "الملخص",
        questions: "الأسئلة",
        flashcards: "بطاقات تعليمية",
        mindMap: "خريطة ذهنية",
        analysis: "تحليل",
        notes: "ملاحظات",
        progress: "التقدم",
        share: "مشاركة",
        downloadPdf: "تحميل PDF",
        // Translation
        translate: "ترجمة",
        translating: "جاري الترجمة...",
        translationFailed: "فشلت الترجمة. يرجى المحاولة مرة أخرى.",
        showOriginal: "عرض النص الأصلي",
        selectLanguage: "اختر لغة",
    }
};

export const SERVICES_DATA: Service[] = [
  {
    id: 1,
    icon: CodeBracketIcon,
    title: "Web Development",
    description: "Creating responsive, high-performance websites with modern technologies."
  },
  {
    id: 2,
    icon: CircleStackIcon,
    title: "Backend Systems",
    description: "Building secure and scalable server-side applications and APIs."
  },
  {
    id: 3,
    icon: CommandLineIcon,
    title: "DevOps & Deployment",
    description: "Automating workflows and managing cloud infrastructure for seamless deployment."
  },
  {
    id: 4,
    icon: RocketLaunchIcon,
    title: "Performance Optimization",
    description: "Enhancing application speed and reliability for a better user experience."
  },
   {
    id: 5,
    icon: PaintBrushIcon,
    title: "UI/UX Design",
    description: "Designing intuitive and visually appealing user interfaces."
  },
   {
    id: 6,
    icon: ShieldCheckIcon,
    title: "Security Auditing",
    description: "Identifying and mitigating security vulnerabilities in your applications."
  }
];

export const PORTFOLIO_DATA: Project[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    title: "Project Alpha",
    category: "Web Development",
    description: "A comprehensive analytics dashboard for a major tech client."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop",
    title: "Project Beta",
    category: "Backend Systems",
    description: "A scalable e-commerce platform with a custom payment gateway integration."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=800&auto=format&fit=crop",
    title: "Project Gamma",
    category: "UI/UX Design",
    description: "A mobile-first social networking app designed for creative professionals."
  },
   {
    id: 4,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop",
    title: "Project Delta",
    category: "Web Development",
    description: "Corporate website redesign for a fintech startup, focusing on performance."
  }
];

export const BLOG_DATA: BlogPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    date: "October 26, 2024",
    title: "The Future of Backend Development",
    excerpt: "Exploring the trends and technologies shaping the future of server-side applications."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=800&auto=format&fit=crop",
    date: "October 15, 2024",
    title: "Designing for Accessibility",
    excerpt: "Practical tips and best practices for creating inclusive and accessible web experiences."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1516116216624-53e6973bea99?q=80&w=800&auto=format&fit=crop",
    date: "September 28, 2024",
    title: "A Guide to Modern DevOps",
    excerpt: "Understanding the principles of DevOps and how to implement them effectively."
  }
];