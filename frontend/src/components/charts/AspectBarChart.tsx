import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { AspectSummaryItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AspectBarChartProps {
  data: AspectSummaryItem[];
  limit?: number;
}

export const AspectBarChart: React.FC<AspectBarChartProps> = ({ data, limit = 8 }) => {
  const { resolvedTheme } = useTheme();

  const chartData = data.slice(0, limit).map((item) => ({
    name: item.aspect_name,
    Positive: item.positive_count,
    Negative: item.negative_count,
    Mixed: item.mixed_count,
    Neutral: item.neutral_count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400 text-sm italic">
        No aspect data available
      </div>
    );
  }

  const tooltipBg = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipText = resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a';
  const tooltipBorder = resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const gridColor = resolvedTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 11, fill: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              color: tooltipText,
              borderRadius: '12px',
              border: `1px solid ${tooltipBorder}`,
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '10px' }}
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
          />
          <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Mixed" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Neutral" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Negative" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
