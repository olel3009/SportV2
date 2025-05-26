"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Athlete } from "@/models/athlete";
import { Badge } from "@/components/ui/badge";
import { Medal } from "lucide-react";

// Badge for medal display
const MedalDisplay = ({ type, text }: { type: string; text: string }) => {
  const colors =
    type === "Gold"
      ? "bg-yellow-300 text-yellow-900"
      : type === "Bronze"
      ? "bg-orange-300 text-orange-900"
      : type === "Silber"
      ? "bg-gray-300 text-gray-800"
      : "invisible";

  return (
    <Badge className={`${colors} flex items-center pointer-events-none`}>
      <Medal className="h-5 w-5 mr-1" />
      {text && <span>{text}</span>}
    </Badge>
  );
};

// Column definitions with default multi-level sorting on medals
export const columns: ColumnDef<Athlete>[] = [
  {
    accessorKey: "firstName",
    header: "Vorname",
    enableSorting: false,
  },
  {
    accessorKey: "lastName",
    header: "Nachname",
    enableSorting: false,
  },
  {
    accessorKey: "goldMedals",
    header: "Goldmedaillen",
    enableSorting: true,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <MedalDisplay type="Gold" text={String(row.original.goldMedals)} />
    ),
    sortingFn: (rowA, rowB) => rowB.original.goldMedals - rowA.original.goldMedals,
  },
  {
    accessorKey: "silverMedals",
    header: "Silbermedaillen",
    enableSorting: true,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <MedalDisplay type="Silber" text={String(row.original.silverMedals)} />
    ),
    sortingFn: (rowA, rowB) => rowB.original.silverMedals - rowA.original.silverMedals,
  },
  {
    accessorKey: "bronzeMedals",
    header: "Bronzemedaillen",
    enableSorting: true,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <MedalDisplay type="Bronze" text={String(row.original.bronzeMedals)} />
    ),
    sortingFn: (rowA, rowB) => rowB.original.bronzeMedals - rowA.original.bronzeMedals,
  },
];

// Default sorting specification: first gold, then silver, then bronze (all descending)
export const defaultSorting = [
  { id: "goldMedals", desc: true },
  { id: "silverMedals", desc: true },
  { id: "bronzeMedals", desc: true },
];

// In your table setup, pass initialState: { sorting: defaultSorting } to apply this order by default.
