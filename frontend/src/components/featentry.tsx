"use client";
import { Athlete, Rule } from "@/models/athlete";
import { getAllAthletes, addFeatToAthlete, getAllDisciplines, getAllRules, getRulesByDisciplineId } from "@/../generic_functions/athlete_getters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
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
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const athleteSet = id !== -1;

  useEffect(() => {
    getAllAthletes().then(setAthletes)
  }, [])

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
  onChange
}: {
  disciplineId: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [exercises, setExercises] = useState<{ id: number; rule_name: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!disciplineId) return;
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
        {exercises.map((exer) => (
          <SelectItem value={String(exer.id)} key={exer.id}>
            {exer.rule_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function formatDate(date: Date): number {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
  const year = date.getFullYear();
  //return `${day}.${month}.${year}`;
  return year;
}

let uebID=0
let dat=0
let erg = "";
let ath = 0;
const submit = () => {
  console.log("Uebung:", uebID, "Athlet:", ath, "Datum:", dat, "Ergebnis:", erg);
  addFeatToAthlete(ath, uebID, dat, erg);
}

export function FeatEntryContent({ id = -1 }: { id?: number }) {
  const today = new Date();
  const formatted = formatDate(today);
  let resDesc="erg in whatever";

  // fetched data
  const [exercises, setExercises] = useState<Rule[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [selectedAthlete, setSelectedAthlete] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState<number>(formatted);

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
        setDisciplines(allDisc);

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
          setSelectedAthlete(String(id));
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
      <div className="grid gap-2">
        <Label>Athlet</Label>
        <AthleteSelect
          id={id}
          value={selectedAthlete}
          onChange={setSelectedAthlete}
        />
      </div>

      <div className="grid gap-2">
        <Label>Disziplin</Label>
        <DisciplineSelect
          value={selectedDiscipline}
          onChange={handleDisciplineChange}
        />
      </div>

      <div className="grid gap-2">
        <Label>Übung</Label>
        <ExerciseSelect
          disciplineId={selectedDiscipline}
          value={selectedExercise}
          onChange={setSelectedExercise}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="datum">Datum</Label>
        <Input
          id="datum"
          name="datum"
          type="number"
          placeholder="Datum des Ergebnis"
          value={date}
          onChange={(e) => setDate(Number(e.target.value))}
        />
      </div>

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
