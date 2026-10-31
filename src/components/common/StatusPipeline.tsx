"use client";

import { Check } from "lucide-react";

interface StatusPipelineProps<T extends string> {
  stages: { id: T; label: string }[];
  currentStage: T;
  onStageClick?: (stage: T) => void;
  readOnly?: boolean;
}

export function StatusPipeline<T extends string>({
  stages,
  currentStage,
  onStageClick,
  readOnly = false,
}: StatusPipelineProps<T>) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="odoo-pipeline shadow-xs">
      {stages.map((stage, idx) => {
        const isActive = stage.id === currentStage;
        const isCompleted = idx < currentIndex;
        const isClickable = !readOnly && onStageClick;

        let statusClass = "bg-[#E9ECEF] text-gray-700";
        if (isActive) {
          statusClass = "active";
        } else if (isCompleted) {
          statusClass = "completed";
        }

        return (
          <button
            key={stage.id}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onStageClick(stage.id)}
            className={`odoo-pipeline-stage ${statusClass} ${
              isClickable ? "hover:brightness-95 cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="flex items-center space-x-1.5">
              {isCompleted && <Check className="w-3 h-3 text-gray-600" />}
              <span>{stage.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

