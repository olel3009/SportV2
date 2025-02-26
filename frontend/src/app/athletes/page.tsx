import styles from "./page.module.css";
import { AthleteList } from "@/ui/AthleteList";
import { getAllAthletes } from "@/athlete_getters";

export default function Page() {
    return (
        <div className="p-6">
            <h1 className="text-2x1 font bold mb-4">Athleten</h1>
            <AthleteList athletes={getAllAthletes()}></AthleteList>
        </div>
    )
}