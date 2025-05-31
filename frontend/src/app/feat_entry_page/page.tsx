'use client';
import { validateAndGetToken } from "@/auth";
import { FeatEntryCard } from "@/components/featentry";
import { useEffect, useState } from "react";

export default function Home() {
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
  return (
    <div className="p-2">
      <FeatEntryCard />
    </div>
  )
}