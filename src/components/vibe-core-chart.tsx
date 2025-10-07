"use client";

import { Area, AreaChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VibeData {
  day: string;
  vibe: number;
}

interface VibeCoreChartProps {
  data: VibeData[];
  title?: string;
  className?: string;
  showTooltip?: boolean;
  animate?: boolean;
}

export function VibeCoreChart({
  data,
  title,
  className = "",
  showTooltip = true,
  animate = true,
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
        className="h-20 w-full"
      >
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="vibeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="vibe"
            type="natural"
            fill="url(#vibeGradient)"
            stroke="#8884d8"
            strokeWidth={1.5}
            isAnimationActive={animate}
            animationDuration={1000}
          />
          {showTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} points`]}
                />
              }
            />
          )}
        </AreaChart>
      </ChartContainer>

      {/* Day labels */}
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        {data.map((item) => (
          <span key={item.day} className="text-xs">
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}
