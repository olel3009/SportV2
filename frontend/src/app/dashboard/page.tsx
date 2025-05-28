"use client"
import { validateAndGetToken } from "@/auth";
import RegelungenButton from "@/components/RegelungenButton";
import { getAllAthletes, getAthletesMedals } from "@/athlete_getters";
import { useEffect, useState } from "react";
import { columns } from "@/components/topAthletestableColumnDefs";
import { Athlete } from "@/models/athlete";
import { DataTable } from "@/components/ui/DataTable";
import { birthColumns } from "@/components/birthdayColumndefs";

export default function Startpage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [birthdays, setBirthdays] = useState<Athlete[]>([]);

  // Fetch top 10 medalists
  useEffect(() => {
    async function fetchTopAthletes() {
      try {
        const data = await getAthletesMedals();
        const topTen = data
          .sort((a, b) => {
            if (b.goldMedals !== a.goldMedals) return b.goldMedals - a.goldMedals;
            if (b.silverMedals !== a.silverMedals) return b.silverMedals - a.silverMedals;
            return b.bronzeMedals - a.bronzeMedals;
          })
          .slice(0, 10);
        setAthletes(topTen);
      } catch (error) {
        console.error("Error fetching and processing athlete data:", error);
      }
    }
    fetchTopAthletes();
  }, []);

  // Fetch athletes with birthdays in the next 7 days
  useEffect(() => {
    async function fetchUpcomingBirthdays() {
      try {
        const all = await getAllAthletes();
        const today = new Date();
        const upcoming = all.filter((athlete) => {
          const [day, month, year] = athlete.dateOfBirth.split('.').map(Number);
          let birthday = new Date(today.getFullYear(), month - 1, day);
          // If birthday already passed this year, check next year
          if (birthday < today) {
            birthday = new Date(today.getFullYear() + 1, month - 1, day);
          }
          const diffDays = (birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 7;
        });
        setBirthdays(upcoming);
      } catch (error) {
        console.error("Error fetching birthdays:", error);
      }
    }
    fetchUpcomingBirthdays();
  }, []);



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

      {/* Button + Tables */}
      <div className="flex items-start justify-between">
        {/* Left: Regelungen + Birthdays */}
        <div className="w-1/2 pr-4">
          <h2 className="text-xl font-semibold mb-2">Hier klicken zum aktualisieren der Regelungen</h2>
          <RegelungenButton />

          <h2 className="text-xl font-semibold mt-6 mb-2">Anstehende Geburtstage</h2>
          <DataTable columns={birthColumns} data={birthdays} />
        </div>

        {/* Right: Top Athleten */}
        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-semibold mb-2">Top Athleten</h2>
          <DataTable columns={columns} data={athletes} />
        </div>
      </div>
    </div>
  );

}
