import { useCallback, useRef } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Bot,
  Download,
  FileText,
  GitFork,
  Pause,
  Play,
  Plus,
  RotateCw,
  StepForward,
  Terminal,
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

export function GraphOrchestratorPanel() {
  const {
    workflowName,
    setWorkflowName,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    isExecuting,
    startExecution,
    pauseExecution,
    resetExecution,
    stepExecution,
    exportWorkflowJSON,
    loadWorkflowJSON,
  } = useGraphStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <div className="relative group">
            <button className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded font-medium text-[11px] transition-colors">
              <Plus className="w-3 h-3" />
              <span>Add Node</span>
            </button>
            <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col bg-card border border-border shadow-lg rounded p-1 min-w-36 z-30">
              <button
                onClick={() => addNode("input")}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground"
              >
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span>Input Spec</span>
              </button>
              <button
                onClick={() => addNode("agent")}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground"
              >
                <Bot className="w-3 h-3 text-blue-400" />
                <span>Agent Node</span>
              </button>
              <button
                onClick={() => addNode("action")}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground"
              >
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Action / Command</span>
              </button>
              <button
                onClick={() => addNode("router")}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground"
              >
                <GitFork className="w-3 h-3 text-amber-400" />
                <span>If/Else Router</span>
              </button>
              <button
                onClick={() => addNode("loop")}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground"
              >
                <RotateCw className="w-3 h-3 text-purple-400" />
                <span>Loop Gate</span>
              </button>
              <button
                onClick={() => addNode("human")}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded text-[11px] text-left text-foreground"
              >
                <UserCheck className="w-3 h-3 text-cyan-400" />
                <span>Human Review</span>
              </button>
            </div>
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
          onNodeClick={(_, node) => selectNode(node.id)}
          onPaneClick={() => selectNode(null)}
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

        {/* Node Inspector Drawer */}
        <NodeInspectorDrawer />
      </div>
    </div>
  );
}
