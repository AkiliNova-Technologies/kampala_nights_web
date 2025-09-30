"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon} from "lucide-react";

// Define the data structure
interface ChartData {
  hour: string;
  activity: number;
  isPeak?: boolean;
}

// Different datasets for different time ranges with peak markers
const dataByDuration = {
  "24h": [
    { hour: "10pm", activity: 25 },
    { hour: "11pm", activity: 35 },
    { hour: "12am", activity: 45 },
    { hour: "01am", activity: 60 },
    { hour: "02am", activity: 75 },
    { hour: "03am", activity: 85 },
    { hour: "04am", activity: 95, isPeak: true },
    { hour: "05am", activity: 90 },
    { hour: "06am", activity: 80 },
    { hour: "07am", activity: 70 },
    { hour: "08am", activity: 65 },
    { hour: "09am", activity: 55 },
    { hour: "10am", activity: 45 },
    { hour: "11am", activity: 35 },
    { hour: "12pm", activity: 30 },
    { hour: "01pm", activity: 25 },
  ],
  "12h": [
    { hour: "04am", activity: 95, isPeak: true },
    { hour: "05am", activity: 90 },
    { hour: "06am", activity: 80 },
    { hour: "07am", activity: 70 },
    { hour: "08am", activity: 65 },
    { hour: "09am", activity: 55 },
    { hour: "10am", activity: 45 },
    { hour: "11am", activity: 35 },
    { hour: "12pm", activity: 30 },
    { hour: "01pm", activity: 25 },
    { hour: "02pm", activity: 30 },
    { hour: "03pm", activity: 35 },
  ],
  "7d": [
    { hour: "Mon", activity: 45 },
    { hour: "Tue", activity: 55 },
    { hour: "Wed", activity: 65 },
    { hour: "Thu", activity: 75 },
    { hour: "Fri", activity: 85 },
    { hour: "Sat", activity: 95, isPeak: true },
    { hour: "Sun", activity: 80 },
  ],
  "30d": [
    { hour: "Week 1", activity: 45 },
    { hour: "Week 2", activity: 60 },
    { hour: "Week 3", activity: 75 },
    { hour: "Week 4", activity: 85, isPeak: true },
  ],
};

type DurationKey = keyof typeof dataByDuration;

// Properly typed tooltip component
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    payload: ChartData;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isPeakHour = dataPoint.isPeak;

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm text-foreground">{`${label}`}</p>
        <p className="text-primary">{`Activity: ${payload[0].value}%`}</p>
        {isPeakHour && (
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <span>Peak Hour</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};


export function PlatformActivityChart() {
  const [selectedDuration, setSelectedDuration] = useState<DurationKey>("24h");
  const currentData = dataByDuration[selectedDuration];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>
            User activity throughout the{" "}
            {selectedDuration === "24h"
              ? "day"
              : selectedDuration === "12h"
              ? "12 hours"
              : selectedDuration === "7d"
              ? "week"
              : "month"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              {selectedDuration}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedDuration("12h")}>
              12 Hours
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDuration("24h")}>
              24 Hours
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDuration("7d")}>
              7 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDuration("30d")}>
              30 Days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={currentData}
            margin={{ top: 15, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              axisLine={true}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="linear"
              dataKey="activity"
              stroke="#8884d8"
              fill="url(#activityGradient)"
              strokeWidth={2}
              activeDot={{
                r: 6,
                fill: "#8884d8",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
