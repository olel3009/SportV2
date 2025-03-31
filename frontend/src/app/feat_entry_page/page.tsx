"use client";
import { Athlete } from "../../models/athlete";
import { getAllAthletes, addFeatToAthlete }  from "../../../generic_functions/athlete_getters";
import { getExercises } from "../../../generic_functions/calculation_functions";
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

function AthleteSelect() {
  const athletes: Athlete[] = getAllAthletes();

  return (
    <Select>
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

let initSelect:string='';
function DisciplineSelect() {
  const exercises = getExercises();
  const options = Object.keys(exercises);

  const handleChange = (value: string) => {
    const allExercises = document.querySelectorAll<HTMLElement>('[id^="exercise_"]')
    allExercises.forEach((el) => {
      el.hidden = el.id !== `exercise_${value}`;
    });
    initSelect = value;
  };

  return (
    <Select onValueChange={handleChange}>
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

function ExerciseSelect(){
  const exercises = getExercises();
  let options = Object.keys(exercises);

  return (
    <>
      {options.map((option, index) => {
        const currEx = exercises[option];
        return (
          <div id={`exercise_${option}`} key={index} hidden={option !== initSelect}>
            <Select>
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

export default function Home() {
  const today = new Date();
  const formatted = formatDate(today);

  const submit = () => {
    // Safely cast each element to its correct type
    const uebungSelect   = document.getElementById("uebung")   as SelectTriggerProps | null;
    const athleteSelect  = document.getElementById("athlete")  as SelectTriggerProps | null;
    const datumInput     = document.getElementById("datum")    as SelectTriggerProps | null;
    const ergebnisInput  = document.getElementById("ergebnis") as SelectTriggerProps | null;

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

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-2xl shadow-sm space-y-6">
      <h1 className="text-2xl font-semibold">Leistungseintragung</h1>
      <div className="space-y-4">
        <DisciplineSelect />
        <ExerciseSelect />
        <AthleteSelect />

        <Input
          name="datum"
          id="datum"
          placeholder="Datum des Ergebnis"
          defaultValue={formatted}
        />
        <Input id="ergebnis" placeholder="Ergebnis"/>

        <Button 
          className="w-full"
          id="submit" 
          onClick={submit}
        >
          Eintragen
        </Button>
      </div>
    </div>
  );
}
