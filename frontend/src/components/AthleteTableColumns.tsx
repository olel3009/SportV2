"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { Athlete } from "@/models/athlete"
import {
  ChartNoAxesCombined,
  MoreHorizontal,
  Medal,
  ArrowUp,
  ArrowDown,
  Pen,
  Download,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog"
import { FeatEntryCard, FeatEntryDialog } from "./featentry"
import { DialogTitle } from "@radix-ui/react-dialog"


function sortedHeader(column: Column<any, any>, headerName: string) {
  return (
    <Button
      className="flex justify-start items-center gap-1 pl-0"
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc")
        console.log(column.getIsSorted())
      }}
    >
      {headerName}
      {column.getIsSorted() === "asc" && <ArrowUp className="" />}
      {column.getIsSorted() === "desc" && <ArrowDown className="" />}
      {column.getIsSorted() === false && <ArrowDown className="opacity-0" />}
    </Button>
  )
}

export const columns: ColumnDef<Athlete>[] = [
  // Select
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-4"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },

  // First Name
  {
    accessorKey: "firstName",
    header: ({ column }) => sortedHeader(column, "Vorname")
  },

  // Last Name
  {
    accessorKey: "lastName",
    header: ({ column }) => sortedHeader(column, "Nachname")
  },

  // Sex
  {
    accessorKey: "sex",
    header: "Geschlecht",
    cell: ({ row }) => row.original.sex.toUpperCase(),
    enableGlobalFilter: false,
  },

  // Birthday
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => sortedHeader(column, "Geburtsdatum"),
    sortingFn: (rowA, rowB) => {
      const parseGermanDate = (dateString: string) => {
        const [day, month, year] = dateString.split(".");
        return new Date(`${year}-${month}-${day}`); // YYYY-MM-DD format
      };

      const dateA = parseGermanDate(rowA.original.dateOfBirth).getTime();
      const dateB = parseGermanDate(rowB.original.dateOfBirth).getTime();
      console.log(dateA)
      return dateA - dateB;
    },
  },

  // Medals
  {
    accessorKey: "goldMedals",
    header: ({ column }) => sortedHeader(column, "Medaillen"),
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const allMedals = row.original.goldMedals + row.original.silverMedals + row.original.bronzeMedals

      // Display icons for medals
      return (
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            {row.original.goldMedals >= 1 && (
              <Badge className="bg-yellow-300 text-yellow-900 pointer-events-none">
                <Medal className="h-5 w-5 mr-1" /> {row.original.goldMedals}
              </Badge>
            )}

            {row.original.silverMedals >= 1 && (
              <Badge className="bg-gray-300 text-gray-800 pointer-events-none">
                <Medal className="h-5 w-5 mr-1" /> {row.original.silverMedals}
              </Badge>
            )}

            {row.original.bronzeMedals >= 1 && (
              <Badge className="bg-orange-300 text-orange-900 pointer-events-none">
                <Medal className="h-5 w-5 mr-1" /> {row.original.bronzeMedals}
              </Badge>
            )}
          </div>
        </div>
      )

    },
    sortingFn: (rowA, rowB) => {
      const totalMedals = (athlete: Athlete) => athlete.bronzeMedals + athlete.goldMedals + athlete.silverMedals
      return totalMedals(rowA.original) - totalMedals(rowB.original)
    }
  },

  // Action
  {
    id: "actions",
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: ({ row }) => {

      return (
        <Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <ChartNoAxesCombined />
                  <span>Neue Leistung eintragen</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem><Download />Als CSV exportieren</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Pen />Editieren</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600"><Trash2 />Löschen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FeatEntryDialog athlete={row.original.firstName + " " + row.original.lastName} id={row.original.id} />

        </Dialog>
      )
    }
  },
]