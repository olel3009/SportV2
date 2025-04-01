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
import { useState } from "react";


function AthleteSelect({ id = -1 }: { id?: number }) {
  const athletes: Athlete[] = getAllAthletes();
  const athleteSet = id !== -1;

  return (
    <Select defaultValue={athleteSet ? id.toString() : ""} disabled={athleteSet}>
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

let initSelect: string = '';
function DisciplineSelect() {
  const exercises = getExercises();
  const options = Object.keys(exercises);
  initSelect = options[0];

  const handleChange = (value: string) => {
    const allExercises = document.querySelectorAll<HTMLElement>('[id^="exercise_"]')
    allExercises.forEach((el) => {
      el.hidden = el.id !== `exercise_${value}`;
    });
    initSelect = value;
  };

  return (
    <Select onValueChange={handleChange} defaultValue={options[0]}>
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

function ExerciseSelect() {
  const exercises = getExercises();
  let options = Object.keys(exercises);

  return (
    <>
      {options.map((option, index) => {
        const currEx = exercises[option];
        return (
          <div id={`exercise_${option}`} key={index} hidden={option !== initSelect}>
            <Select defaultValue={currEx[0]}>
              <SelectTrigger id="uebung">
                <SelectValue placeholder="Übung wählen" />
              </SelectTrigger>
              <SelectContent>
                {currEx.map((exer, i) => (
                  <SelectItem value={exer} key={i}>
                    {exer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      })}
    </>
  )
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
  const year = String(date.getFullYear());
  return `${day}.${month}.${year}`;
}

const submit = () => {
  // Safely cast each element to its correct type
  const uebungSelect = document.getElementById("uebung") as SelectTriggerProps | null;
  const athleteSelect = document.getElementById("athlete") as SelectTriggerProps | null;
  const datumInput = document.getElementById("datum") as SelectTriggerProps | null;
  const ergebnisInput = document.getElementById("ergebnis") as SelectTriggerProps | null;

  if (!uebungSelect || !athleteSelect || !datumInput || !ergebnisInput) {
    console.error("Some elements were not found in the DOM.");
    return;
  }

  // Use .value instead of getAttribute("value")
  let ueb = String(uebungSelect.value);
  let ath = Number(athleteSelect.value);
  let dat = String(datumInput.value);
  let erg = String(ergebnisInput.value);

  console.log("Uebung:", ueb, "Athlet:", ath, "Datum:", dat, "Ergebnis:", erg);
  addFeatToAthlete(ath, ueb, dat, erg);
};

function FeatEntryContent({ id = -1 }: { id?: number }) {
  const today = new Date();
  const formatted = formatDate(today);
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="flex flex-col gap-4">

      <div className="grid gap-2">
        <Label>Athlet</Label>
        <AthleteSelect id={id} />
      </div>

      <div className="grid gap-2">
        <Label>Disziplin</Label>
        <DisciplineSelect />
      </div>

      <div className="grid gap-2">
        <Label>Übung</Label>
        <ExerciseSelect />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="datum">Datum</Label>
        <Input
          name="datum"
          id="datum"
          placeholder="Datum des Ergebnis"
          defaultValue={formatted}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ergebnis">Ergebnis</Label>
        <Input id="ergebnis" placeholder="Ergebnis" />
      </div>

    </div>
  )
}

export function FeatEntryDialog( {athlete, id}: {athlete: string, id: number} ) {
  return (
    <DialogContent onClick={e => e.stopPropagation()}>
      <DialogHeader>
        <DialogTitle>Leistungseintragung</DialogTitle>
        <DialogDescription>
          <span>{`Dokumentieren Sie einen neuen Leistungswert für ${athlete}`}</span>
        </DialogDescription>
      </DialogHeader>
      <FeatEntryContent id={id}/>
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
