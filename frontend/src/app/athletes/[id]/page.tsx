"use client";

import { useParams } from "next/navigation";
import { Athlete, Discipline, Feat } from "@/models/athlete";
import {
  getAllDisciplines,
  getAthleteById,
  getFeatsById,
  getAthleteWithFeats,
} from "@/athlete_getters";
import { downloadCsv } from "@/exportCsv";
import DownloadCsvButton, {
  DownloadCsvLink,
} from "@/components/ui/csvExportButton";
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
import { findBestMedal } from "@/medal_functions"; 
import { validateAndGetToken } from "@/auth";

import DeleteResource from "@/components/ui/deleteResource";
import { useEffect, useState } from "react";

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

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);

  const [athlete, setAthlete] = useState<Athlete>();
  const [feats, setFeats] = useState<Feat[]>();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [actDiscIds, setActDiscIds] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function mapSex(sex: string) {
    sex = sex.toLocaleLowerCase();
    if (sex === "m") return "Männlich";
    if (sex === "f") return "Weiblich";
    if (sex === "d") return "Divers";
  }

  function handleDeleteFeats(ids: number[]) {
    setFeats(feats?.filter((feat) => !ids.includes(feat.id)));
  }

  useEffect(() => {
    if (!id) return;

    if (isNaN(id)) {
      setError("Fehler bei der ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const athleteData = await getAthleteById(id);
        if (!athleteData) setError(`Athlet mit ID: ${id} existiert nicht`);
        const featsData = await getFeatsById(id);
        const disciplinesData = await getAllDisciplines();

        setAthlete(athleteData);
        setFeats(featsData);
        setDisciplines(disciplinesData);
      } catch (err) {
        console.log("Failed to fetch data:", err);
        setError("Athletendaten konnten nicht geladen werden");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  feats?.forEach((feat) => {
    // first, safely pull out discipline_id
    const id = feat?.ruling?.discipline_id;

    // make sure it's a real number in [1..4]
    if (typeof id === "number" && id >= 1 && id <= actDiscIds.length) {
      actDiscIds[id - 1] = true;
    }
  });
  let usedExercises: number[] = [];

  
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


  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-2">
        <Link href="/athletes/" className="flex items-center gap-2">
          <Undo2 />
          <span className="underline">Übersicht</span>
        </Link>
      </div>
    );
  }

  if (error || athlete === undefined) {
    return (
      <div className="p-6 flex flex-col gap-2">
        <Link href="/athletes/" className="flex items-center gap-2">
          <Undo2 />
          <span className="underline">Übersicht</span>
        </Link>
        <ErrorDisplay message={error || ""} />
      </div>
    );
  }



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

          <div className="flex flex-wrap ml-auto">
            <DownloadCsvLink ids={[id]} text="CSV" />
            <DeleteResource
              ids={[id]}
              type="athlete"
              text="Löschen"
              warning={`Sind Sie sicher, dass sie den Athleten ${athlete.firstName} ${athlete.lastName} sowie alle Leistungen des Athleten löschen möchten?`}
              redirect="/athletes"
            />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">Schwimmnachweis</h2>
      <div>
        {!athlete.swimCertificate && (
          <p>Es ist kein Schwimmnachweis vorhanden</p>
        )}
        {athlete.swimCertificate && <p>Es ist ein Schwimmnachweis vorhanden</p>}
      </div>

      <h2 className="text-xl font-bold">Leistungen</h2>
      <div>
        <Tabs
          defaultValue={(actDiscIds.findIndex((val) => val) + 1).toString()}
          className="w-full"
        >
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

            // Calculate best medal
            // Get all feats of the discipline that are from the current years ruling
            let viableFeats = relFeats?.filter((a) => {
              const currentYear = new Date().getFullYear();
              const ruleDate = getUtcTimecodeFromGermanDate(
                a.ruling?.valid_start || ""
              )?.date;
              return currentYear === ruleDate?.getFullYear() || 0;
            });
            const bestFeat = findBestMedal(viableFeats);

            return (
              <TabsContent className="" key={index} value={disc.id.toString()}>
                <div className="mb-2 flex w-full border rounded-xl p-3 gap-4 items-center">
                  {!bestFeat && (
                    <span>
                      Es wurde für {new Date().getFullYear()} keine Medaille
                      erreicht.
                    </span>
                  )}
                  {bestFeat && (
                    <>
                      <MedalDisplay displayName="" type={bestFeat.medal} />
                      <span>
                        {bestFeat.medal} in {disc.name} für{" "}
                        {new Date().getFullYear()}:
                      </span>
                      <span className="font-semibold">
                        {bestFeat.result} {bestFeat.ruling?.unit}
                      </span>
                      in
                      <span className="font-semibold">
                        {bestFeat.ruling?.rule_name}
                      </span>
                    </>
                  )}
                </div>
                <Card>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {relFeats?.map((feat, index) => {
                        let ruleSpecificResults = feats
                          ?.filter((f) => f.rule_id === feat.rule_id)
                          .sort((a, b) => {
                            const yearA =
                              getUtcTimecodeFromGermanDate(a.year || "")
                                ?.timestamp || 0;
                            const yearB =
                              getUtcTimecodeFromGermanDate(b.year || "")
                                ?.timestamp || 0;
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
                                    className="group grid grid-cols-[max-content_12rem_auto_max-content] w-full border rounded-xl p-3 gap-4 items-center"
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
                                    <div className="invisible group-hover:visible">
                                      <DeleteResource
                                        ids={[result.id]}
                                        type="result"
                                        warning={`Sind Sie sicher, dass sie diese Leistung löschen möchten?`}
                                        onDelete={() =>
                                          handleDeleteFeats([result.id])
                                        }
                                      />
                                    </div>
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
