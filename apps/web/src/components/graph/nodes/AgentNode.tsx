import type { NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function AgentNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  return (
    <BaseNodeCard
      id={id}
      title={data.label || "Agent Node"}
      subtitle={data.prompt}
      typeLabel={`agent (${data.engine || "t3"})`}
      status={data.status}
      selected={selected}
      icon={<Bot className="w-3.5 h-3.5 text-blue-400" />}
    />
  );
}
