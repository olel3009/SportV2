"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Athlete } from "@/models/athlete"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Athlete>[] = [
    {
        accessorKey: "firstName",
        header: "Vorname"
    },
    {
        accessorKey: "lastName",
        header: "Nachname"
    },
    {
        accessorKey: "sex",
        header: "Geschlecht"
    },
    {
        accessorKey: "dateOfBirth",
        header: "Geburtstag"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View customer</DropdownMenuItem>
                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },
]