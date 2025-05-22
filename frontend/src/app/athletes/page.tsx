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

export default function Page() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [athletesResponse, featsResponse] = await Promise.all([
          getAllAthletes(),
          getAllFeats(),
        ]);

        const athletesWithFeats = athletesResponse.map(athlete => ({
          ...athlete,
          feats: featsResponse.filter(
            feat => feat.athlete_id === athlete.id
          )
        }));
        setAthletes(athletesWithFeats);
      } catch (error) {
        console.error("Error fetching and processing athlete data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Athleten</h1>
      <DownloadCsvButton
        ids={getSelectedAthleteIds}
        text={"Ausgewählte als Csv exportieren"}
      />
      <DownloadPdfButton
        ids={getSelectedAthleteIds}
        text={"Ausgewählte als PDF exportieren"}
      />
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
