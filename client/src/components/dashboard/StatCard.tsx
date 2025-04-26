interface StatCardProps {
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  title: string;
  value: string | number;
  change: number;
  isPercentage?: boolean;
  prefix?: string;
}

const StatCard = ({
  icon,
  iconBgColor,
  iconTextColor,
  title,
  value,
  change,
  isPercentage = false,
  prefix = "",
}: StatCardProps) => {
  return (
    <div className="glass overflow-hidden rounded-lg shadow-glass transition-all hover:shadow-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md ${iconBgColor} p-3`}>
            <i className={`ri-${icon} text-xl ${iconTextColor}`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold">{prefix}{value}{isPercentage && "%"}</div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <i className={`ri-arrow-${change >= 0 ? 'up' : 'down'}-s-fill`}></i>
                  <span className="sr-only">{change >= 0 ? 'Increased' : 'Decreased'} by</span>
                  {Math.abs(change)}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
