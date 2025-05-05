import { useParams } from "next/navigation";
import { Athlete, Feat } from "@/models/athlete";
import { getAthleteById, getFeatsById } from "@/athlete_getters";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorDisplay from "@/components/ErrorDisplay";

const getAge = (dateString: string) => {
  const [day, month, year] = dateString.split("-").map(Number);
  const birthday = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() >= birthday.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }
  return age;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const id = parseInt((await params).id);
    const athlete = await getAthleteById(id);
    const feats= await getFeatsById(id);
    console.log(feats);
    function mapSex(sex: string) {
        sex = sex.toLocaleLowerCase();
        if (sex === "m") return "Männlich";
        if (sex === "w") return "Weiblich";
        if (sex === "d") return "Divers";
    }

  if (athlete === undefined)
    return (
      <div className="p-6 flex flex-col gap-2">
        <Link href="/athletes/" className="flex items-center gap-2">
          <Undo2 />
          <span>Übersicht</span>
        </Link>
        <ErrorDisplay message={`Athlet mit ID: ${id} existiert nicht.`} />
      </div>
    );
  return (
    <div className="p-6 gap-2 flex flex-col">
      <Link href="/athletes/" className="flex items-center gap-2">
        <Undo2 />
        <span>Übersicht</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {athlete.firstName} {athlete.lastName}
          </CardTitle>
          <CardDescription>
            {athlete.dateOfBirth.split("-").join(".")} -{" "}
            {getAge(athlete.dateOfBirth)} Jahre
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <p>Geburtsdatum: {athlete.dateOfBirth}</p>
      <p>Geschlecht: {mapSex(athlete.sex)}</p>
      <Link href={`/feats_result_page?id=${id}`}>Disziplinen:</Link>
      <ul>
        {athlete.disciplines?.map((discipline) => {
          return <li key={discipline}>{discipline}</li>;
        })}
      </ul>
    </div>
  );
}
