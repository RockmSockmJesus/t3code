import type { NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function InputNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  const sourceType = data.inputSourceType || "manual";

  let title = data.label || "Input Spec / Prompt";
  let subtitle = data.prompt;
  let typeLabel = "input";

  if (sourceType === "workspace_spec") {
    title = data.label || "Workspace Spec Inbox";
    subtitle = `📄 Folder: ${data.specInboxPath || ".t3/specs/inbox"} (${data.selectedSpecFile || "auto"})`;
    typeLabel = "spec";
  } else if (sourceType === "github_issue") {
    title = data.label || "GitHub Issue Queue";
    subtitle = `🐙 Repo: ${data.githubRepo || "auto"} (${data.githubIssueNumber || "auto"} • label: ${data.githubRequiredLabel || "agent-queue"})`;
    typeLabel = "github";
  } else if (sourceType === "linear_issue") {
    title = data.label || "Linear Ticket Queue";
    subtitle = `📐 Team: ${data.linearTeam || "ENG"} (${data.linearIssueId || "auto"} • status: ${data.linearQueueStatus || "Ready for AI"})`;
    typeLabel = "linear";
  } else if (sourceType === "ci_error") {
    title = data.label || "CI / Error Log Watcher";
    subtitle = `🚨 Source: ${data.ciErrorSource || "terminal_logs"} (${data.ciLogFilePath || ".t3/logs/error.log"})`;
    typeLabel = "ci-log";
  }

  return (
    <BaseNodeCard
      id={id}
      title={title}
      subtitle={subtitle}
      typeLabel={typeLabel}
      status={data.status}
      selected={selected}
      icon={<FileText className="w-3.5 h-3.5" />}
      hasInputHandle={false}
    />
  );
}
