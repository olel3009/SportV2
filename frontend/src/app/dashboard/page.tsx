'use client'
import { validateAndGetToken } from "@/auth";
import RegelungenButton from "@/components/RegelungenButton";
import { useEffect, useState } from "react";

export default function Startpage() {
  
  
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Dies ist die Dashboardseite</p>
      <RegelungenButton />
    </div>
  );
  
}