import styles from "./page.module.css";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/AthleteTableColumns"
import { getAllAthletes } from "@/athlete_getters";

export default function Page() {
    return (
        <div className="p-6">
            <h1 className="text-2x1 font bold mb-4">Athleten</h1>
            <DataTable columns={columns} data={getAllAthletes()} />
        </div>
    )
}