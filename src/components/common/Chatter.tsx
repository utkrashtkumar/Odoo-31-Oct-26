"use client";

import { useState } from "react";
import { MessageSquare, FileText, Send, User } from "lucide-react";
import { ActivityLog } from "@/types";
import { formatDate } from "@/lib/utils";

interface ChatterProps {
  entityType: string;
  entityId: string;
  initialLogs?: ActivityLog[];
}

export function Chatter({
  entityType,
  entityId,
  initialLogs = [],
}: ChatterProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [activeTab, setActiveTab] = useState<"message" | "note">("note");
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      entity_type: entityType,
      entity_id: entityId,
      action: activeTab === "message" ? "send_message" : "log_note",
      message: inputText.trim(),
      created_at: new Date().toISOString(),
      user: {
        id: "current-user",
        name: "Alex Vance (Staff)",
        email: "alex@odoo.com",
        role: "admin",
        created_at: new Date().toISOString(),
      },
    };

    setLogs([newLog, ...logs]);
    setInputText("");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-odoo-border rounded-lg shadow-xs overflow-hidden mt-6">
      {/* Top action tabs */}
      <div className="flex items-center justify-between border-b border-odoo-border bg-gray-50/70 px-4 py-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("message")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition ${
              activeTab === "message"
                ? "bg-odoo-purple text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("note")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition ${
              activeTab === "note"
                ? "bg-odoo-purple text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Log Note</span>
          </button>
        </div>

        <span className="text-[11px] text-gray-500 font-mono">
          Activity Stream • Timeline
        </span>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50/30 border-b border-odoo-border">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeTab === "message"
                ? "Send an email message to the customer..."
                : "Log an internal staff note (visible only to your team)..."
            }
            rows={2}
            className="w-full text-xs p-3 border border-odoo-border rounded-md focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple bg-white resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting || !inputText.trim()}
              className="bg-odoo-purple hover:bg-odoo-purple-dark disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center space-x-1.5 shadow-xs transition"
            >
              <Send className="w-3 h-3" />
              <span>{activeTab === "message" ? "Send to Customer" : "Log Internal Note"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Activity Timeline List */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-4">
            No activities or notes logged yet.
          </p>
        ) : (
          logs.map((log) => {
            const isNote = log.action === "log_note";
            return (
              <div key={log.id} className="flex space-x-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-gray-300">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-odoo-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      {log.user?.name || "System"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(log.created_at, "MMM dd, yyyy • h:mm a")}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {isNote && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-semibold px-1.5 py-0.5 rounded mr-1.5">
                        Internal Note
                      </span>
                    )}
                    {log.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

