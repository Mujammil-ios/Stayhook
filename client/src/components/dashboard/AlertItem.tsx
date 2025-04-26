import { cn } from "@/lib/utils";

interface AlertItemProps {
  type: "warning" | "success" | "info";
  icon: string;
  title: string;
  description: string;
  timestamp: string;
}

const AlertItem = ({ type, icon, title, description, timestamp }: AlertItemProps) => {
  const typeStyles = {
    warning: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
    success: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    info: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
  };

  return (
    <li className="glass rounded-md p-4 hover:bg-opacity-70 transition-all">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <span className={cn("inline-flex items-center justify-center h-8 w-8 rounded-full", typeStyles[type])}>
            <i className={`ri-${icon}`}></i>
          </span>
        </div>
        <div className="ml-3 w-0 flex-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
          <div className="mt-2 flex">
            <span className="text-xs text-neutral-400">{timestamp}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default AlertItem;
