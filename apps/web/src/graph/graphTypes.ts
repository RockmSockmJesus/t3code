import type { Edge, Node } from "@xyflow/react";

export type GraphNodeType = "input" | "agent" | "action" | "router" | "loop" | "human" | "git";

export type NodeExecutionStatus = "idle" | "queued" | "running" | "success" | "failure" | "paused";

export type InputSourceType =
  | "manual"
  | "workspace_spec"
  | "github_issue"
  | "linear_issue"
  | "ci_error";

export interface GraphNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  nodeType: GraphNodeType;
  status: NodeExecutionStatus;
  prompt?: string;
  inputSourceType?: InputSourceType;
  specInboxPath?: string;
  specDonePath?: string;
  specFailedPath?: string;
  selectedSpecFile?: string;
  updateInFileStatus?: boolean;
  moveFileOnCompletion?: boolean;

  // GitHub Issue Source properties
  githubRepo?: string;
  githubRequiredLabel?: string;
  githubAuthorPermission?: "collaborators" | "allowlist" | "any";
  githubAllowedAuthors?: string;
  githubIssueNumber?: string;
  githubActionOnComplete?: "comment_and_close" | "create_pr" | "update_label";
  githubInProgressLabel?: string;
  githubDoneLabel?: string;

  // Linear Ticket Source properties
  linearTeam?: string;
  linearQueueStatus?: string;
  linearInProgressStatus?: string;
  linearDoneStatus?: string;
  linearIssueId?: string;
  linearAutoAssign?: boolean;

  // CI / Error Log Source properties
  ciErrorSource?: "terminal_logs" | "github_actions" | "custom_log_file";
  ciLogFilePath?: string;
  ciWorkflowName?: string;
  ciAutoCreateIssue?: boolean;

  engine?: "claude-code" | "opencode" | "codex" | "antigravity" | "t3-acp";
  command?: string;
  maxRetries?: number;
  currentRetry?: number;
  condition?: string;
  logs?: string[];
  output?: string;
}

export type CustomGraphNode = Node<GraphNodeData>;

export type EdgeConditionType = "default" | "pass" | "fail" | "loop";

export interface CustomGraphEdgeData extends Record<string, unknown> {
  conditionType?: EdgeConditionType;
  label?: string;
}

export type CustomGraphEdge = Edge<CustomGraphEdgeData>;

export interface GraphWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: CustomGraphNode[];
  edges: CustomGraphEdge[];
  createdAt: string;
  updatedAt: string;
}
