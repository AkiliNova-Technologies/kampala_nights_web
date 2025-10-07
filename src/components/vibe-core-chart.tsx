"use client";

import { Bar, BarChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VibeData {
  time: string;
  vibe: number;
}

interface VibeCoreChartProps {
  data: VibeData[];
  title?: string;
  className?: string;
  showTooltip?: boolean;
  animate?: boolean;
  chartHeight?: number;
  barSize?: number;
}

export function VibeCoreChart({
  data,
  title,
  className = "",
  showTooltip = true,
  animate = true,
  chartHeight = 100,
  barSize = 25,
}: VibeCoreChartProps) {
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title ? title : ""}</h3>

      <ChartContainer
        config={{
          vibe: {
            label: "Vibe Score",
            color: "hsl(var(--primary))",
          },
        }}
        className="w-full"
        style={{ height: `${chartHeight}px` }}
      >
        <BarChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          barSize={barSize}
          barGap={2}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5014D0" stopOpacity={1} />
              <stop offset="100%" stopColor="#E7E0FB" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Bar
            dataKey="vibe"
            fill="url(#barGradient)"
            radius={[20, 20, 20, 20]}
            isAnimationActive={animate}
            animationDuration={1000}
            activeBar={{
              fill: "url(#barGradient)",
              opacity: 0.7,
              radius: 20,
            }}
            
          />
          {showTooltip && (
            <ChartTooltip
              cursor={{ fill: "rgba(80, 20, 208, 0.1)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} points`]}
                />
              }
            />
          )}
        </BarChart>
      </ChartContainer>

      {/* Time labels */}
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        {data.map((item) => (
          <span key={item.time} className="text-xs">
            {item.time}
          </span>
        ))}
      </div>
    </div>
  );
}
