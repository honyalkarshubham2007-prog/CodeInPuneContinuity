import React, { useState, useMemo } from 'react';
import { Decision, Task, Risk, Dependency, User } from '../../types/index.js';
import { EvidenceData } from '../evidence/EvidenceDrawer.js';
import { ZoomIn, ZoomOut, Maximize2, Filter, Layers, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface KnowledgeGraphProps {
  decisions: Decision[];
  tasks: Task[];
  risks: Risk[];
  dependencies: Dependency[];
  users: User[];
  onOpenEvidence: (evidence: EvidenceData) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'decision' | 'task' | 'risk' | 'dependency';
  status?: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  originalItem: unknown;
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  isBlocked?: boolean;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  decisions,
  tasks,
  risks,
  dependencies,
  users,
  onOpenEvidence
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState(1);

  // Layout node positions in an intuitive circular / tiered coordinate layout
  const { nodes, edges } = useMemo(() => {
    const calculatedNodes: GraphNode[] = [];
    const calculatedEdges: GraphEdge[] = [];

    // Center 1: Key People
    const people = users.slice(0, 3);
    people.forEach((p, i) => {
      const angle = (i / people.length) * Math.PI * 2;
      calculatedNodes.push({
        id: `person_${p.id}`,
        label: p.name,
        type: 'person',
        x: 450 + Math.cos(angle) * 110,
        y: 280 + Math.sin(angle) * 90,
        radius: 24,
        color: '#14213D',
        originalItem: p
      });
    });

    // Orbit 1: Decisions
    decisions.forEach((d, i) => {
      const angle = (i / Math.max(1, decisions.length)) * Math.PI * 2 - Math.PI / 4;
      const x = 450 + Math.cos(angle) * 240;
      const y = 280 + Math.sin(angle) * 180;
      calculatedNodes.push({
        id: `decision_${d.id}`,
        label: d.title,
        type: 'decision',
        status: d.verificationStatus,
        x,
        y,
        radius: 20,
        color: d.verificationStatus === 'conflicting' ? '#F2B544' : '#16A394',
        originalItem: d
      });

      // Edge from decision maker to decision
      if (d.decisionMaker.toLowerCase().includes('alex')) {
        calculatedEdges.push({
          from: 'person_user_alex_rivera',
          to: `decision_${d.id}`,
          label: 'Decided'
        });
      }
    });

    // Orbit 2: Tasks
    tasks.forEach((t, i) => {
      const angle = (i / Math.max(1, tasks.length)) * Math.PI * 2 + Math.PI / 6;
      const x = 450 + Math.cos(angle) * 350;
      const y = 280 + Math.sin(angle) * 220;
      calculatedNodes.push({
        id: `task_${t.id}`,
        label: t.name,
        type: 'task',
        status: t.verificationStatus,
        x,
        y,
        radius: 18,
        color: t.owner.toLowerCase().includes('unassigned') ? '#E76F51' : '#36B9D6',
        originalItem: t
      });

      if (t.owner.toLowerCase().includes('alex')) {
        calculatedEdges.push({
          from: 'person_user_alex_rivera',
          to: `task_${t.id}`,
          label: 'Owns'
        });
      } else if (t.owner.toLowerCase().includes('jordan')) {
        calculatedEdges.push({
          from: 'person_user_jordan_lee',
          to: `task_${t.id}`,
          label: 'Owns'
        });
      }
    });

    // Orbit 3: Risks
    risks.forEach((r, i) => {
      const x = 120 + i * 160;
      const y = 480;
      calculatedNodes.push({
        id: `risk_${r.id}`,
        label: r.title,
        type: 'risk',
        status: r.severity,
        x,
        y,
        radius: 18,
        color: r.severity === 'critical' ? '#D9534F' : '#F2B544',
        originalItem: r
      });

      if (r.title.toLowerCase().includes('single-person') || r.title.toLowerCase().includes('ssh')) {
        calculatedEdges.push({
          from: 'person_user_alex_rivera',
          to: `risk_${r.id}`,
          label: 'Knowledge Risk'
        });
      }
    });

    // Inter-task dependencies
    dependencies.forEach(dep => {
      const matchingTask = tasks.find(t => t.name.toLowerCase().includes(dep.dependentTask.toLowerCase().substring(0, 15)));
      if (matchingTask) {
        calculatedEdges.push({
          from: `task_${matchingTask.id}`,
          to: 'person_user_alex_rivera',
          label: 'Blocked On',
          isBlocked: dep.isBlocked
        });
      }
    });

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [decisions, tasks, risks, dependencies, users]);

  const filteredNodes = useMemo(() => {
    if (filterType === 'all') return nodes;
    return nodes.filter(n => n.type === filterType);
  }, [nodes, filterType]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (node.type === 'decision') {
      const d = node.originalItem as Decision;
      onOpenEvidence({
        title: d.title,
        claimText: d.description,
        sourceTitle: d.evidenceSourceTitle,
        excerptText: d.evidenceExcerpt,
        verificationStatus: d.verificationStatus
      });
    } else if (node.type === 'task') {
      const t = node.originalItem as Task;
      onOpenEvidence({
        title: t.name,
        claimText: t.description,
        sourceTitle: t.evidenceSourceTitle,
        excerptText: t.evidenceExcerpt,
        verificationStatus: t.verificationStatus
      });
    } else if (node.type === 'risk') {
      const r = node.originalItem as Risk;
      onOpenEvidence({
        title: r.title,
        claimText: r.description,
        sourceTitle: r.evidenceSourceTitle,
        excerptText: r.supportingEvidence,
        verificationStatus: r.severity === 'critical' ? 'verified' : 'inferred'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Graph Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#14213D]/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entity Filter:</span>
          {['all', 'person', 'decision', 'task', 'risk'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {type === 'all' ? 'All Entities' : `${type}s`}
            </button>
          ))}
        </div>

        {/* Zoom & Legend */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-500 pr-2 border-r border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#14213D]" /> People</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A394]" /> Decisions</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#36B9D6]" /> Tasks</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]" /> Risks</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
              aria-label="Zoom out"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(1.4, zoom + 0.15))}
              aria-label="Zoom in"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              aria-label="Reset zoom"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[520px] overflow-hidden bg-slate-50/40 dark:bg-[#080F20] cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 900 560"
          className="w-full h-full select-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
            </marker>
            <marker id="arrow-blocked" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#D9534F" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, idx) => {
            const source = nodes.find(n => n.id === e.from);
            const target = nodes.find(n => n.id === e.to);
            if (!source || !target) return null;

            const isSelected = selectedNode && (selectedNode.id === e.from || selectedNode.id === e.to);

            return (
              <g key={idx}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={e.isBlocked ? '#D9534F' : isSelected ? '#16A394' : '#CBD5E1'}
                  strokeWidth={isSelected ? 2.5 : e.isBlocked ? 2 : 1.2}
                  strokeDasharray={e.isBlocked ? '4 3' : 'none'}
                  markerEnd={e.isBlocked ? 'url(#arrow-blocked)' : 'url(#arrow)'}
                  opacity={isSelected ? 1 : 0.65}
                />
                {e.label && (
                  <text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 - 4}
                    fill={e.isBlocked ? '#D9534F' : '#64748B'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="font-semibold"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Outer Glow on selection */}
                {isSelected && (
                  <circle
                    r={node.radius + 6}
                    fill="none"
                    stroke="#16A394"
                    strokeWidth="2.5"
                    strokeDasharray="3 2"
                    className="animate-pulse"
                  />
                )}

                {/* Node Body */}
                <circle
                  r={node.radius}
                  fill={node.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-110 shadow-md"
                />

                {/* Icon or Type Symbol */}
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="system-ui"
                  pointerEvents="none"
                >
                  {node.type === 'person' ? '👤' :
                   node.type === 'decision' ? '⚖️' :
                   node.type === 'task' ? '📋' :
                   node.type === 'risk' ? '⚠️' : '🔗'}
                </text>

                {/* Label below node */}
                <text
                  y={node.radius + 13}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="600"
                  className="text-slate-800 dark:text-slate-200 select-none max-w-[120px]"
                >
                  {node.label.length > 22 ? `${node.label.substring(0, 20)}...` : node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Drawer / Info Callout */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-4 bg-white/95 dark:bg-[#0B1730]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                {selectedNode.type} Node
              </span>
              <div className="font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {selectedNode.label}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Click to inspect source citation in Evidence Explorer
              </div>
            </div>

            <button
              onClick={() => handleNodeClick(selectedNode)}
              className="px-3 py-1.5 bg-slate-900 text-white dark:bg-teal-600 rounded-lg font-semibold shrink-0 hover:bg-slate-800"
            >
              Inspect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
