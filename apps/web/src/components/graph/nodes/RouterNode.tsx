import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { GitFork } from "lucide-react";
import type { CustomGraphNode } from "../../../graph/graphTypes";
import { BaseNodeCard } from "./BaseNodeCard";

export function RouterNode({ id, data, selected }: NodeProps<CustomGraphNode>) {
  return (
    <BaseNodeCard
      id={id}
      title={data.label || "Router / Condition"}
      subtitle={data.condition || "If / Else condition"}
      typeLabel="if/else router"
      status={data.status}
      selected={selected}
      icon={<GitFork className="w-3.5 h-3.5 text-amber-400" />}
      hasOutputHandle={false}
    >
      <div className="flex items-center justify-between text-[10px] font-mono mt-1 pt-1 border-t border-border/40">
        <span className="text-emerald-400 flex items-center gap-1">Pass ➔</span>
        <span className="text-rose-400 flex items-center gap-1">➔ Fail</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="pass"
        style={{ left: "30%" }}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="fail"
        style={{ left: "70%" }}
        className="!w-3 !h-3 !bg-rose-500 !border-2 !border-background"
      />
    </BaseNodeCard>
  );
}
