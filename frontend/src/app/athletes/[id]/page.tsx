'use client';
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
import { getUtcTimecodeFromGermanDate } from "@/date_format";
import { useEffect, useState } from "react";
import { validateAndGetToken } from "@/auth";


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
  type: string | undefined;
}) {
  const size = "20";
  const text_size = "text-xl";
  const colors =
    type === "Gold"
      ? "bg-yellow-300 text-yellow-900"
      : type === "Bronze"
      ? "bg-orange-300 text-orange-900"
      : type === "Silber"
      ? "bg-gray-300 text-gray-800"
      : "invisible";
  return (
    <Badge className={`${colors} flex gap-2 pointer-events-none`}>
      <Medal size={size} />
      {displayName && <span className={`${text_size}`}>{displayName}</span>}
    </Badge>
  );
}

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

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
    useEffect(() => {
      setTokenValid(validateAndGetToken());
    }, []);
  
    if (tokenValid === null) {
      // Noch nicht geprüft, z.B. Ladeanzeige oder leer
      return null;
    }
    if (!tokenValid) {
      // Token ist ungültig, validateAndGetToken leitet bereits weiter
      return null;
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

      <h2 className="text-xl font-bold">Schwimmnachweis</h2>
      <div>
        {!athlete.swimCertificate && (
          <p>Es ist kein Schwimmnachweis vorhanden</p>
        )}
        {athlete.swimCertificate && <p>Es ist ein Schwimmnachweis vorhanden</p>}
      </div>

      <h2 className="text-xl font-bold">Leistungen</h2>
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
            console.log(relFeats);
            return (
              <TabsContent key={index} value={disc.id.toString()}>
                <Card>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {relFeats?.map((feat, index) => {
                        let ruleSpecificResults = feats
                          ?.filter((f) => f.rule_id === feat.rule_id)
                          .sort((a, b) => {
                            const yearA = getUtcTimecodeFromGermanDate(a.year || "")?.timestamp || 0
                            const yearB = getUtcTimecodeFromGermanDate(b.year || "")?.timestamp || 0
                            return yearB - yearA;
                          });
                        if (!ruleSpecificResults) return <></>;

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

                        return (
                          <AccordionItem key={index} value={index.toString()}>
                            <AccordionTrigger>{discName}</AccordionTrigger>
                            <AccordionContent>
                              {ruleSpecificResults.length > 1 && (
                                <>
                                  <h3 className="text-lg font-bold">
                                    Entwicklung
                                  </h3>
                                  <div className="border rounded-xl p-2 mb-2">
                                    <ProgressChart
                                      results={ruleSpecificResults}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="flex flex-col gap-2">
                                {ruleSpecificResults.map((result, index) => (
                                  <div
                                    className="grid grid-cols-[max-content_12rem_auto] w-full border rounded-xl p-3 gap-4 items-center"
                                    key={index}
                                  >
                                    <MedalDisplay
                                      displayName=""
                                      type={result.medal}
                                    />
                                    <label className="font-semibold">
                                      {result.result} {result.ruling?.unit}
                                    </label>
                                    <label>{result.year}</label>
                                  </div>
                                ))}
                              </div>
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
    </div>
  );
}
