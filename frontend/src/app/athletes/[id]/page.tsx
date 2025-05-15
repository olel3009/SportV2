import { useParams } from "next/navigation";
import { Athlete, Feat } from "@/models/athlete";
import {
  getAllDisciplines,
  getAthleteById,
  getFeatsById,
  getAthleteWithFeats,
} from "@/athlete_getters";
import { downloadCsv } from "@/exportCsv";
import DownloadCsvButton from "@/components/ui/csvExportButton";
import Link from "next/link";
import { Undo2, CircleUserRound, Medal, CircleSlash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { boolean } from "zod";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Badge } from "@/components/ui/badge";
import ProgressChart from "@/components/ProgressChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getAge = (dateString: string) => {
  const [day, month, year] = dateString.split(".").map(Number);
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

function MedalDisplay({
  displayName,
  type,
}: {
  displayName: string;
  type: "gold" | "silver" | "bronze" | "none";
}) {
  const size = "40";
  const text_size = "text-xl";
  if (type === "gold")
    return (
      <Badge className="bg-yellow-300 text-yellow-900 flex grow gap-2 pointer-events-none">
        <Medal size={size} strokeWidth={1.5} />{" "}
        <span className={`${text_size}`}>{displayName}</span>
      </Badge>
    );
  if (type === "bronze")
    return (
      <Badge className="bg-orange-300 text-orange-900 flex grow gap-2 pointer-events-none">
        <Medal size={size} strokeWidth={1.5} />{" "}
        <span className={`${text_size}`}>{displayName}</span>
      </Badge>
    );
  if (type === "silver")
    return (
      <Badge className="bg-gray-300 text-gray-800 flex grow gap-2 pointer-events-none">
        <Medal size={size} strokeWidth={1.5} />{" "}
        <span className={`${text_size}`}>{displayName}</span>
      </Badge>
    );
  if (type === "none")
    return (
      <Badge className="bg-gray-100 text-neutral-500 flex grow gap-2 pointer-events-none">
        <CircleSlash size={size} strokeWidth={1} />{" "}
        <span className={`${text_size}`}>{displayName}</span>
      </Badge>
    );
}

const testFeats: Feat[] = [
  {
    id: 1,
    athlete_id: 101,
    rule_id: 201,
    year: 2020,
    age: 25,
    result: 9.58,
    medal: "gold",
    created_at: "2020-08-01T12:00:00Z",
    updated_at: "2025-05-01T10:00:00Z",
    ruling: undefined,
  },
  {
    id: 2,
    athlete_id: 102,
    rule_id: 202,
    year: 2021,
    age: 22,
    result: 10.12,
    medal: "silver",
    created_at: "2021-06-15T09:30:00Z",
    updated_at: "2025-05-02T11:15:00Z",
    ruling: undefined,
  },
  {
    id: 3,
    athlete_id: 103,
    rule_id: 203,
    year: 2022,
    age: 27,
    result: 8.88,
    medal: "bronze",
    created_at: "2022-04-10T08:00:00Z",
    updated_at: "2025-05-03T14:45:00Z",
    ruling: undefined,
  },
  {
    id: 4,
    athlete_id: 104,
    rule_id: 204,
    year: 2023,
    age: 30,
    result: 9.23,
    medal: "gold",
    created_at: "2023-02-20T17:20:00Z",
    updated_at: "2025-05-04T09:00:00Z",
    ruling: undefined,
  },
  {
    id: 5,
    athlete_id: 105,
    rule_id: 205,
    year: 2019,
    age: 21,
    result: 10.0,
    medal: "none",
    created_at: "2019-12-05T13:10:00Z",
    updated_at: "2025-05-05T12:30:00Z",
    ruling: undefined,
  },
  {
    id: 6,
    athlete_id: 106,
    rule_id: 206,
    year: 2024,
    age: 28,
    result: 9.77,
    medal: "silver",
    created_at: "2024-03-30T16:40:00Z",
    updated_at: "2025-05-06T08:20:00Z",
    ruling: undefined,
  },
  {
    id: 7,
    athlete_id: 107,
    rule_id: 207,
    year: 2020,
    age: 24,
    result: 9.91,
    medal: "gold",
    created_at: "2020-11-11T10:05:00Z",
    updated_at: "2025-05-07T15:00:00Z",
    ruling: undefined,
  },
  {
    id: 8,
    athlete_id: 108,
    rule_id: 208,
    year: 2021,
    age: 26,
    result: 10.5,
    medal: "none",
    created_at: "2021-08-22T07:55:00Z",
    updated_at: "2025-05-08T07:30:00Z",
    ruling: undefined,
  },
  {
    id: 9,
    athlete_id: 109,
    rule_id: 209,
    year: 2018,
    age: 29,
    result: 9.65,
    medal: "bronze",
    created_at: "2018-05-09T19:00:00Z",
    updated_at: "2025-05-09T13:45:00Z",
    ruling: undefined,
  },
  {
    id: 10,
    athlete_id: 110,
    rule_id: 210,
    year: 2023,
    age: 23,
    result: 10.01,
    medal: "silver",
    created_at: "2023-10-14T20:10:00Z",
    updated_at: "2025-05-10T18:15:00Z",
    ruling: undefined,
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  const athlete = await getAthleteById(id);
  const feats = await getFeatsById(id);
  const disciplines = await getAllDisciplines();
  let actDiscIds: boolean[] = [false, false, false, false];
  feats?.forEach((feat) => {
    // first, safely pull out discipline_id
    const id = feat?.ruling?.discipline_id;

    // make sure it's a real number in [1..4]
    if (typeof id === "number" && id >= 1 && id <= actDiscIds.length) {
      actDiscIds[id - 1] = true;
    }
  });
  function mapSex(sex: string) {
    sex = sex.toLocaleLowerCase();
    if (sex === "m") return "Männlich";
    if (sex === "f") return "Weiblich";
    if (sex === "d") return "Divers";
  }
  let usedExercises: number[] = [];
  let idIndex = 1;
  let temp: number;
  let tabMap: number[] = [];

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
              {athlete.dateOfBirth.split("-").join(".")} -{" "}
              {getAge(athlete.dateOfBirth)} Jahre
            </div>
            <div className="text-gray-500">
              <p>{mapSex(athlete.sex)}</p>
            </div>
          </div>

          <div className="pl-7 grow gap-1 xl:gap-7 flex justify-evenly items-center"></div>
        </CardContent>
      </Card>

      <DownloadCsvButton ids={[id]} text="Als Csv exportieren" />

      <div>
        <Tabs defaultValue={disciplines[0].id.toString()} className="w-full">
          <TabsList>
            {actDiscIds.map((yes, index) => {
              if (!yes) return null;
              const disc = disciplines.find((d) => d.id === index + 1);
              if (!disc) return null;

              return (
                <TabsTrigger key={index} value={disc.id.toString()}>
                  {disc.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {actDiscIds.map((yes, index) => {
            if (!yes) return null;
            const disc = disciplines.find((d) => d.id === index + 1);
            if (!disc) return null;

            let relFeats = feats?.filter(
              (a) => a.ruling?.discipline_id === index + 1
            );
            console.log(relFeats)
            return (
              <TabsContent key={index} value={disc.id.toString()}>
                <Card>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {relFeats?.map((feat, index) => {
                        let ruleSpecificResults = feats?.filter(
                          (f) => f.rule_id === feat.rule_id
                        );

                        if (usedExercises.includes(feat.rule_id)) {
                          return null;
                        } else {
                          usedExercises.push(feat.rule_id);
                        }

                        let discName: string | undefined = "";
                        if (athlete.sex !== "m") {
                          discName = feat.ruling?.description_f;
                        } else {
                          discName = feat.ruling?.description_m;
                        }
                        discName +=
                          " " +
                          feat.ruling?.min_age +
                          " - " +
                          feat.ruling?.max_age;

                        console.log(discName);
                        return (
                          <AccordionItem key={index} value={index.toString()}>
                            <AccordionTrigger>{discName}</AccordionTrigger>
                            <AccordionContent>
                              Hier genauere Details über Disziplin/Übung
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <ProgressChart results={testFeats} />
    </div>
  );
}
