"use client";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import DownloadCsvButton from "@/components/ui/csvExportButton";
import DownloadPdfButton from "@/components/ui/groupDownloadButton";
import { getSelectedAthleteIds } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "@/components/AthleteTableColumns";
import { getAllAthletes } from "@/athlete_getters";
import { useEffect, useState } from "react";
import { Athlete } from "@/models/athlete";
import { downloadCsv } from "@/exportCsv";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    getAllAthletes().then((res) => setAthletes(res));
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
