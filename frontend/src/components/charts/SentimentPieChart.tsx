import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface SentimentPieChartProps {
  data: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
}

export const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ data }) => {
  const { resolvedTheme } = useTheme();

  const chartData = [
    { name: 'Positive', value: data.positive, color: '#10b981' },
    { name: 'Negative', value: data.negative, color: '#f43f5e' },
    { name: 'Mixed', value: data.mixed, color: '#f59e0b' },
    { name: 'Neutral', value: data.neutral, color: '#0ea5e9' },
  ].filter((item) => item.value > 0);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm italic">
        No sentiment data available
      </div>
    );
  }

  const tooltipBg = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipText = resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a';
  const tooltipBorder = resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              color: tooltipText,
              borderRadius: '12px',
              border: `1px solid ${tooltipBorder}`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any) => [
              `${value} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
