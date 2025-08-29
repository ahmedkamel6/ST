import { GoogleGenAI } from "@google/genai";
import type { User, ProcessedData, Question, Difficulty, MindMapNode } from '../types';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set workerSrc for pdfjs from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

// --- FILE PARSERS ---

const parsePageRanges = (ranges: string): Set<number> => {
    const pageNumbers = new Set<number>();
    if (!ranges) return pageNumbers;

    const parts = ranges.split(',').map(part => part.trim());
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim(), 10));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    pageNumbers.add(i);
                }
            }
        } else {
            const pageNum = parseInt(part, 10);
            if (!isNaN(pageNum)) {
                pageNumbers.add(pageNum);
            }
        }
    }
    return pageNumbers;
};


const parseTxt = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(new Error("Error reading text file."));
        reader.readAsText(file);
    });
};

const parseDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

const parsePdf = async (file: File, pageRanges?: string): Promise<string> => {
    const pagesToInclude = pageRanges ? parsePageRanges(pageRanges) : null;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let textContent = '';

    const pagesToProcess = pagesToInclude
        ? Array.from(pagesToInclude).filter(p => p > 0 && p <= pdf.numPages)
        : Array.from({ length: pdf.numPages }, (_, i) => i + 1);

    pagesToProcess.sort((a, b) => a - b);

    for (const pageNum of pagesToProcess) {
        const page = await pdf.getPage(pageNum);
        const text = await page.getTextContent();
        textContent += text.items.map((s: any) => s.str).join(' ') + '\n\n';
    }
    return textContent;
};


const parseSingleFile = (file: File, pageRanges?: string): Promise<string> => {
    if (file.type === 'text/plain') {
        return parseTxt(file);
    }
    if (file.type === 'application/pdf') {
        return parsePdf(file, pageRanges);
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return parseDocx(file);
    }
    return Promise.reject(new Error(`File type for ${file.name} not supported. Please use .txt, .pdf, or .docx.`));
};

export const parseFiles = async (files: File[], pageRanges?: string): Promise<string> => {
    const allTextPromises = files.map(file => parseSingleFile(file, pageRanges));
    const allTexts = await Promise.all(allTextPromises);
    return allTexts.join('\n\n---\n\n');
};


// --- MOCK DATABASE FOR AUTH ---
let users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@st.com', role: 'admin' },
    { id: '2', name: 'Regular User', email: 'user@st.com', role: 'user' },
];

// --- GEMINI API SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const cleanMindMapData = (node: MindMapNode): MindMapNode => {
    const trimmedText = node.text.trim();
    const cleanedNode = { ...node, text: trimmedText };

    if (cleanedNode.children) {
        const seenTexts = new Set<string>();
        const uniqueChildren: MindMapNode[] = [];
        for (const child of cleanedNode.children) {
            const cleanedChild = cleanMindMapData(child); // Recurse
            if (cleanedChild.text && !seenTexts.has(cleanedChild.text)) {
                seenTexts.add(cleanedChild.text);
                uniqueChildren.push(cleanedChild);
            }
        }
        cleanedNode.children = uniqueChildren.length > 0 ? uniqueChildren : undefined;
    }
    return cleanedNode;
};

const processWithGemini = async (text: string, options: { mcq: number; tf: number; difficulty: Difficulty }): Promise<Omit<ProcessedData, 'notes'>> => {
    const model = 'gemini-2.5-flash';
    const totalQuestions = options.mcq + options.tf;
    
    const prompt = `
        As an expert academic assistant, analyze the following text for a student. The student has requested a difficulty level of "${options.difficulty}". 
        Your analysis must reflect this difficulty in all generated content (summary, questions, mind map), aiming for deep, insightful, and context-aware results.

        - For 'Easy': Provide a straightforward, concise summary. Questions should be simple, recall-based. The mind map should cover only high-level topics.
        - For 'Medium': Provide a more detailed summary that connects a few key ideas. Questions should require some inference and understanding of relationships between concepts. The mind map should have a balanced structure with main topics and key sub-points.
        - For 'Hard': Provide an in-depth, analytical summary that synthesizes information and highlights nuances. Questions should be complex, requiring critical thinking, analysis, and application of concepts. The mind map must be detailed and multi-level, showing intricate relationships.

        IMPORTANT: Always align the generated content's difficulty with the intrinsic complexity of the source text. If the text is simple, a "Hard" request should still produce questions appropriate to that text, but framed to be as challenging as possible (e.g., asking for implications or connections beyond the text).

        Your output MUST be a single, valid JSON object. Do not include any text, markdown, or explanations outside of the JSON object.
        The entire JSON output, including all text, MUST be in the same language as the provided academic text.

        JSON Structure Requirements:
        1.  "summary": A well-structured summary reflecting the chosen difficulty. Use newline characters (\\n) for paragraphs and prefix bullet points with "- ".
        2.  "questions": An array of exactly ${totalQuestions} questions. This array MUST contain ${options.mcq} 'Multiple Choice' questions and ${options.tf} 'True/False' questions. If the total is 0, this MUST be an empty array.
            - For 'Multiple Choice' questions, you MUST provide exactly four "options" in an array. The "answer" must be one of the provided options.
            - For all questions, provide "type", "question", and "answer".
        3.  "mindMap": A hierarchical mind map of key concepts reflecting the chosen difficulty. The root node must be the main topic. Each node must have a unique integer "id", a "text" label, and an optional "children" array of nodes.
        4.  "analysis": An object containing a "keywords" field, which MUST be an array of the 5-7 most important keywords from the text.

        Academic Text (a combination of pasted text and uploaded files):
        ---
        ${text}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const jsonStr = response.text;
        const result = JSON.parse(jsonStr);

        // Client-side calculations and data massaging
        const wordCount = text.trim().split(/\s+/).length;
        if (!result.analysis) result.analysis = {};
        result.analysis.wordCount = wordCount;
        result.analysis.readingTime = Math.ceil(wordCount / 200);

        if (result.questions) {
            result.questions.forEach((q: any, index: number) => {
                q.id = index + 1;
            });
        }
        
        if (result.mindMap) {
            result.mindMap = cleanMindMapData(result.mindMap);
        }

        if (!result.mindMap || !result.mindMap.id) {
           throw new Error("Mind map data from AI is incomplete or missing a root ID.");
        }
        
        if (totalQuestions === 0 && !result.questions) {
            result.questions = [];
        }

        return result;

    } catch (e: any) {
        console.error("Error processing with Gemini:", e);
        if (e.message.includes("JSON")) {
            throw new Error("The AI returned an invalid response format. Please try again.");
        }
        throw new Error(`An error occurred while communicating with the AI: ${e.message}`);
    }
};

const generateMoreQuestionsWithGemini = async (text: string, existingQuestions: Question[]): Promise<Question[]> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Based on the provided academic text, generate 5 new and distinct questions (a mix of 'Multiple Choice' and 'True/False').
        These questions should not repeat the concepts or phrasing of the following existing questions.

        Your output MUST be a single, valid JSON array of question objects. Do not include any text, markdown, or explanations outside of the JSON array.
        Each object in the array must have "type", "question", and "answer". For 'Multiple Choice' questions, also include an "options" array of exactly four strings.
        The entire JSON output, including all text, MUST be in the same language as the provided academic text.

        Existing Questions to Avoid:
        ${JSON.stringify(existingQuestions, null, 2)}
        
        Academic Text:
        ---
        ${text}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        const jsonStr = response.text;
        return JSON.parse(jsonStr);
    } catch (e: any) {
        console.error("Error generating more questions:", e);
        throw new Error("Failed to generate additional questions from the AI.");
    }
};

const translateTextWithGemini = async (text: string, targetLanguage: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
        As an expert linguist and translator, provide a precise and high-quality translation of the following text into ${targetLanguage}.

        **Instructions:**
        1.  **Accuracy:** Translate the text with the highest possible fidelity to the original meaning. Do not add or omit information.
        2.  **Tone and Style:** Maintain the original tone (e.g., academic, formal, informal).
        3.  **Formatting:** Preserve the original structure, including paragraphs (separated by newlines), bullet points (starting with "- "), and any other formatting cues.
        4.  **Output:** Provide ONLY the translated text, with no additional commentary, introductions, or explanations.

        **Text to Translate:**
        ---
        ${text}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (e: any) {
        console.error("Error translating with Gemini:", e);
        throw new Error(`An error occurred while communicating with the AI for translation: ${e.message}`);
    }
};


// --- MOCK AUTH AND API WRAPPER ---
export const api = {
    // Auth
    login: async (email: string, pass: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.email === email);
                if (user && pass === 'password') { // Mock password check
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password.'));
                }
            }, 500);
        });
    },

    signup: async (name: string, email: string, pass: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (users.some(u => u.email === email)) {
                    reject(new Error('An account with this email already exists.'));
                    return;
                }
                const newUser: User = { id: String(users.length + 1), name, email, role: 'user' };
                users.push(newUser);
                resolve(newUser);
            }, 500);
        });
    },

    submitContactForm: async (data: { name: string; email: string; message: string }): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Form submitted:", data);
                resolve();
            }, 500);
        });
    },
    
    // File Parsing
    parseFiles: parseFiles,

    // Gemini
    processContent: processWithGemini,
    generateMoreQuestions: generateMoreQuestionsWithGemini,
    translateText: translateTextWithGemini,
};