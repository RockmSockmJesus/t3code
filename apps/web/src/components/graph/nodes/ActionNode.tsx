import type { NodeProps } from "@xyflow/react";
import { Terminal } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function ActionNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  return (
    <BaseNodeCard
      id={id}
      title={data.label || "Action / Command"}
      subtitle={data.command}
      typeLabel="action / script"
      status={data.status}
      selected={selected}
      icon={<Terminal className="w-3.5 h-3.5 text-emerald-400" />}
    />
  );
}
