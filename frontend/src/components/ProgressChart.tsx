"use client";

import { Feat } from "@/models/athlete";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import { Area, AreaChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import { getUtcTimecodeFromGermanDate } from "@/date_format";

const chartConfig = {
  result: {
    label: "Ergebnis",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ResultChartData {
  formattedDate: string;
  originalDate: number;
  result: number;
  unit: string;
}

function FormatDateDDMMYY(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

export default function ProgressChart({ results }: { results: Feat[] }) {
  if (!results || results.length === 0) return <></>;

  const data: ResultChartData[] = results
    .map((feat) => {
      const originalDate = getUtcTimecodeFromGermanDate(feat.year || "")
      return {
        originalDate: originalDate?.timestamp || 0,
        formattedDate: feat.year || "",
        result: feat.result,
        unit: feat.ruling?.unit || "",
      };
    })
    .sort((a, b) => a.originalDate - b.originalDate);

  if (data.length === 0) {
    return <></>;
  }

  const dataUnit = data[0].unit;

  return (
    <ChartContainer config={chartConfig} className="h-60 min-w-10 w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        height={0}
        margin={{
          left: -20,
          right: 35,
          top: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="formattedDate"
          tickLine={true}
          axisLine={false}
          tickMargin={4}
          interval={1}
        >
          <Label value="Datum" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis
          label={{ value: dataUnit, angle: -90 }}
          axisLine={false}
          tickLine={false}
          allowDataOverflow={true}
          type="number"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
          labelFormatter={(labelValue: string) => {
            return labelValue;
          }}
        />
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
          type="linear"
          fill="url(#fillResult)"
          fillOpacity={0.4}
          stroke="var(--color-result)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
