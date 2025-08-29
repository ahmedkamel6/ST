import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import type { MindMapNode } from '../types';
import { RenderNode } from './ChatDisplay';
import { ArrowsPointingOutIcon } from './ResultsSection';
import { Tooltip } from './Tooltip';

interface MindMapDisplayProps {
    rootNode: MindMapNode;
}

// --- Tidy Tree Layout Algorithm ---
const HORIZONTAL_SPACING = 170; // Corresponds to node width + margin
const VERTICAL_SPACING = 120; // Vertical distance between levels

interface TidyNode extends MindMapNode {
  x: number;
  y: number;
  modifier: number;
  parent?: TidyNode;
  children: TidyNode[];
  thread?: TidyNode;
}

const buildTidyTree = (node: MindMapNode, parent?: TidyNode, depth = 0): TidyNode => {
    const tidyNode: TidyNode = {
        ...node,
        x: 0,
        y: depth * VERTICAL_SPACING,
        modifier: 0,
        parent: parent,
        children: [],
    };
    
    tidyNode.children = (node.children || []).map(child => buildTidyTree(child, tidyNode, depth + 1));
    
    return tidyNode;
};

const firstWalk = (node: TidyNode) => {
    if (node.children.length === 0) return;

    let defaultAncestor = node.children[0];
    
    node.children.forEach(child => firstWalk(child));

    for (let i = 0; i < node.children.length - 1; i++) {
        const rightChild = node.children[i];
        const leftChild = node.children[i + 1];

        let rightContour = rightChild;
        let leftContour = leftChild;
        let rightModifierSum = rightChild.modifier;
        let leftModifierSum = leftChild.modifier;
        let shift = 0;

        while(rightContour && leftContour) {
            const distance = (rightContour.x + rightModifierSum) - (leftContour.x + leftModifierSum);
            if (distance + HORIZONTAL_SPACING > 0) {
                 shift = Math.max(shift, distance + HORIZONTAL_SPACING);
            }
            if(rightContour.children.length === 0) {
                 rightContour = rightContour.thread || defaultAncestor;
                 rightModifierSum += rightContour.modifier;
            } else {
                rightContour = rightContour.children[rightContour.children.length-1];
                rightModifierSum += rightContour.modifier;
            }
            if(leftContour.children.length === 0) {
                leftContour = leftContour.thread || defaultAncestor;
                leftModifierSum += leftContour.modifier;
            } else {
                leftContour = leftContour.children[0];
                leftModifierSum += leftContour.modifier;
            }
        }
        
        if (shift > 0) {
            leftChild.modifier += shift;
            leftChild.x += shift;
        }
    }

    const midPoint = (node.children[0].x + node.children[node.children.length - 1].x) / 2;
    node.x = midPoint;
};


const secondWalk = (node: TidyNode, mod = 0) => {
    node.x += mod;
    node.children.forEach(child => secondWalk(child, mod + node.modifier));
};


const getLayout = (rootNode: MindMapNode) => {
    const tidyRoot = buildTidyTree(rootNode);
    firstWalk(tidyRoot);
    secondWalk(tidyRoot);

    const nodes: (TidyNode & {isRoot: boolean})[] = [];
    const connections: { from: number; to: number }[] = [];
    const queue = [tidyRoot];
    let minX = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    while (queue.length > 0) {
        const node = queue.shift()!;
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);
        nodes.push({ ...node, isRoot: node.id === rootNode.id });
        if (node.children) {
            node.children.forEach(child => {
                connections.push({ from: node.id, to: child.id });
                queue.push(child);
            });
        }
    }
    
    nodes.forEach(node => {
        node.x -= minX;
    });

    const width = maxX - minX + HORIZONTAL_SPACING;
    const height = maxY + VERTICAL_SPACING;

    return { nodes, connections, width, height };
};


export const MindMapDisplay: React.FC<MindMapDisplayProps> = ({ rootNode }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    const { nodes, connections, width, height } = useMemo(() => getLayout(rootNode), [rootNode]);
    
    const nodeMap = useMemo(() => 
        new Map(nodes.map(n => [n.id, n])), 
    [nodes]);

    const handleWheel = useCallback((event: React.WheelEvent) => {
        event.preventDefault();
        const svg = svgRef.current;
        if (!svg) return;

        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        
        const inverted = svg.getScreenCTM()?.inverse().transformPoint(point);
        if (!inverted) return;
        
        const zoomFactor = 1.1;
        const scale = event.deltaY > 0 ? 1 / zoomFactor : zoomFactor;
        
        const newK = Math.max(0.1, transform.k * scale);
        const newX = inverted.x - (inverted.x - transform.x) * scale;
        const newY = inverted.y - (inverted.y - transform.y) * scale;

        setTransform({ x: newX, y: newY, k: newK });
    }, [transform.k, transform.x, transform.y]);

    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        if (event.button !== 0) return;
        setIsPanning(true);
        setPanStart({ x: event.clientX, y: event.clientY });
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        if (!isPanning) return;
        const dx = event.clientX - panStart.x;
        const dy = event.clientY - panStart.y;
        setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
        setPanStart({ x: event.clientX, y: event.clientY });
    }, [isPanning, panStart]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);
    
    const zoom = (factor: number) => {
      setTransform(t => ({...t, k: Math.max(0.1, t.k * factor)}))
    }
    
    const resetView = useCallback(() => {
       if (!containerRef.current || width <= HORIZONTAL_SPACING || height <= VERTICAL_SPACING) return;
       const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;
       
       const scaleX = containerWidth / width;
       const scaleY = containerHeight / height;
       const k = Math.min(scaleX, scaleY) * 0.9;
       
       const x = (containerWidth - width * k) / 2 + (HORIZONTAL_SPACING * k) / 2;
       const y = 50;

       setTransform({ x, y, k });
    }, [width, height]);
    
    useEffect(() => {
        resetView();
    }, [resetView]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Mind Map</h3>
                <div className="flex items-center gap-2">
                    <Tooltip text="Zoom In">
                      <button onClick={() => zoom(1.2)} className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md text-slate-300 transition-colors" aria-label="Zoom In">+</button>
                    </Tooltip>
                    <Tooltip text="Zoom Out">
                      <button onClick={() => zoom(0.8)} className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md text-slate-300 transition-colors" aria-label="Zoom Out">-</button>
                    </Tooltip>
                    <Tooltip text="Reset View">
                      <button onClick={resetView} className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md text-slate-300 transition-colors" aria-label="Reset View">
                          <ArrowsPointingOutIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                </div>
            </div>
            <div 
              ref={containerRef}
              className={`bg-slate-900/50 p-4 rounded-lg border border-slate-800 h-[500px] overflow-hidden relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
                <svg ref={svgRef} width="100%" height="100%">
                    <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
                        {connections.map((conn, i) => {
                            const from = nodeMap.get(conn.from);
                            const to = nodeMap.get(conn.to);
                            if (!from || !to) return null;
                            return (
                                <path
                                    key={`conn-${i}`}
                                    d={`M ${from.x} ${from.y} C ${from.x} ${from.y + VERTICAL_SPACING / 2}, ${to.x} ${to.y - VERTICAL_SPACING / 2}, ${to.x} ${to.y}`}
                                    stroke="#334155"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            );
                        })}

                        {nodes.map((node) => (
                             <Tooltip key={node.id} text={node.text}>
                                <RenderNode node={node} x={node.x} y={node.y} isRoot={node.isRoot} />
                             </Tooltip>
                         ))}
                    </g>
                </svg>
            </div>
        </div>
    );
};
