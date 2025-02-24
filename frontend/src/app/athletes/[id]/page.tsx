import { useParams } from "next/navigation";
import { Athlete, Feat } from "@/models/athlete";
import { getAthleteById } from "@/../generic_functions/athlete_getters";
import Link from "next/link";

export default async function Page({ params }: {
    params: Promise<{ id: number }>
}) {
    const id = (await params).id
    const athlete = getAthleteById(id)
    function mapSex(sex: string) {
        sex = sex.toLocaleLowerCase();
        if (sex === "m") return "Männlich";
        if (sex === "w") return "Weiblich";
        if (sex === "d") return "Divers";
    }

    if (athlete === undefined) return <p>Dieser Athlet existiert nicht</p>
    return (
        <div>
            <Link href="/athletes/">Zurück zur Übersicht</Link>
            <h1>{athlete.firstName} {athlete.lastName}</h1>
            <p>Geburtsdatum: {athlete.dateOfBirth}</p>
            <p>Geschlecht: {mapSex(athlete.sex)}</p>
            <p>Disziplinen:</p>
            <ul>
                {athlete.disciplines?.map((discipline) => {
                    return <li key={discipline}>{discipline}</li>
                })}
            </ul>
        </div>
    )
}