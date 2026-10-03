import type { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeExecutionStatus } from "../../../graph/graphTypes";

export interface BaseNodeCardProps {
  id: string;
  title: string;
  subtitle?: string;
  typeLabel: string;
  status: NodeExecutionStatus;
  selected?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  hasInputHandle?: boolean;
  hasOutputHandle?: boolean;
}

export function BaseNodeCard({
  title,
  subtitle,
  typeLabel,
  status,
  selected,
  icon,
  children,
  hasInputHandle = true,
  hasOutputHandle = true,
}: BaseNodeCardProps) {
  const getStatusBorder = () => {
    switch (status) {
      case "running":
        return "border-blue-500 ring-2 ring-blue-500/30 animate-pulse";
      case "success":
        return "border-emerald-500 ring-1 ring-emerald-500/30";
      case "failure":
        return "border-rose-500 ring-1 ring-rose-500/30";
      case "paused":
        return "border-amber-500 ring-1 ring-amber-500/30";
      default:
        return selected ? "border-primary ring-1 ring-primary/40" : "border-border";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "running":
        return <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">RUNNING</span>;
      case "success":
        return <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">PASSED</span>;
      case "failure":
        return <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-mono">FAILED</span>;
      case "paused":
        return <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">PAUSED</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-w-56 max-w-72 bg-card text-card-foreground rounded-lg border shadow-sm p-3 transition-all ${getStatusBorder()}`}
    >
      {hasInputHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
        />
      )}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          <div className="truncate font-medium text-xs text-foreground">{title}</div>
        </div>
        {getStatusBadge()}
      </div>
      {subtitle && <div className="text-[11px] text-muted-foreground mb-1.5 line-clamp-2">{subtitle}</div>}
      {children}
      <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-muted-foreground/80 font-mono">
        <span>{typeLabel.toUpperCase()}</span>
      </div>
      {hasOutputHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
        />
      )}
    </div>
  );
}
