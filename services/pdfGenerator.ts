// Fix: Use named import for jsPDF for better module resolution with augmentation.
import { jsPDF } from 'jspdf';
// Fix: Import jspdf-autotable for its side-effect to augment jsPDF.
import 'jspdf-autotable';
import type { ProcessedData, MindMapNode, Question } from '../types';
import { QuestionType } from '../types';
import { MOTIVATIONAL_QUOTES } from '../constants';

// Augment jsPDF interface for autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePdf = (data: ProcessedData, notes: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

    // --- HELPER FUNCTIONS ---
    const addCoverPage = () => {
        const gradient = doc.context2d.createLinearGradient(0, 0, 0, pageHeight);
        gradient.addColorStop(0, '#020617'); // slate-950
        gradient.addColorStop(1, '#01322a'); // dark green
        doc.context2d.fillStyle = gradient;
        doc.context2d.fillRect(0, 0, pageWidth, pageHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(60);
        doc.setTextColor('#2563eb'); 
        doc.text("ST", pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(22);
        doc.setTextColor('#FFFFFF');
        doc.text("Academic Analysis Report", pageWidth / 2, pageHeight / 2, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor('#94a3b8');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(14);
        doc.setTextColor('#14b8a6'); // teal
        doc.text(`"${randomQuote}"`, pageWidth / 2, pageHeight / 2 + 40, { align: 'center', maxWidth: pageWidth - margin * 4 });
    };
    
    const addPageHeader = (pageNumber: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor('#2563eb');
        doc.text("ST", margin, 20);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor('#94a3b8'); // slate-400
        doc.text("Your Study Companion", margin + 12, 20);
        
        doc.setDrawColor('#334155'); // slate-700
        doc.line(margin, 25, pageWidth - margin, 25);
    };

    const addPageFooter = (pageNumber: number, totalPages: number) => {
        doc.setFontSize(8);
        doc.setTextColor('#94a3b8');
        const footerText = `Page ${pageNumber} of ${totalPages} | ST Academic Assistant`;
        doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // --- PDF CONTENT GENERATION ---
    addCoverPage();

    const tableConfig = {
        theme: 'grid',
        headStyles: { fillColor: '#1e3a8a', textColor: '#ffffff', fontSize: 12, fontStyle: 'bold' },
        bodyStyles: { fillColor: '#1e293b', textColor: '#e2e8f0', lineColor: '#334155', lineWidth: 0.1, cellPadding: 3 },
    };

    // --- PAGE 2 ONWARDS ---
    doc.addPage();
    let startY = 35;

    const addSection = (title: string, body: any[][], head: string[][], options = {}) => {
        if (startY > pageHeight - 40) {
            doc.addPage();
            startY = 35;
        }
        doc.autoTable({
            ...tableConfig,
            head: head,
            body: body,
            startY: startY,
            ...options,
        });
        startY = (doc as any).lastAutoTable.finalY + 10;
    };
    
    // Summary
    addSection('Summary', [[data.summary]], [['Summary']]);

    // Analysis
    const analysisBody = [
        ['Word Count', data.analysis.wordCount],
        ['Est. Reading Time', `${data.analysis.readingTime} min`],
        ['Keywords', data.analysis.keywords.join(', ')],
    ];
    addSection('Analysis', analysisBody, [['Analysis']]);
    
    // Questions and Answers
    const questionsBody = data.questions.map((q, index) => {
        const options = q.type === QuestionType.MCQ && q.options ? q.options.join('\n') : 'N/A';
        return [`Q${index + 1}: ${q.question}`, options, q.answer];
    });
    addSection('Questions', questionsBody, [['Question', 'Options', 'Correct Answer']], { 
        bodyStyles: { ...tableConfig.bodyStyles, valign: 'top' } 
    });

    // Notes
    if(notes.trim()) {
        addSection('Notes', [[notes]], [['Personal Notes']]);
    }
    
    // Mind Map Page
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#14b8a6');
    doc.text("Mind Map", margin, 35);
    
    const drawNode = (node: MindMapNode, x: number, y: number, level: number, availableWidth: number) => {
        if (y > pageHeight - 40) return;
        
        const maxNodeWidth = 60;
        const lines = doc.splitTextToSize(node.text, maxNodeWidth);
        const boxWidth = maxNodeWidth + 10;
        const boxHeight = 8 + lines.length * 4;

        doc.setDrawColor(level === 0 ? '#2563eb' : '#14b8a6');
        doc.setFillColor('#0f172a');
        doc.roundedRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 3, 3, 'FD');
        
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(8);
        doc.text(lines, x, y, { align: 'center', baseline: 'middle' });

        const children = node.children || [];
        if (children.length > 0) {
            const childY = y + 40 + boxHeight;
            const numChildren = children.length;
            const childAvailableWidth = availableWidth / numChildren;
            
            const totalChildSpan = numChildren * (boxWidth + 5); 
            const startX = x - (Math.min(availableWidth, totalChildSpan) / 2) + childAvailableWidth / 2;
            
            children.forEach((child, index) => {
                const childX = startX + index * childAvailableWidth;
                doc.setDrawColor('#334155');
                doc.setLineWidth(0.5);
                doc.line(x, y + boxHeight/2, childX, childY - boxHeight/2);
                drawNode(child, childX, childY, level + 1, childAvailableWidth);
            });
        }
    };
    drawNode(data.mindMap, pageWidth / 2, 60, 0, pageWidth - margin * 2);


    // Add Headers and Footers to all pages except the cover
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i);
        addPageHeader(i - 1);
        addPageFooter(i - 1, pageCount - 1);
    }

    doc.save('ST_Study_Report.pdf');
};