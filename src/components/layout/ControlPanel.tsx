"use client";

import React from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, 
  List, Kanban, BarChart3, RotateCw 
} from "lucide-react";

interface ControlPanelProps {
  breadcrumbs: { label: string; href?: string }[];
  searchPlaceholder?: string;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  filters?: { id: string; label: string }[];
  activeView?: "list" | "kanban" | "graph";
  onViewChange?: (view: "list" | "kanban" | "graph") => void;
  onNewClick?: () => void;
  newButtonLabel?: string;
  onRefresh?: () => void;
  customActions?: React.ReactNode;
}

export function ControlPanel({
  breadcrumbs,
  searchPlaceholder = "Search records...",
  searchTerm = "",
  onSearchChange,
  activeFilter = "all",
  onFilterChange,
  filters = [],
  activeView = "list",
  onViewChange,
  onNewClick,
  newButtonLabel = "New",
  onRefresh,
  customActions,
}: ControlPanelProps) {
  return (
    <div className="bg-white border-b border-odoo-border px-4 py-2.5 shadow-sm select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Breadcrumbs & Primary Action Button */}
        <div className="flex items-center space-x-4">
          {onNewClick && (
            <button
              onClick={onNewClick}
              className="bg-odoo-purple hover:bg-odoo-purple-dark text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center space-x-1 shadow-sm transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{newButtonLabel}</span>
            </button>
          )}

          {/* Breadcrumb Path */}
          <nav className="flex items-center space-x-1.5 text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <span className="text-gray-400 text-xs">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-odoo-purple hover:underline font-medium text-xs md:text-sm"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-semibold text-xs md:text-sm">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100 transition"
              title="Refresh records"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center/Right: Search, Filters & View Switcher */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Custom page-specific actions */}
          {customActions}

          {/* Search Input with magnifying glass */}
          {onSearchChange && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8 pr-3 py-1 text-xs border border-odoo-border rounded focus:outline-none focus:border-odoo-purple focus:ring-1 focus:ring-odoo-purple w-44 md:w-56 bg-odoo-canvas transition"
              />
            </div>
          )}

          {/* Filters Dropdown/Pills */}
          {filters.length > 0 && onFilterChange && (
            <div className="flex items-center space-x-1 bg-gray-100 p-0.5 rounded border border-odoo-border text-xs">
              <Filter className="w-3 h-3 text-gray-500 ml-1.5 mr-0.5" />
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onFilterChange(f.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    activeFilter === f.id
                      ? "bg-white text-odoo-purple shadow-xs font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* View Switcher (List vs Kanban vs Graph) */}
          {onViewChange && (
            <div className="flex items-center space-x-0.5 bg-gray-100 p-0.5 rounded border border-odoo-border">
              <button
                onClick={() => onViewChange("list")}
                className={`p-1 rounded transition ${
                  activeView === "list" ? "bg-white text-odoo-purple shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewChange("kanban")}
                className={`p-1 rounded transition ${
                  activeView === "kanban" ? "bg-white text-odoo-purple shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
                title="Kanban View"
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewChange("graph")}
                className={`p-1 rounded transition ${
                  activeView === "graph" ? "bg-white text-odoo-purple shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
                title="Analytics & Pivot View"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

