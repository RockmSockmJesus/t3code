import type { NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function InputNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  const isSpecFolder = data.inputSourceType === "workspace_spec";
  const subtitle = isSpecFolder
    ? `📄 Folder: ${data.specInboxPath || ".t3/specs/inbox"} (${data.selectedSpecFile || "auto"})`
    : data.prompt;

  return (
    <BaseNodeCard
      id={id}
      title={data.label || (isSpecFolder ? "Workspace Spec Inbox" : "Input Spec / Prompt")}
      subtitle={subtitle}
      typeLabel={isSpecFolder ? "spec" : "input"}
      status={data.status}
      selected={selected}
      icon={<FileText className="w-3.5 h-3.5" />}
      hasInputHandle={false}
    />
  );
}
