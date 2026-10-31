import { Activity } from "lucide-react";

interface HealthScoreBadgeProps {
  score: number;
  label?: "healthy" | "at-risk" | "critical";
  size?: "sm" | "md";
}

export function HealthScoreBadge({ score, label, size = "md" }: HealthScoreBadgeProps) {
  const computedLabel = label || (score >= 70 ? "healthy" : score >= 40 ? "at-risk" : "critical");

  let colorClasses = "bg-green-100 text-green-800 border-green-200";
  if (computedLabel === "at-risk") {
    colorClasses = "bg-amber-100 text-amber-800 border-amber-200";
  } else if (computedLabel === "critical") {
    colorClasses = "bg-red-100 text-red-800 border-red-200";
  }

  const isSmall = size === "sm";

  return (
    <div
      className={`inline-flex items-center space-x-1.5 font-semibold border rounded-full ${colorClasses} ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
      title={`Health Score: ${score}/100 (${computedLabel.toUpperCase()})`}
    >
      <Activity className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{score} Health</span>
    </div>
  );
}

