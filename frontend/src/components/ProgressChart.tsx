"use client";

import { Feat } from "@/models/athlete";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  result: {
    label: "Ergebnis",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface MonthlyChartData {
  dateKey: string;
  result: number | null;
  unit: string;
}

export default function ProgressChart({ results }: { results: Feat[] }) {
  if (!results || results.length === 0) return <></>;

  const processedFeats = results
    .map((feat) => ({
      date: new Date(feat.updated_at),
      result: feat.result,
      unit: feat.ruling?.unit || "",
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (processedFeats.length === 0) {
    return <></>;
  }

  const firstDataDate = processedFeats[0].date;
  const lastDataDate = processedFeats[processedFeats.length - 1].date;
  const minDataYear = firstDataDate.getUTCFullYear();

  const chartData: MonthlyChartData[] = [];
  const currentIterDate = new Date(
    Date.UTC(firstDataDate.getUTCFullYear(), firstDataDate.getUTCMonth(), 1)
  );
  const endDateBoundary = new Date(
    Date.UTC(lastDataDate.getUTCFullYear(), lastDataDate.getUTCMonth(), 1)
  );

  while (currentIterDate <= endDateBoundary) {
    const year = currentIterDate.getUTCFullYear();
    const month = currentIterDate.getUTCMonth();

    const dateKey = `$`
  }

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 0,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={true} axisLine={false} tickMargin={8} />
        <YAxis axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillResult" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-result)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-result)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="result"
          type="natural"
          fill="url(#fillResult)"
          fillOpacity={0.4}
          stroke="var(--color-result)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
