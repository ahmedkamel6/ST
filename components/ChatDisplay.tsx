import React from 'react';
import type { MindMapNode } from '../types';

interface RenderNodeProps {
    node: MindMapNode;
    x: number;
    y: number;
    isRoot?: boolean;
}

const MAX_WIDTH = 140; // Max width for a node in pixels
const LINE_HEIGHT = 14; // Height of a single line of text
const PADDING = 10; // Padding inside the node

// Helper to wrap text
const wrapText = (text: string): string[] => {
    // This is a simple greedy wrapping algorithm. It's an approximation.
    // For perfect wrapping, one would need to measure text in the DOM.
    const charWidth = 7; // Approximate width of an average character
    const maxCharsPerLine = Math.floor((MAX_WIDTH - PADDING * 2) / charWidth);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length > maxCharsPerLine && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = currentLine ? `${currentLine} ${word}` : word;
        }
    });
    lines.push(currentLine);
    return lines;
};


export const RenderNode: React.FC<RenderNodeProps> = ({ node, x, y, isRoot = false }) => {
    const lines = React.useMemo(() => wrapText(node.text), [node.text]);
    const boxHeight = lines.length * LINE_HEIGHT + PADDING * 2;
    const boxWidth = MAX_WIDTH;

    return (
        <g transform={`translate(${x}, ${y})`} style={{ fontFamily: "'Cairo', sans-serif", cursor: 'pointer' }}>
             <defs>
                <linearGradient id={`nodeGradient-${isRoot}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: isRoot ? '#1e3a8a' : '#042f2e', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: isRoot ? '#1e293b' : '#0f172a', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                </filter>
            </defs>
            <rect
                x={-boxWidth / 2}
                y={-boxHeight / 2}
                width={boxWidth}
                height={boxHeight}
                rx="8"
                ry="8"
                fill={`url(#nodeGradient-${isRoot})`}
                stroke={isRoot ? "#2563eb" : "#14b8a6"}
                strokeWidth="2"
                filter="url(#shadow)"
            />
            <text
                x="0"
                y={-boxHeight / 2 + PADDING + LINE_HEIGHT / 2 - (LINE_HEIGHT * (lines.length - 1) / 2)}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="12px"
                fontWeight="500"
                style={{ pointerEvents: 'none' }}
            >
                {lines.map((line, i) => (
                    <tspan key={i} x="0" dy={i === 0 ? 0 : LINE_HEIGHT}>
                        {line}
                    </tspan>
                ))}
            </text>
        </g>
    );
};
