import { Trash2, X } from "lucide-react";
import { useGraphStore } from "../../graph/graphStore";

export function NodeInspectorDrawer() {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
    deleteNode,
    selectNode,
    approveHumanGate,
    rejectHumanGate,
  } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const data = selectedNode.data;

  return (
    <div className="absolute right-2 top-14 bottom-2 w-72 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-lg z-20 flex flex-col p-3 text-xs overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
        <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
          Node Inspector
        </span>
        <button
          onClick={() => selectNode(null)}
          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        <div>
          <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
            Node Label
          </label>
          <input
            type="text"
            value={data.label || ""}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
            Type
          </label>
          <input
            type="text"
            disabled
            value={data.nodeType}
            className="w-full bg-muted/50 border border-border/50 rounded px-2 py-1 text-muted-foreground font-mono"
          />
        </div>

        {data.nodeType === "agent" && (
          <>
            <div>
              <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                Execution Engine
              </label>
              <select
                value={data.engine || "t3-acp"}
                onChange={(e) => updateNodeData(selectedNode.id, { engine: e.target.value as any })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="t3-acp">T3 Code Native (ACP)</option>
                <option value="claude-code">Claude Code CLI</option>
                <option value="opencode">OpenCode CLI</option>
                <option value="codex">Codex Service</option>
                <option value="antigravity">Antigravity Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                Agent Prompt / Instructions
              </label>
              <textarea
                rows={4}
                value={data.prompt || ""}
                onChange={(e) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
                className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </>
        )}

        {data.nodeType === "input" && (
          <div className="space-y-3">
            <div>
              <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                Input Source Type
              </label>
              <select
                value={data.inputSourceType || "manual"}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, {
                    inputSourceType: e.target.value as any,
                    specInboxPath: data.specInboxPath || ".t3/specs/inbox",
                    specDonePath: data.specDonePath || ".t3/specs/done",
                    specFailedPath: data.specFailedPath || ".t3/specs/failed",
                    updateInFileStatus: data.updateInFileStatus ?? true,
                    moveFileOnCompletion: data.moveFileOnCompletion ?? true,
                    githubRepo: data.githubRepo || "auto",
                    githubRequiredLabel: data.githubRequiredLabel || "agent-queue",
                    githubAuthorPermission: data.githubAuthorPermission || "collaborators",
                    githubIssueNumber: data.githubIssueNumber || "auto",
                    githubActionOnComplete: data.githubActionOnComplete || "create_pr",
                    githubInProgressLabel: data.githubInProgressLabel || "in-progress",
                    githubDoneLabel: data.githubDoneLabel || "fixed-by-agent",
                    linearTeam: data.linearTeam || "ENG",
                    linearQueueStatus: data.linearQueueStatus || "Ready for AI",
                    linearInProgressStatus: data.linearInProgressStatus || "In Progress",
                    linearDoneStatus: data.linearDoneStatus || "Done",
                    linearIssueId: data.linearIssueId || "auto",
                    linearAutoAssign: data.linearAutoAssign ?? true,
                    ciErrorSource: data.ciErrorSource || "terminal_logs",
                    ciLogFilePath: data.ciLogFilePath || ".t3/logs/error.log",
                    ciWorkflowName: data.ciWorkflowName || "CI / Build Checks",
                    ciAutoCreateIssue: data.ciAutoCreateIssue ?? true,
                  })
                }
                className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="manual">📝 Freeform Prompt</option>
                <option value="workspace_spec">📄 Workspace Spec Folder</option>
                <option value="github_issue">🐙 GitHub Issue Queue</option>
                <option value="linear_issue">📐 Linear Ticket Queue</option>
                <option value="ci_error">🚨 CI / Error Log Watcher</option>
              </select>
            </div>

            {(data.inputSourceType === "manual" || !data.inputSourceType) && (
              <div>
                <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                  Spec / Task Brief
                </label>
                <textarea
                  rows={5}
                  value={data.prompt || ""}
                  onChange={(e) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
                  className="w-full bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            )}

            {data.inputSourceType === "workspace_spec" && (
              <div className="space-y-2.5 border border-border/80 rounded p-2 bg-muted/20">
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Inbox Folder (To-Do)
                  </label>
                  <input
                    type="text"
                    value={data.specInboxPath || ".t3/specs/inbox"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { specInboxPath: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Done Folder (Success)
                  </label>
                  <input
                    type="text"
                    value={data.specDonePath || ".t3/specs/done"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { specDonePath: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Failed Folder (Error)
                  </label>
                  <input
                    type="text"
                    value={data.specFailedPath || ".t3/specs/failed"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { specFailedPath: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Spec File Target
                  </label>
                  <input
                    type="text"
                    placeholder="auto (first file) or filename.md"
                    value={data.selectedSpecFile || "auto"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { selectedSpecFile: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="pt-1 space-y-1.5 border-t border-border/40">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-foreground">
                    <input
                      type="checkbox"
                      checked={data.moveFileOnCompletion ?? true}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, { moveFileOnCompletion: e.target.checked })
                      }
                      className="rounded border-border bg-background text-primary focus:ring-primary"
                    />
                    <span>Move file to Done/Failed folder</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-foreground">
                    <input
                      type="checkbox"
                      checked={data.updateInFileStatus ?? true}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, { updateInFileStatus: e.target.checked })
                      }
                      className="rounded border-border bg-background text-primary focus:ring-primary"
                    />
                    <span>Update status & checklist in .md file</span>
                  </label>
                </div>
              </div>
            )}

            {data.inputSourceType === "github_issue" && (
              <div className="space-y-2.5 border border-border/80 rounded p-2 bg-muted/20">
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    GitHub Repository
                  </label>
                  <input
                    type="text"
                    placeholder="owner/repo or auto"
                    value={data.githubRepo || "auto"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { githubRepo: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Trigger Label Filter
                  </label>
                  <input
                    type="text"
                    value={data.githubRequiredLabel || "agent-queue"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { githubRequiredLabel: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Security Author Filter
                  </label>
                  <select
                    value={data.githubAuthorPermission || "collaborators"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        githubAuthorPermission: e.target.value as any,
                      })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 text-foreground text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="collaborators">🔒 Maintainers & Collaborators only</option>
                    <option value="allowlist">📋 Custom User Allowlist</option>
                    <option value="any">⚠️ Any Author (Public Queue)</option>
                  </select>
                </div>

                {data.githubAuthorPermission === "allowlist" && (
                  <div>
                    <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                      Allowed Authors (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="octocat, graham, dev1"
                      value={data.githubAllowedAuthors || ""}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, { githubAllowedAuthors: e.target.value })
                      }
                      className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Target Issue Selection
                  </label>
                  <input
                    type="text"
                    placeholder="auto (next in queue) or #123"
                    value={data.githubIssueNumber || "auto"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { githubIssueNumber: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    On Execution Completion
                  </label>
                  <select
                    value={data.githubActionOnComplete || "create_pr"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, {
                        githubActionOnComplete: e.target.value as any,
                      })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 text-foreground text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="create_pr">🔀 Create Pull Request & Link Issue</option>
                    <option value="comment_and_close">💬 Post Summary Comment & Close</option>
                    <option value="update_label">🏷️ Update Issue Labels Only</option>
                  </select>
                </div>
              </div>
            )}

            {data.inputSourceType === "linear_issue" && (
              <div className="space-y-2.5 border border-border/80 rounded p-2 bg-muted/20">
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Linear Team Key
                  </label>
                  <input
                    type="text"
                    value={data.linearTeam || "ENG"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { linearTeam: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Trigger Queue Status (Inbox)
                  </label>
                  <input
                    type="text"
                    value={data.linearQueueStatus || "Ready for AI"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { linearQueueStatus: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    In Progress Status
                  </label>
                  <input
                    type="text"
                    value={data.linearInProgressStatus || "In Progress"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { linearInProgressStatus: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Completion Status
                  </label>
                  <input
                    type="text"
                    value={data.linearDoneStatus || "Done"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { linearDoneStatus: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Ticket ID Target
                  </label>
                  <input
                    type="text"
                    placeholder="auto (next in status) or ENG-101"
                    value={data.linearIssueId || "auto"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { linearIssueId: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="pt-1 border-t border-border/40">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-foreground">
                    <input
                      type="checkbox"
                      checked={data.linearAutoAssign ?? true}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, { linearAutoAssign: e.target.checked })
                      }
                      className="rounded border-border bg-background text-primary focus:ring-primary"
                    />
                    <span>Auto-assign ticket to AI Agent on execution</span>
                  </label>
                </div>
              </div>
            )}

            {data.inputSourceType === "ci_error" && (
              <div className="space-y-2.5 border border-border/80 rounded p-2 bg-muted/20">
                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    CI / Error Log Source
                  </label>
                  <select
                    value={data.ciErrorSource || "terminal_logs"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { ciErrorSource: e.target.value as any })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 text-foreground text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="terminal_logs">💻 Local Terminal / Dev Server Errors</option>
                    <option value="github_actions">⚙️ GitHub Actions Workflow Failures</option>
                    <option value="custom_log_file">📄 Custom Log File Watcher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Log File Path / Target
                  </label>
                  <input
                    type="text"
                    value={data.ciLogFilePath || ".t3/logs/error.log"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { ciLogFilePath: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
                    Workflow / Service Name
                  </label>
                  <input
                    type="text"
                    value={data.ciWorkflowName || "CI / Build Checks"}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { ciWorkflowName: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="pt-1 border-t border-border/40">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-foreground">
                    <input
                      type="checkbox"
                      checked={data.ciAutoCreateIssue ?? true}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, { ciAutoCreateIssue: e.target.checked })
                      }
                      className="rounded border-border bg-background text-primary focus:ring-primary"
                    />
                    <span>Auto-create Issue report on CI failure</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {data.nodeType === "action" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Shell Command
            </label>
            <input
              type="text"
              value={data.command || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { command: e.target.value })}
              className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {data.nodeType === "router" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Pass Condition Rule
            </label>
            <input
              type="text"
              value={data.condition || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
              className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {data.nodeType === "loop" && (
          <div>
            <label className="block text-muted-foreground text-[10px] uppercase font-mono mb-1">
              Max Retry Count
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={data.maxRetries || 3}
              onChange={(e) =>
                updateNodeData(selectedNode.id, { maxRetries: parseInt(e.target.value) || 1 })
              }
              className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
        {data.nodeType === "human" && (
          <div className="space-y-2 border border-cyan-500/30 rounded p-2 bg-cyan-500/5">
            <label className="block text-cyan-400 text-[10px] uppercase font-mono font-semibold">
              Human Approval Gate Controls
            </label>
            <p className="text-[10px] text-muted-foreground">
              {data.status === "paused"
                ? "Workflow is PAUSED awaiting your approval decision."
                : "When graph execution reaches this node, it pauses until approved."}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => approveHumanGate(selectedNode.id)}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded py-1 text-[11px] font-medium transition-colors"
              >
                ✓ Approve & Continue
              </button>
              <button
                type="button"
                onClick={() => rejectHumanGate(selectedNode.id)}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded py-1 text-[11px] font-medium transition-colors"
              >
                ✕ Reject & Abort
              </button>
            </div>
          </div>
        )}

        {Array.isArray(data.logs) && data.logs.length > 0 && (
          <div className="space-y-1.5 border border-border rounded p-2 bg-black/40">
            <label className="block text-muted-foreground text-[10px] uppercase font-mono">
              Execution Logs ({data.logs.length})
            </label>
            <div className="font-mono text-[10px] text-slate-300 space-y-1 max-h-36 overflow-y-auto pr-1">
              {data.logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-tight border-b border-border/20 pb-0.5 ${
                    log.includes("[ERROR]")
                      ? "text-rose-400"
                      : log.includes("[SUCCESS]")
                        ? "text-emerald-400"
                        : log.includes("[AGENT]")
                          ? "text-blue-400"
                          : log.includes("[ACTION]")
                            ? "text-amber-300"
                            : "text-slate-300"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-2 mt-3 flex justify-end">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="flex items-center gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  );
}
