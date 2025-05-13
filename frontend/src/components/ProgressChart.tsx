"use client"

import { Feat } from "@/models/athlete";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  result: {
    label: "Ergebnis",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface ResultChartData {
  result: number
  unit: string
  date: string
}

export default function ProgressChart({ results }: { results: Feat[] }) {
  if (!results) return (<></>)
  const data: ResultChartData[] = results.map(feat => ({
    result: feat.result,
    unit: feat.ruling?.unit || "",
    date: new Date(feat.updated_at).getUTCFullYear().toString(),
  }))

  return (
    <ChartContainer config={chartConfig} className="h-80">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
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
  )
}