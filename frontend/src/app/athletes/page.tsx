"use client";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import DownloadCsvButton from "@/components/ui/csvExportButton";
import DownloadPdfButton from "@/components/ui/groupDownloadButton";
import { getSelectedAthleteIds } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "@/components/AthleteTableColumns";
import { getAllAthletes, getAllFeats } from "@/athlete_getters";
import { useEffect, useState } from "react";
import { Athlete } from "@/models/athlete";
import { downloadCsv } from "@/exportCsv";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteResource, { DeleteResourceButton } from "@/components/ui/deleteResource";
import { validateAndGetToken } from "@/auth";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Page() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  const deletedAthletes = () => {
    const deletedIds = getSelectedAthleteIds();
    setAthletes(athletes.filter((athlete) => !deletedIds.includes(athlete.id)));
    window.location.reload();
  };

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    setTokenValid(validateAndGetToken());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [athletesResponse, featsResponse] = await Promise.all([
          getAllAthletes(),
          getAllFeats(),
        ]);

        const athletesWithFeats = athletesResponse.map((athlete) => ({
          ...athlete,
          feats: featsResponse.filter((feat) => feat.athlete_id === athlete.id),
        }));
        setAthletes(athletesWithFeats);
      } catch (error) {
        console.error("Error fetching and processing athlete data:", error);
      }
    };
    fetchData();
  }, []);

  if (tokenValid === null) {
    // Noch nicht geprüft, z.B. Ladeanzeige oder leer
    return null;
  }
  if (!tokenValid) {
    // Token ist ungültig, validateAndGetToken leitet bereits weiter
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Athleten</h1>

      <div className="flex flex-wrap gap-2">

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex-grow">
              <DownloadCsvButton
                ids={getSelectedAthleteIds}
                text={"Ausgewählte als Csv exportieren"}
              />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="right"
            align="center"
            sideOffset={10}
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
          >
            Alle Athleten werden in zwei CSVs heruntergeladen: Eine mit Athletendaten und eine mit Leistungen.
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex-grow">
            <DownloadPdfButton
              ids={getSelectedAthleteIds}
              text={"Ausgewählte als PDF exportieren"}
            />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="right"
            align="center"
            sideOffset={10}
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
          >
            Die Prüfkarte für einen Athleten oder die Gruppenprüfkarte für mehrere Athleten herunterladen.
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Root>

        <DeleteResourceButton
          type="athlete"
          text="Ausgewählte Löschen"
          ids={getSelectedAthleteIds}
          warning={`Sind Sie sicher, dass sie die ausgewählten Athleten sowie alle Leistungen der Athleten löschen möchten?`}
          onDelete={deletedAthletes}
        />
      </div>
      <DataTable
        columns={columns}
        data={athletes}
        getRowProps={(row) => ({
          className: "cursor-pointer hover:bg-muted",
          onClick: () => router.push(`/athletes/${row.original.id}`),
        })}
      />
    </div>
  );
}
