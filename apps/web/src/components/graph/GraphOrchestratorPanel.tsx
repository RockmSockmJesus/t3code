import { useCallback, useEffect, useRef, useState } from "react";
import { Background, Controls, MiniMap, ReactFlow, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Bot,
  ChevronDown,
  Copy,
  Download,
  FileText,
  GitFork,
  Pause,
  Play,
  Plus,
  RotateCw,
  Settings,
  StepForward,
  Terminal,
  Trash2,
  Upload,
  UserCheck,
} from "lucide-react";

import { useGraphStore } from "../../graph/graphStore";
import { ActionNode } from "./nodes/ActionNode";
import { AgentNode } from "./nodes/AgentNode";
import { HumanGateNode } from "./nodes/HumanGateNode";
import { InputNode } from "./nodes/InputNode";
import { LoopNode } from "./nodes/LoopNode";
import { RouterNode } from "./nodes/RouterNode";
import { NodeInspectorDrawer } from "./NodeInspectorDrawer";

const nodeTypes: NodeTypes = {
  input: InputNode,
  agent: AgentNode,
  action: ActionNode,
  router: RouterNode,
  loop: LoopNode,
  human: HumanGateNode,
};

export function GraphOrchestratorPanel(props: {
  onSpawnAgentThread?: (label: string, prompt: string) => Promise<void> | void;
}) {
  const {
    workflowName,
    setWorkflowName,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    deleteEdge,
    duplicateNode,
    selectNode,
    isExecuting,
    startExecution,
    pauseExecution,
    resetExecution,
    stepExecution,
    exportWorkflowJSON,
    loadWorkflowJSON,
    setAgentThreadSpawner,
  } = useGraphStore();

  useEffect(() => {
    if (props.onSpawnAgentThread) {
      setAgentThreadSpawner(props.onSpawnAgentThread);
    }
  }, [props.onSpawnAgentThread, setAgentThreadSpawner]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState<{
    type: "node" | "edge";
    id: string;
    x: number;
    y: number;
    label?: string;
  } | null>(null);

  useEffect(() => {
    if (!addMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [addMenuOpen]);

  useEffect(() => {
    if (!contextMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      type: "node",
      id: node.id,
      x: event.clientX,
      y: event.clientY,
      label: node.data?.label || node.id,
    });
  }, []);

  const handleEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      type: "edge",
      id: edge.id,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    setContextMenu(null);
  }, [selectNode]);

  const handleExport = useCallback(() => {
    const jsonStr = exportWorkflowJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportWorkflowJSON, workflowName]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          loadWorkflowJSON(content);
        }
      };
      reader.readAsText(file);
    },
    [loadWorkflowJSON],
  );

  return (
    <div className="relative w-full h-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-11 border-b border-border bg-card/80 backdrop-blur px-3 flex items-center justify-between gap-2 shrink-0 z-10 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="font-medium bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-1.5 py-0.5 text-xs focus:outline-none truncate max-w-44"
          />
        </div>

        {/* Add Node Menu */}
        <div className="flex items-center gap-1">
          <div className="relative" ref={addMenuRef}>
            <button
              type="button"
              onClick={() => setAddMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 px-2.5 py-1 rounded font-medium text-[11px] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            {addMenuOpen && (
              <div className="absolute left-0 top-full mt-1 flex flex-col bg-card border border-border shadow-xl rounded-md p-1 min-w-48 z-50">
                <button
                  type="button"
                  onClick={() => {
                    addNode("input");
                    setAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium">Input Spec</span>
                    <span className="text-[9px] text-muted-foreground truncate">
                      Prompt / Brief Input
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addNode("agent");
                    setAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium">Agent Node</span>
                    <span className="text-[9px] text-muted-foreground truncate">
                      AI Reasoning Agent
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addNode("action");
                    setAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium">Action / Command</span>
                    <span className="text-[9px] text-muted-foreground truncate">
                      Shell / Build Command
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addNode("router");
                    setAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium">If/Else Router</span>
                    <span className="text-[9px] text-muted-foreground truncate">
                      Pass / Fail Branching
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addNode("loop");
                    setAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium">Loop Gate</span>
                    <span className="text-[9px] text-muted-foreground truncate">
                      Retry Limit Loop
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addNode("human");
                    setAddMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium">Human Review</span>
                    <span className="text-[9px] text-muted-foreground truncate">
                      Human Gate Approval
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Controls: Run / Pause / Step / Reset */}
          {isExecuting ? (
            <button
              onClick={pauseExecution}
              className="flex items-center gap-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 px-2 py-1 rounded text-[11px]"
            >
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startExecution}
              className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 px-2 py-1 rounded text-[11px]"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          )}

          <button
            onClick={stepExecution}
            title="Step next node"
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
          >
            <StepForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetExecution}
            title="Reset Graph"
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Import / Export */}
          <button
            onClick={handleExport}
            title="Export Workflow JSON"
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Workflow JSON"
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Main ReactFlow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            selectNode(node.id);
            setContextMenu(null);
          }}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onPaneClick={handlePaneClick}
          fitView
          colorMode="dark"
        >
          <Background gap={16} size={1} />
          <Controls className="!bg-card !border-border !text-foreground !fill-foreground" />
          <MiniMap
            className="!bg-card !border-border"
            nodeColor={(node) => {
              switch (node.type) {
                case "agent":
                  return "#60a5fa";
                case "action":
                  return "#34d399";
                case "router":
                  return "#fbbf24";
                case "loop":
                  return "#c084fc";
                case "human":
                  return "#22d3ee";
                default:
                  return "#94a3b8";
              }
            }}
          />
        </ReactFlow>

        {/* Right Click Context Menu */}
        {contextMenu && (
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onMouseDown={(e) => e.stopPropagation()}
            className="fixed z-50 min-w-44 bg-card border border-border shadow-2xl rounded-md p-1 flex flex-col text-xs animate-in fade-in-50 zoom-in-95"
          >
            {contextMenu.type === "node" && (
              <>
                <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase border-b border-border/60 mb-1 truncate max-w-48">
                  Node: {contextMenu.label}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    selectNode(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-foreground text-left transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Inspect / Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    duplicateNode(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent rounded text-[11px] text-foreground text-left transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Duplicate Node</span>
                </button>
                <div className="h-px bg-border/60 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    deleteNode(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-destructive/20 text-destructive rounded text-[11px] text-left transition-colors font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Delete Node</span>
                </button>
              </>
            )}

            {contextMenu.type === "edge" && (
              <>
                <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase border-b border-border/60 mb-1">
                  Connection Edge
                </div>
                <button
                  type="button"
                  onClick={() => {
                    deleteEdge(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-destructive/20 text-destructive rounded text-[11px] text-left transition-colors font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Delete Connection</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Node Inspector Drawer */}
        <NodeInspectorDrawer />
      </div>
    </div>
  );
}
