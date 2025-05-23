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
export const birthColumns: ColumnDef<Athlete>[] = [
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
    accessorKey:"dateOfBirth",
    header: "Geburtstag",
    enableSorting: false,
  },
];


