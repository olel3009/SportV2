// app/athletes/new/page.tsx
"use client";

import { useState } from "react";
import { createAthlete } from "@/../generic_functions/athlete_getters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function formatGermanDate(isoDate: string): string {
  // isoDate is "YYYY-MM-DD"
  const [year, month, day] = isoDate.split("-");
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
}

export default function CreateAthletePage() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [bdate, setBdate] = useState(""); // stores "YYYY-MM-DD"
  const [sex, setSex] = useState<"m" | "w" | "d">("m");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formattedDate = formatGermanDate(bdate);
      await createAthlete(fName, lName, email, formattedDate, sex);
      // clear form
      setFName("");
      setLName("");
      setEmail("");
      setBdate("");
      setSex("m");
    } catch (err: any) {
      setError(err.message || "Failed to create athlete");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 flex flex-col gap-4"
    >
      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="firstName">Vorname</Label>
        <Input
          id="firstName"
          placeholder="Vorname"
          value={fName}
          onChange={(e) => setFName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="lastName">Nachname</Label>
        <Input
          id="lastName"
          placeholder="Nachname"
          value={lName}
          onChange={(e) => setLName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="birthDate">Geburtsdatum</Label>
        <Input
          id="birthDate"
          type="date"
          value={bdate}
          onChange={(e) => setBdate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label>Geschlecht</Label>
        <Select value={sex} onValueChange={(val) => setSex(val as "m"|"w"|"d")}>
          <SelectTrigger id="sex">
            <SelectValue placeholder="Geschlecht" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m">Männlich</SelectItem>
            <SelectItem value="w">Weiblich</SelectItem>
            <SelectItem value="d">Divers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "Erstelle…" : "Athlet erstellen"}
      </Button>
    </form>
  );
}
