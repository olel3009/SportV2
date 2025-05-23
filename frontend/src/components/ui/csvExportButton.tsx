"use client"

import { downloadCsv } from "@/exportCsv"
import { Button } from "@/components/ui/button"
import React from "react"
import * as Tooltip from "@radix-ui/react-tooltip";


interface Props {
  ids: number[]|(() => number[])
  text: string
}

export default function DownloadCsvButton({ ids, text }: Props) {
  const handleClick = async () => {
    const resolvedIds = Array.isArray(ids) ? ids : ids()
    try {

      const ok = await downloadCsv(resolvedIds)
      if (!ok) console.warn("Download failed")
    } catch (e) {
      console.error("downloadCsv threw:", e)
    }
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button onClick={handleClick} className="w-full">
          {text}
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
  )
}
