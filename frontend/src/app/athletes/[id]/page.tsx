import { useParams } from "next/navigation";
import { Athlete, Feat } from "@/models/athlete";
import { getAthleteById, getFeatsById } from "@/athlete_getters";
import Link from "next/link";
import { Undo2, CircleUserRound, Medal, CircleSlash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Badge } from "@/components/ui/badge";

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

function MedalDisplay({ displayName, type }: { displayName: string, type: "gold" | "silver" | "bronze" | "none" }) {
  const size = "40"
  const text_size = "text-xl"
  if (type === "gold") return (
    <Badge className="bg-yellow-300 text-yellow-900 flex grow gap-2 pointer-events-none">
      <Medal size={size} strokeWidth={1.5} /> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
  if (type === "bronze") return (
    <Badge className="bg-orange-300 text-orange-900 flex grow gap-2 pointer-events-none">
      <Medal size={size} strokeWidth={1.5} /> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
  if (type === "silver") return (
    <Badge className="bg-gray-300 text-gray-800 flex grow gap-2 pointer-events-none">
      <Medal size={size} strokeWidth={1.5} /> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
  if (type === "none") return (
    <Badge className="bg-gray-100 text-neutral-500 flex grow gap-2 pointer-events-none">
      <CircleSlash size={size} strokeWidth={1}/> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  const athlete = await getAthleteById(id);
  const feats = await getFeatsById(id);
  console.log(feats);
  function mapSex(sex: string) {
    sex = sex.toLocaleLowerCase();
    if (sex === "m") return "Männlich";
    if (sex === "f") return "Weiblich";
    if (sex === "d") return "Divers";
  }

  if (athlete === undefined)
    return (
      <div className="p-6 flex flex-col gap-2">
        <Link href="/athletes/" className="flex items-center gap-2">
          <Undo2 />
          <span className="underline">Übersicht</span>
        </Link>
        <ErrorDisplay message={`Athlet mit ID: ${id} existiert nicht.`} />
      </div>
    );

  return (
    <div className="p-6 gap-4 flex flex-col">

      <Link href="/athletes/" className="flex items-center gap-2">
        <Undo2 />
        <span className="underline">Übersicht</span>
      </Link>

      <Card>
        <CardContent className="mt-5 flex gap-2 items-center">

          <CircleUserRound size="69" strokeWidth={0.5} />

          <div>
            <span className="text-xl font-bold">
              {athlete.firstName} {athlete.lastName}
            </span>
            <div>
              {athlete.dateOfBirth.split("-").join(".")} - {" "}
              {getAge(athlete.dateOfBirth)} Jahre
            </div>
            <div className="text-gray-500">
              <p>{mapSex(athlete.sex)}</p>
            </div>
          </div>

          <div className="pl-7 grow gap-1 xl:gap-7 flex justify-evenly items-center">
            <MedalDisplay displayName="Kraft" type="gold"/>
            <MedalDisplay displayName="Koordination" type="none"/>
            <MedalDisplay displayName="Ausdauer" type="silver"/>
            <MedalDisplay displayName="Schnelligkeit" type="bronze"/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
