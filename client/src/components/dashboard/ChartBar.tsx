import { useEffect, useRef } from "react";

interface ChartBarProps {
  label: string;
  total: number;
  occupied: number;
  percentage: number;
  color?: string;
}

const ChartBar = ({ label, total, occupied, percentage, color = "bg-primary" }: ChartBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the bar on mount
    const timer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${percentage}%`;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-neutral-500">{occupied}/{total} occupied</div>
      </div>
      <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div ref={barRef} className={`h-full ${color} rounded-full`} style={{ width: "0%" }}></div>
      </div>
    </div>
  );
};

export default ChartBar;
