"use client"
import { useRouter } from "next/navigation"

import styles from "./page.module.css";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "@/components/AthleteTableColumns"
import { getAllAthletes } from "@/athlete_getters";

export default function Page() {
    const router = useRouter();

    return (
        <div className="p-6">
            <h1 className="text-2x1 font bold mb-4">Athleten</h1>
            <DataTable 
                columns={columns} 
                data={getAllAthletes()}
                getRowProps={(row) => ({
                    className: "cursor-pointer hover:bg-muted",
                    onClick: () => router.push(`/athletes/${row.original.id}`)
                })}
            />
        </div>
    )
}