"use client";

import { downloadCsv } from "@/exportCsv";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { Download } from "lucide-react";

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
    <Button
      onClick={() => handleClick(ids)}
      className="w-full flex gap-1"
    >
      <Download /> {text}
    </Button>
  );
}

export function DownloadCsvLink({ ids, text }: Props) {
  return (
    <Button
      onClick={() => handleClick(ids)}
      className="flex gap-1"
      variant="link"
    >
      <Download className=""/> <span className="">{text}</span>
    </Button>
  )
}
