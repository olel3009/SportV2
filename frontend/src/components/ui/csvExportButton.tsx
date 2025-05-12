"use client"

import { downloadCsv } from "@/exportCsv"
import { Button } from "@/components/ui/button"
import React from "react"

interface Props {
  ids: number[]
  text: string
}

export default function DownloadCsvButton({ ids, text }: Props) {
  const handleClick = async () => {
    try {
      const ok = await downloadCsv(ids)
      if (!ok) console.warn("Download failed")
    } catch (e) {
      console.error("downloadCsv threw:", e)
    }
  }

  return (
    <Button onClick={handleClick} className="w-full">
      {text}
    </Button>
  )
}
