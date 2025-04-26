import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { occupancyTrendData } from "@/lib/data";

const OccupancyChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={occupancyTrendData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis 
            dataKey="month" 
            stroke={isDark ? "#9ca3af" : "#6b7280"} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke={isDark ? "#9ca3af" : "#6b7280"} 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e5e7eb',
              color: isDark ? '#f3f4f6' : '#1f2937'
            }}
            itemStyle={{
              color: isDark ? '#f3f4f6' : '#1f2937'
            }}
            formatter={(value) => [`${value}%`, '']}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="current"
            name="Current Period"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            name="Previous Period"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            dot={{ r: 4 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
