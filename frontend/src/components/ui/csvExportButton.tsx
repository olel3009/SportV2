"use client";

import { downloadCsv } from "@/exportCsv";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Props {
  ids: number[] | (() => number[]);
  text: string;
}

const handleClick = async (ids: number[] | (() => number[])) => {
  const resolvedIds = Array.isArray(ids) ? ids : ids();
  try {
    const ok = await downloadCsv(resolvedIds);
    if (!ok) console.warn("Download failed");
  } catch (e) {
    console.error("downloadCsv threw:", e);
  }
};

export default function DownloadCsvButton({ ids, text }: Props) {
  return (
    <Button onClick={() => handleClick(ids)} className="w-full flex gap-1">
      <Download /> {text}
    </Button>
  );
}

export function DownloadCsvLink({ ids, text }: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          onClick={() => handleClick(ids)}
          className="flex gap-1"
          variant="link"
        >
          <Download className="" /> <span className="">{text}</span>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        side="top" // Tooltip wird rechts angezeigt
        align="center" // Zentriert den Tooltip vertikal zur Maus
        sideOffset={10} // Abstand zwischen Tooltip und Maus
        className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
      >
        Ausgewählte Athleten in zwei CSV-Dateien exportieren
        <Tooltip.Arrow className="fill-gray-800" />
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
