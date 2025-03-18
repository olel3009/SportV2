"use client";
import { Athlete } from "../../models/athlete";
import { getAllAthletes, addFeatToAthlete }  from "../../../generic_functions/athlete_getters";
import { getExercises } from "../../../generic_functions/calculation_functions";
import styles from "../page.module.css";

function AthleteSelect() {
  const athletes: Athlete[] = getAllAthletes();
  let options = athletes.map((athlete, index) => {
    return (
      <option value={athlete.id} key={index}>
        {athlete.firstName} {athlete.lastName}
      </option>
    );
  });
  return <select name="athlete" id="athlete" className={styles.basic_input}>{options}</select>;
}

let initSelect:string='';
function DisciplineSelect() {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const allExercises = document.querySelectorAll<HTMLElement>('[id^="exercise_"]');

    allExercises.forEach(element => {
        if (element.id === `exercise_${selectedValue}`) {
            element.hidden=false;
        } else {
            element.hidden=true;
        }
    });
};
  const exercises = getExercises();
  console.log(exercises);
  let options = Object.keys(exercises);
  let optEl=options.map((option, index)=>{
    if(initSelect==''){
      initSelect=option;
    }
    return (
      <option value={option} key={index}>
        {option}
      </option>
    );
  })
  return <select name="discipline" id="discipline" onChange = {handleSelectChange} className={styles.basic_input}>{optEl}</select>;
}

function ExerciseSelect(){
  const exercises = getExercises();
  console.log(exercises);
  let options = Object.keys(exercises);
  let optEl=options.map((option, index)=>{
    let currEx=exercises[option];
    let thisSel=currEx.map((exer, index)=>{
      return (
        <option value={exer} key={index}>
          {exer}
        </option>
      );
    })
    if(option==initSelect){
      return <select name="exercise" id={"exercise_"+option} key={index} className={styles.basic_input}>{thisSel}</select>;
    }else{
      return <select name="exercise" id={"exercise_"+option} key={index} hidden className={styles.basic_input}>{thisSel}</select>;
    }
    
  });
  return <span>{optEl}</span>;
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
    const uebungSelect   = document.getElementById("uebung")   as HTMLSelectElement | null;
    const athleteSelect  = document.getElementById("athlete")  as HTMLSelectElement | null;
    const datumInput     = document.getElementById("datum")    as HTMLInputElement  | null;
    const ergebnisInput  = document.getElementById("ergebnis") as HTMLInputElement  | null;

    if (!uebungSelect || !athleteSelect || !datumInput || !ergebnisInput) {
      console.error("Some elements were not found in the DOM.");
      return;
    }

    // Use .value instead of getAttribute("value")
    let ueb = uebungSelect.value;
    let ath = Number(athleteSelect.value);
    let dat = datumInput.value;
    let erg = ergebnisInput.value;

    console.log("Uebung:", ueb, "Athlet:", ath, "Datum:", dat, "Ergebnis:", erg);
    addFeatToAthlete(ath, ueb, dat, erg);
  };

  return (
    <div>
      <h1 className={styles.heading}>Leistungseintragung</h1>
      <p className={styles.paragraph}>
        <DisciplineSelect></DisciplineSelect>
      </p>
      <div>
        <ExerciseSelect></ExerciseSelect>
        <AthleteSelect />
        <input
          name="datum"
          id="datum"
          placeholder="Datum des Ergebnis"
          defaultValue={formatted}
          className={styles.basic_input}
        />
        <input id="ergebnis" placeholder="Ergebnis" className={styles.basic_input}/>
        <br />
        <button id="submit" onClick={submit} className={styles.basic_button}>Eintragen</button>
      </div>
    </div>
  );
}
