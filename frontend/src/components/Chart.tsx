"use client";

import { useMemo } from "react";

type ChartData = {
  label: string;
  value: number;
  color?: string;
};

type BarChartProps = {
  data: ChartData[];
  title?: string;
  height?: number;
};

export function BarChart({ data, title, height = 200 }: BarChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="space-y-3" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm opacity-70 text-left">{item.label}</div>
            <div className="flex-1 relative">
              <div
                className="h-8 rounded-lg transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || "#D4AF37",
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type PieChartProps = {
  data: ChartData[];
  title?: string;
  size?: number;
};

export function PieChart({ data, title, size = 200 }: PieChartProps) {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  let currentAngle = 0;

  const colors = ["#D4AF37", "#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="flex items-center justify-center gap-8">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;

              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle += angle;

              const x1 = size / 2 + (size / 2) * Math.cos((startAngle * Math.PI) / 180);
              const y1 = size / 2 + (size / 2) * Math.sin((startAngle * Math.PI) / 180);
              const x2 = size / 2 + (size / 2) * Math.cos((endAngle * Math.PI) / 180);
              const y2 = size / 2 + (size / 2) * Math.sin((endAngle * Math.PI) / 180);

              return (
                <path
                  key={index}
                  d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color || colors[index % colors.length]}
                  className="transition-opacity hover:opacity-80"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-semibold text-gold">
                ({item.value} - {((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

