import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";

import type {
  CustomGraphEdge,
  CustomGraphNode,
  GraphNodeData,
  GraphNodeType,
  GraphWorkflow,
} from "./graphTypes";

const DEFAULT_NODES: CustomGraphNode[] = [
  {
    id: "node-1",
    type: "input",
    position: { x: 50, y: 50 },
    data: {
      label: "Feature Spec / Ticket",
      nodeType: "input",
      status: "idle",
      prompt: "Implement user authentication with JWT tokens.",
    },
  },
  {
    id: "node-2",
    type: "agent",
    position: { x: 50, y: 170 },
    data: {
      label: "Code Generation Agent",
      nodeType: "agent",
      status: "idle",
      engine: "t3-acp",
      prompt: "Generate auth module based on spec",
    },
  },
  {
    id: "node-3",
    type: "action",
    position: { x: 50, y: 290 },
    data: {
      label: "Run Test Suite",
      nodeType: "action",
      status: "idle",
      command: "pnpm test",
    },
  },
  {
    id: "node-4",
    type: "router",
    position: { x: 50, y: 410 },
    data: {
      label: "Verify Tests Pass",
      nodeType: "router",
      status: "idle",
      condition: "exitCode === 0",
    },
  },
  {
    id: "node-5",
    type: "human",
    position: { x: 250, y: 530 },
    data: {
      label: "Human Review Gate",
      nodeType: "human",
      status: "idle",
    },
  },
  {
    id: "node-6",
    type: "loop",
    position: { x: -150, y: 290 },
    data: {
      label: "Retry Counter",
      nodeType: "loop",
      status: "idle",
      maxRetries: 3,
      currentRetry: 0,
    },
  },
];

const DEFAULT_EDGES: CustomGraphEdge[] = [
  { id: "e1-2", source: "node-1", target: "node-2" },
  { id: "e2-3", source: "node-2", target: "node-3" },
  { id: "e3-4", source: "node-3", target: "node-4" },
  {
    id: "e4-5",
    source: "node-4",
    target: "node-5",
    sourceHandle: "pass",
    data: { conditionType: "pass", label: "Pass" },
  },
  {
    id: "e4-6",
    source: "node-4",
    target: "node-6",
    sourceHandle: "fail",
    data: { conditionType: "fail", label: "Fail" },
  },
  {
    id: "e6-2",
    source: "node-6",
    target: "node-2",
    sourceHandle: "loop",
    data: { conditionType: "loop", label: "Retry" },
  },
];

export interface GraphStoreState {
  workflowName: string;
  nodes: CustomGraphNode[];
  edges: CustomGraphEdge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  activeNodeId: string | null;
  agentThreadSpawner: ((label: string, prompt: string) => Promise<void> | void) | null;

  setAgentThreadSpawner: (
    spawner: ((label: string, prompt: string) => Promise<void> | void) | null,
  ) => void;
  setWorkflowName: (name: string) => void;
  onNodesChange: (changes: NodeChange<CustomGraphNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CustomGraphEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (type: GraphNodeType) => void;
  updateNodeData: (nodeId: string, data: Partial<GraphNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  startExecution: () => void;
  pauseExecution: () => void;
  resetExecution: () => void;
  stepExecution: () => Promise<void>;
  approveHumanGate: (nodeId: string) => void;
  rejectHumanGate: (nodeId: string) => void;

  loadWorkflowJSON: (jsonStr: string) => boolean;
  exportWorkflowJSON: () => string;
}

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  workflowName: "Default Agent Orchestrator Flow",
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,
  selectedNodeId: null,
  isExecuting: false,
  activeNodeId: null,
  agentThreadSpawner: null,

  setAgentThreadSpawner: (spawner) => set({ agentThreadSpawner: spawner }),
  setWorkflowName: (name) => set({ workflowName: name }),

  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
    }),

  onConnect: (connection) =>
    set({
      edges: addEdge(connection, get().edges),
    }),

  addNode: (type) => {
    const id = `node-${Date.now()}`;
    const newNode: CustomGraphNode = {
      id,
      type,
      position: { x: 100 + Math.random() * 50, y: 150 + get().nodes.length * 60 },
      data: {
        label: `New ${type.toUpperCase()} Node`,
        nodeType: type,
        status: "idle",
        ...(type === "agent" ? { engine: "t3-acp", prompt: "Agent instructions..." } : {}),
        ...(type === "action" ? { command: "pnpm test" } : {}),
        ...(type === "router" ? { condition: "exitCode === 0" } : {}),
        ...(type === "loop" ? { maxRetries: 3, currentRetry: 0 } : {}),
      },
    };
    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: id,
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
          : node,
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((e) => e.id !== edgeId),
    });
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const newId = `node-${Date.now()}`;
    const duplicatedNode: CustomGraphNode = {
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      data: {
        ...node.data,
        label: `${node.data.label} (Copy)`,
      },
    };
    set({
      nodes: [...get().nodes, duplicatedNode],
      selectedNodeId: newId,
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  startExecution: () => {
    const nodes = get().nodes;
    if (nodes.length === 0) return;
    set({ isExecuting: true, activeNodeId: nodes[0].id });
    const updated = nodes.map((n, idx) => ({
      ...n,
      data: { ...n.data, status: (idx === 0 ? "running" : "idle") as any, logs: [] },
    }));
    set({ nodes: updated });
    // Trigger step execution automatically
    setTimeout(() => {
      void get().stepExecution();
    }, 100);
  },

  pauseExecution: () => {
    set({ isExecuting: false });
  },

  resetExecution: () => {
    set({
      isExecuting: false,
      activeNodeId: null,
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle", currentRetry: 0, logs: [] },
      })),
    });
  },

  stepExecution: async () => {
    const { nodes, activeNodeId, edges, agentThreadSpawner } = get();
    if (!activeNodeId) {
      if (nodes.length > 0) {
        get().startExecution();
      }
      return;
    }
    const currentNode = nodes.find((n) => n.id === activeNodeId);
    if (!currentNode) return;

    const nodeData = currentNode.data;
    const currentLogs = [...(nodeData.logs || [])];

    // If currentNode is human gate and paused, stop until user approves/rejects
    if (nodeData.nodeType === "human" && nodeData.status === "paused") {
      return;
    }

    // Process specific node execution logic
    if (nodeData.nodeType === "agent") {
      const label = nodeData.label || "Agent Node";
      const prompt = nodeData.prompt || "Run agent task flow";
      currentLogs.push(`[AGENT] Spawning T3 Code thread: ${label}`);
      currentLogs.push(`[AGENT] Prompt payload: "${prompt}"`);

      if (agentThreadSpawner) {
        try {
          await agentThreadSpawner(label, prompt);
          currentLogs.push(`[SUCCESS] Spawning complete! Agent thread active in Left Sidebar.`);
        } catch (err) {
          currentLogs.push(`[ERROR] Failed to spawn thread: ${String(err)}`);
        }
      } else {
        currentLogs.push(`[SIMULATION] Thread spawned into Left Sidebar.`);
      }
    } else if (nodeData.nodeType === "action") {
      const cmd = nodeData.command || "pnpm test";
      currentLogs.push(`[ACTION] Executing shell command: ${cmd}`);
      currentLogs.push(`[OUT] Running command in workspace...`);
      currentLogs.push(`[OUT] Process exited with exit code 0`);
      currentLogs.push(`[SUCCESS] Action completed successfully.`);
    } else if (nodeData.nodeType === "router") {
      const condition = nodeData.condition || "exitCode === 0";
      currentLogs.push(`[ROUTER] Evaluating pass rule: ${condition}`);
      currentLogs.push(`[ROUTER] Condition evaluated to TRUE -> branching via 'pass' output.`);
    } else if (nodeData.nodeType === "loop") {
      const maxRetries = nodeData.maxRetries || 3;
      const currentRetry = (nodeData.currentRetry || 0) + 1;
      currentLogs.push(`[LOOP] Retry attempt ${currentRetry} of ${maxRetries}`);
      get().updateNodeData(currentNode.id, { currentRetry });
    } else if (nodeData.nodeType === "human") {
      currentLogs.push(`[HUMAN GATE] Execution paused. Awaiting human approval...`);
      get().updateNodeData(currentNode.id, { status: "paused", logs: currentLogs });
      set({ isExecuting: false });
      return;
    }

    // Mark current node as success
    const updatedNodes = nodes.map((n) =>
      n.id === activeNodeId
        ? { ...n, data: { ...n.data, status: "success" as const, logs: currentLogs } }
        : n,
    );

    let handleFilter: string | undefined = undefined;
    if (currentNode.data.nodeType === "router") {
      handleFilter = "pass";
    } else if (currentNode.data.nodeType === "loop") {
      handleFilter = "loop";
    }

    const outgoing =
      edges.find(
        (e) => e.source === activeNodeId && (!handleFilter || e.sourceHandle === handleFilter),
      ) || edges.find((e) => e.source === activeNodeId);

    if (outgoing) {
      const nextId = outgoing.target;
      set({
        nodes: updatedNodes.map((n) =>
          n.id === nextId ? { ...n, data: { ...n.data, status: "running" as const } } : n,
        ),
        activeNodeId: nextId,
      });
    } else {
      set({ nodes: updatedNodes, isExecuting: false, activeNodeId: null });
    }
  },

  approveHumanGate: (nodeId) => {
    const { nodes, edges } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const logs = [...(node.data.logs || []), "[HUMAN GATE] Approved by user! Continuing workflow."];
    const updatedNodes = nodes.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, status: "success" as const, logs } } : n,
    );

    const outgoing = edges.find((e) => e.source === nodeId);
    if (outgoing) {
      const nextId = outgoing.target;
      set({
        isExecuting: true,
        nodes: updatedNodes.map((n) =>
          n.id === nextId ? { ...n, data: { ...n.data, status: "running" as const } } : n,
        ),
        activeNodeId: nextId,
      });
      setTimeout(() => {
        void get().stepExecution();
      }, 100);
    } else {
      set({ nodes: updatedNodes, isExecuting: false, activeNodeId: null });
    }
  },

  rejectHumanGate: (nodeId) => {
    const { nodes } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const logs = [...(node.data.logs || []), "[HUMAN GATE] Rejected by user. Workflow aborted."];
    const updatedNodes = nodes.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, status: "failure" as const, logs } } : n,
    );

    set({ nodes: updatedNodes, isExecuting: false, activeNodeId: null });
  },

  loadWorkflowJSON: (jsonStr) => {
    try {
      const parsed: GraphWorkflow = JSON.parse(jsonStr);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        set({
          workflowName: parsed.name || "Loaded Workflow",
          nodes: parsed.nodes,
          edges: parsed.edges,
          selectedNodeId: null,
          activeNodeId: null,
          isExecuting: false,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  exportWorkflowJSON: () => {
    const { workflowName, nodes, edges } = get();
    const workflow: GraphWorkflow = {
      id: `wf-${Date.now()}`,
      name: workflowName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return JSON.stringify(workflow, null, 2);
  },
}));
