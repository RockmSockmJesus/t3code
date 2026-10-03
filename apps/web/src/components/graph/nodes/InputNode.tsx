import type { NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function InputNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  return (
    <BaseNodeCard
      id={id}
      title={data.label || "Input Spec / Prompt"}
      subtitle={data.prompt}
      typeLabel="input"
      status={data.status}
      selected={selected}
      icon={<FileText className="w-3.5 h-3.5" />}
      hasInputHandle={false}
    />
  );
}
