"use client"
import { useRouter } from "next/navigation"

import styles from "./page.module.css";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "@/components/AthleteTableColumns"
import { getAllAthletes } from "@/athlete_getters";
import { useEffect, useState } from "react";
import { Athlete } from "@/models/athlete";

export default function Page() {
    const router = useRouter();
    const [athletes, setAthletes] = useState<Athlete[]>([]);

    useEffect(() => {
        getAllAthletes().then(res => setAthletes(res))
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2x1 font bold mb-4">Athleten</h1>
            <DataTable 
                columns={columns} 
                data={athletes}
                getRowProps={(row) => ({
                    className: "cursor-pointer hover:bg-muted",
                    onClick: () => router.push(`/athletes/${row.original.id}`)
                })}
            />
        </div>
    )
}