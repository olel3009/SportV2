"use client";
import { Athlete } from "@/models/athlete";
import { getAllAthletes, addFeatToAthlete } from "@/../generic_functions/athlete_getters";
import { getExercises } from "@/../generic_functions/calculation_functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SelectTriggerProps } from "@radix-ui/react-select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Label } from "./ui/label";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { useEffect, useState } from "react";


function AthleteSelect({
  value,
  onChange,
  id = -1
}: {
  value: string;
  onChange: (val: string) => void;
  id?: number;
}) {
  const athletes: Athlete[] = getAllAthletes();
  const athleteSet = id !== -1;

  return (
    <Select value={value} onValueChange={onChange} disabled={athleteSet}>
      <SelectTrigger id="athlete">
        <SelectValue placeholder="Athlet wählen" />
      </SelectTrigger>
      <SelectContent>
        {athletes.map((athlete, index) => (
          <SelectItem value={athlete.id.toString()} key={index}>
            {athlete.firstName} {athlete.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DisciplineSelect({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const exercises = getExercises();
  const options = Object.keys(exercises);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="discipline">
        <SelectValue placeholder="Disziplin wählen" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem value={option} key={index}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ExerciseSelect({
  discipline,
  value,
  onChange
}: {
  discipline: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const exercises = getExercises();
  const currentExercise = exercises[discipline] || [];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="uebung">
        <SelectValue placeholder="Übung wählen" />
      </SelectTrigger>
      <SelectContent>
        {currentExercise.map((exer, i) => (
          <SelectItem value={exer} key={i}>
            {exer}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
  const year = String(date.getFullYear());
  return `${day}.${month}.${year}`;
}

let [ueb, dat, erg] = "";
let ath = 0;
const submit = () => {
  console.log("Uebung:", ueb, "Athlet:", ath, "Datum:", dat, "Ergebnis:", erg);
  addFeatToAthlete(ath, ueb, dat, erg);
}

function FeatEntryContent({ id = -1 }: { id?: number }) {
  const today = new Date();
  const formatted = formatDate(today);
  const exercises = getExercises();
  const allDisciplines = Object.keys(exercises)

  const [selectedAthlete, setSelectedAthlete] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState(formatted);

  useEffect(() => {
    if (allDisciplines.length > 0) {
      setSelectedDiscipline(allDisciplines[0]);
      const firstExercise = exercises[allDisciplines[0]]?.[0] ?? "";
      setSelectedExercise(firstExercise);
    }

    if (id !== -1) setSelectedAthlete(id.toString())
  }, []);

  useEffect(() => {
    ueb = selectedExercise;
    dat = date;
    erg = result;
    ath = Number(selectedAthlete)
  }, [selectedAthlete, result, date, selectedExercise])

  const handleDisciplineChange = (newDiscipline: string) => {
    setSelectedDiscipline(newDiscipline);
    const firstExercise = exercises[newDiscipline]?.[0] ?? "";
    setSelectedExercise(firstExercise);
  };

  return (
    <div className="flex flex-col gap-4">

      <div className="grid gap-2">
        <Label>Athlet</Label>
        <AthleteSelect id={id} value={selectedAthlete} onChange={setSelectedAthlete} />
      </div>

      <div className="grid gap-2">
        <Label>Disziplin</Label>
        <DisciplineSelect value={selectedDiscipline} onChange={handleDisciplineChange} />
      </div>

      <div className="grid gap-2">
        <Label>Übung</Label>
        <ExerciseSelect discipline={selectedDiscipline} value={selectedExercise} onChange={setSelectedExercise} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="datum">Datum</Label>
        <Input
          name="datum"
          id="datum"
          placeholder="Datum des Ergebnis"
          defaultValue={formatted}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ergebnis">Ergebnis</Label>
        <Input id="ergebnis" placeholder="Ergebnis" onChange={e => setResult(e.target.value)}/>
      </div>

    </div>
  )
}


// Exported Components
export function FeatEntryDialog({ athlete, id }: { athlete: string, id: number }) {
  return (
    <DialogContent onClick={e => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>Leistungseintragung</DialogTitle>
        <DialogDescription>
          <span>{`Dokumentieren Sie einen neuen Leistungswert für ${athlete}`}</span>
        </DialogDescription>
      </DialogHeader>
      <FeatEntryContent id={id} />
      <DialogFooter>
        <DialogClose asChild>
          <Button
            className="w-full"
            id="submit"
            onClick={submit}
          >
            Eintragen
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export function FeatEntryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leistungseintragung</CardTitle>
        <CardDescription>Dokumentieren Sie einen neuen Leistungswert für einen Athleten</CardDescription>
      </CardHeader>
      <CardContent>
        <FeatEntryContent />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          id="submit"
          onClick={submit}
        >
          Eintragen
        </Button>
      </CardFooter>
    </Card>
  );
}
