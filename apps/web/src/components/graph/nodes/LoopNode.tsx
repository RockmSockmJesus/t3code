import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { RotateCw } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function LoopNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  return (
    <BaseNodeCard
      id={id}
      title={data.label || "Loop / Retry Gate"}
      subtitle={`Attempt ${data.currentRetry || 0} / ${data.maxRetries || 3}`}
      typeLabel="loop counter"
      status={data.status}
      selected={selected}
      icon={<RotateCw className="w-3.5 h-3.5 text-purple-400" />}
      hasOutputHandle={false}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        id="loop"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
    </BaseNodeCard>
  );
}
