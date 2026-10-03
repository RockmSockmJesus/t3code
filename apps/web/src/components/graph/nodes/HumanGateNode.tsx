import type { NodeProps } from "@xyflow/react";
import { UserCheck } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function HumanGateNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  return (
    <BaseNodeCard
      id={id}
      title={data.label || "Human Approval Gate"}
      subtitle="Requires manual review before advancing"
      typeLabel="human gate"
      status={data.status}
      selected={selected}
      icon={<UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
    />
  );
}
