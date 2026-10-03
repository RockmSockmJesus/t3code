import { Trash2, X } from "lucide-react";
import { useGraphStore } from "../../graph/graphStore";

export function NodeInspectorDrawer() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, selectNode } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const data = selectedNode.data;

  return (
    <div className="absolute right-2 top-14 bottom-2 w-72 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-lg z-20 flex flex-col p-3 text-xs overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
        <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
          Node Inspector
        </span>
        <button
          onClick={() => selectNode(null)}
          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        <div>
          <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
            Node Label
          </label>
          <input
            type="text"
            value={data.label || ""}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
            Type
          </label>
          <input
            type="text"
            disabled
            value={data.nodeType}
            className="w-full bg-muted/50 border border-border/50 rounded px-2 py-1 text-muted-foreground font-mono"
          />
        </div>

        {data.nodeType === "agent" && (
          <>
            <div>
              <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                Execution Engine
              </label>
              <select
                value={data.engine || "t3-acp"}
                onChange={(e) => updateNodeData(selectedNode.id, { engine: e.target.value as any })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="t3-acp">T3 Code Native (ACP)</option>
                <option value="claude-code">Claude Code CLI</option>
                <option value="opencode">OpenCode CLI</option>
                <option value="codex">Codex Service</option>
                <option value="antigravity">Antigravity Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                Agent Prompt / Instructions
              </label>
              <textarea
                rows={4}
                value={data.prompt || ""}
                onChange={(e) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </>
        )}

        {data.nodeType === "input" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Spec / Task Brief
            </label>
            <textarea
              rows={5}
              value={data.prompt || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
              className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        )}

        {data.nodeType === "action" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Shell Command
            </label>
            <input
              type="text"
              value={data.command || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { command: e.target.value })}
              className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {data.nodeType === "router" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Pass Condition Rule
            </label>
            <input
              type="text"
              value={data.condition || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
              className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {data.nodeType === "loop" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Max Retry Count
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={data.maxRetries || 3}
              onChange={(e) => updateNodeData(selectedNode.id, { maxRetries: parseInt(e.target.value) || 1 })}
              className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      <div className="border-t border-border pt-2 mt-3 flex justify-end">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="flex items-center gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  );
}
