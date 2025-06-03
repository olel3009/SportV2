"use client";
import { Athlete, Rule } from "@/models/athlete";
import { getAllAthletes, addFeatToAthlete, getAllDisciplines, getAllRules, getRulesByDisciplineId, getAthleteById } from "@/../generic_functions/athlete_getters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { calculateAge, calculateAgeAtTime, parseDDMMYYYY } from "@/generalHelpers";
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
import * as Tooltip from "@radix-ui/react-tooltip";

type athAgeMap={
  athId:string;
  age:number;
  dob:string;
}

let ageMapper: athAgeMap[]=[];

function AthleteSelect({
  value,
  onChange,
  id = -1
}: {
  value: string;
  onChange: (val: string) => void;
  id?: number;
}) {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const athleteSet = id !== -1;

  useEffect(() => {
    getAllAthletes().then(setAthletes)
  }, [])
  athletes.forEach(ath=>{
    const athId = String(ath.id);
    const age   = calculateAge(ath.dateOfBirth);
    const dob = ath.dateOfBirth;
    
    const map: athAgeMap = {athId, age, dob}; 

    ageMapper.push(map);
  });
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

export function DisciplineSelect({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [options, setOptions] = useState<{ id: number; name: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllDisciplines()
      .then((data) => setOptions(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-600">Failed to load: {error}</div>;
  if (!options) return <div>Loading disciplines…</div>;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="discipline">
        <SelectValue placeholder="Disziplin wählen" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem value={String(opt.id)} key={opt.id}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}



export function ExerciseSelect({
  disciplineId,
  value,
  age,
  currYear,
  onChange
}: {
  disciplineId: string;
  value: string;
  age:number;
  currYear:string;
  onChange: (val: string) => void;
}) {
  const [exercises, setExercises] = useState<{ id: number; rule_name: string; min_age: number; max_age: number; valid_start:string; valid_end:string;}[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!disciplineId){
      console.log("No discipline Id");
      return;
    } 
    getRulesByDisciplineId(Number(disciplineId))
      .then((data) => setExercises(data ?? []))
      .catch((err) => setError(err.message));
  }, [disciplineId]);

  if (error) return <div className="text-red-600">Fehler: {error}</div>;
  if (!exercises) return <div>Loading exercises…</div>;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id="uebung">
        <SelectValue placeholder="Übung wählen" />
      </SelectTrigger>
      <SelectContent>
        {exercises.map((exer) => {

          const valStartDate = typeof exer.valid_start === 'string'
                ? parseDDMMYYYY(exer.valid_start)
                : exer.valid_start;
          const valEndDate = typeof exer.valid_end === 'string'
                ? parseDDMMYYYY(exer.valid_end)
                : exer.valid_end;

          const currDat = typeof currYear === 'string'
                ? parseDDMMYYYY(currYear)
                : currYear;
          if((age>=exer.min_age&&age<=exer.max_age)  &&  (currDat>=valStartDate&&currDat<=valEndDate)){
            return(<SelectItem value={String(exer.id)} key={exer.id}>
                    {exer.rule_name}
                  </SelectItem>)
          }
          else{
            return null;
          }
      })}
      </SelectContent>
    </Select>
  );
}


let uebID=0
let dat=""
let erg = "";
let ath = 0;
const submit = () => {

  console.log("Uebung:", uebID, "Athlet:", ath, "Datum:", dat, "Ergebnis:", erg);
  addFeatToAthlete(ath, uebID, dat, erg);
}


function formatGermanDate(d: Date): string {
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0–11
  const year  = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function FeatEntryContent({ id = -1 }: { id?: number }) {
  const today = new Date();
  const formatted = formatGermanDate(today);
  let resDesc="erg in whatever";

  // fetched data
  const [exercises, setExercises] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [selectedAthlete, setSelectedAthlete] = useState("");
  const [athleteAge, setAthleteAge] = useState<number>(0);
  const [activeAge, setActiveAge] = useState<number>(0);
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState(String(formatted));

  const handleAthleteChange=(newAth:string)=>{
    setSelectedAthlete(newAth);
      // find the one entry whose athId matches newAth
    const found = ageMapper.find(m => m.athId === newAth);

    // if we found it, setAthleteAge to that age, otherwise 0 (or whatever default makes sense)
    setAthleteAge(found?.age ?? 0);
    setActiveAge(athleteAge);
  }

  const handleDoneDateChange=(newDate:string)=>{
    const found = ageMapper.find(m => m.athId === selectedAthlete);
    const bDate = found?.dob ?? "00.00.0000";

    let newActiveAge = calculateAgeAtTime(bDate, newDate);
    setActiveAge(newActiveAge);
    setDate(newDate);
  }

  // load rules + disciplines once
  useEffect(() => {
    let cancelled = false;
    ;(async () => {
      try {
        const [allRules, allDisc] = await Promise.all([
          getAllRules(),
          getAllDisciplines(),
        ]);
        if (cancelled) return;

        setExercises(allRules);

        // default discipline → first discipline
        if (allDisc.length > 0) {
          const firstDis = allDisc[0].id;
          setSelectedDiscipline(String(firstDis));

          // default exercise → first matching that discipline
          const firstEx = allRules.find((r) => r.discipline_id === firstDis);
          setSelectedExercise(firstEx ? String(firstEx.id) : "");
        }

        // default athlete if passed in
        if (id !== -1) {
          handleAthleteChange(String(id));
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);
  

  // sync out to your module-scope vars
  useEffect(() => {
    uebID = Number(selectedExercise);
    dat = date;
    erg = result;
    ath = Number(selectedAthlete);
  }, [selectedAthlete, selectedDiscipline, selectedExercise, result, date]);

  const handleDisciplineChange = (newDiscipline: string) => {
    setSelectedDiscipline(newDiscipline);
    // pick first exercise in that discipline
    const firstEx:Rule|undefined = exercises.find(
      (ex) => ex.discipline_id === Number(newDiscipline)
    );
    setSelectedExercise(firstEx ? String(firstEx.id) : "");
  };

  const currentRule = exercises.find(
    (r) => r.id === Number(selectedExercise)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Uebung:",
      uebID,
      "Athlet:",
      ath,
      "Datum:",
      dat,
      "Ergebnis:",
      erg
    );
    addFeatToAthlete(ath, uebID, dat, erg);
  };
  

  if (loading) return <div>Loading form…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="grid gap-2">
            <Label>Athlet</Label>
                <AthleteSelect
                  id={id}
                  value={selectedAthlete}
                  onChange={handleAthleteChange}
                />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Wählen sie einen Athleten
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="grid gap-2">
            <Label>Disziplin</Label>
            <DisciplineSelect
              value={selectedDiscipline}
              onChange={handleDisciplineChange}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Wählen sie eine Disziplin
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="grid gap-2">
            <Label>Übung</Label>
            <ExerciseSelect
              disciplineId={selectedDiscipline}
              value={selectedExercise}
              age={activeAge}
              currYear={date}
              onChange={setSelectedExercise}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Wählen sie eine Übung
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="grid gap-2">
            <Label htmlFor="datum">Datum</Label>
            <Input
              id="datum"
              name="datum"
              placeholder="Datum des Ergebnis"
              value={date}
              onChange={(e) => handleDoneDateChange(e.target.value)}
            />
          </div>
          </Tooltip.Trigger>
        <Tooltip.Content
          side="top" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Geben sie das Datum ein, an dem die Leistung erbracht wurde
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="grid gap-2">
            <Label htmlFor="ergebnis">
              Ergebnis {currentRule ? `(${currentRule.unit})` : ""}
            </Label>
            <Input
              id="ergebnis"
              placeholder={`Ergebnis in ${currentRule?.unit ?? ""}`}
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Geben sie die erbrachte Leistung im angezeigten Format ein
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

    </form>
  );
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
