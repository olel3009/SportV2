//Fügen Sie hier alle Funktionen ein, die Athleten abrufen, damit sie im bereits vorhandenen Code verwendet werden können
//Auf diese Weise müssen wir, wenn die API fertig ist, nur die Logik hier ändern und nicht an anderer Stelle im Code
//Außerdem werden diese Funktionen mit ziemlicher Sicherheit mehr als einmal verwendet, daher ist es gut, sie woanders zu platzieren
import { Athlete, Feat, Rule, Discipline } from "../src/models/athlete";

export type csvCombo ={
  last_name:string;
  first_name:string;
  gender:string;
  birth_date:string;
  exercise:string;
  category:string;
  date:string;
  medal:string;
  result:number;
}

export async function getAthleteWithFeats(id:number): Promise<csvCombo[]> {
  let fetchlink:string='http://127.0.0.1:5000/athletes/'+id+'/results';
  console.log(fetchlink);
  const res = await fetch(fetchlink, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }
  let data = await res.json();
  let last_name_raw:string=data.athlete.last_name;
  let first_name_raw:string=data.athlete.first_name;
  let gender_raw:string=data.athlete.gender;
  let birth_date_raw:string=data.athlete.birth_date;
  const mapped:csvCombo[]=data.results.map((raw)=>({
    last_name:last_name_raw,
    first_name:first_name_raw,
    gender:gender_raw,
    birth_date:birth_date_raw,
    exercise:raw.rule.rule_name,
    category:raw.rule.discipline.discipline_name,
    date:raw.created_at,
    medal:raw.medal,
    result:raw.result
  }));
  return mapped;

}


type RawAthlete = {
  id: number;
  first_name: string;
  last_name: string;
  gender: "m" | "w" | "d";
  birth_date: string;
  swim_certificate: boolean;
  created_at: string;
  updated_at: string;
};

export async function getAthleteById(id: number): Promise<Athlete | undefined> {
  const all = await getAllAthletes();
  return all.find(a => a.id === id);
}

export async function getAllAthletes(): Promise<Athlete[]> {
  const res = await fetch("http://127.0.0.1:5000/athletes", {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  const data: RawAthlete[] = await res.json();

  //Mapping
  const mapped: Athlete[] = data.map((raw) => ({
    id: raw.id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    sex: raw.gender,
    dateOfBirth: raw.birth_date,
    goldMedals: 0,
    silverMedals: 0,
    bronzeMedals: 0,
    disciplines: [],
    feats: [],
  }));

  return mapped;
}


type RawFeat = {
  id: number;
  athlete_id: number;
  rule_id: number;
  year: number;
  age: number;
  result: number;
  medal: string;
  created_at: string;
  updated_at: string;
};

export async function getFeatsById(id: number): Promise<Feat[] | undefined> {
  const all = await getAllFeats(true, id);
  return all.filter(a => a.athlete_id === id);
}

export async function getAllFeats(forOne:boolean=false, id:number|null=null): Promise<Feat[]> {
  const res = await fetch("http://127.0.0.1:5000/results", {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  const data: RawFeat[] = await res.json();

  //Mapping
  let preppedFeats: Feat[] = data.map((raw) => ({
    id: raw.id,
    athlete_id: raw.athlete_id,
    rule_id: raw.rule_id,
    year: raw.year,
    age: raw.age,
    result: raw.result,
    medal: raw.medal,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    ruling:undefined,
  }));

  const rules= await getAllRules();
  if(forOne){
    preppedFeats=preppedFeats.filter(a => a.athlete_id === id);
  }

  preppedFeats.forEach( feat=>{
    feat.ruling=rules.find(r=>r.id==feat.rule_id);
  });

  return preppedFeats;
}

type RawRule= {
  id: number;

  discipline_id: number;

  rule_name: string;

  description_m: string;
  description_f: string;

  unit: string;

  min_age: number;
  max_age: number;

  threshold_bronze_m: number;
  threshold_silver_m: number;
  threshold_gold_m: number;

  threshold_bronze_f: number;
  threshold_silver_f: number;
  threshold_gold_f: number;

  valid_start: Date;
  valid_end: Date;

  version:number;

  created_at:Date;
  updated_at:Date;
}


export async function getAllRules(): Promise<Rule[]> {
  const res = await fetch("http://127.0.0.1:5000/rules", {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  const data: RawRule[] = await res.json();

  //Mapping
  const mapped: Rule[] = data.map((raw) => ({
    id: raw.id,

    discipline_id: raw.discipline_id,

    rule_name: raw.rule_name,

    description_m: raw.description_m,
    description_f: raw.description_f,

    unit: raw.unit,

    min_age: raw.min_age,
    max_age: raw.max_age,

    thresh_bronze_m: raw.threshold_bronze_m,
    thresh_silver_m: raw.threshold_silver_m,
    thresh_gold_m: raw.threshold_gold_m,

    thresh_bronze_f: raw.threshold_bronze_f,
    thresh_silver_f: raw.threshold_silver_f,
    thresh_gold_f: raw.threshold_gold_f,

    valid_start: raw.valid_start,
    valid_end: raw.valid_end,

    version:raw.version,

    created_at:raw.created_at,
    updated_at:raw.updated_at,
  }));

  return mapped;
}

type RawDiscipline ={
  id:number;
  discipline_name:string;
  created_at:Date;
  updated_at:Date;
}


export async function getAllDisciplines(): Promise<Discipline[]> {
  const res = await fetch("http://127.0.0.1:5000/disciplines", {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  const data: RawDiscipline[] = await res.json();

  //Mapping
  let mapped: Discipline[] = data.map((raw) => ({
    id: raw.id,
    name: raw.discipline_name
  }));


  return mapped;
}

export function calculateMedal(score: number): number {
  return 69;
}

export async function addFeatToAthlete(
  athleteId: number,
  exercise: string,
  date: string,
  result: string
) {
  let athlete = await getAthleteById(athleteId);
  if (!athlete) {
    return;
  }
  if (exercise == "") {
    alert("Bitte eine Übung auswählen!");
    return;
  }
  if (date == "") {
    alert("Bitte ein Datum eingeben!");
    return;
  }
  if (result == "") {
    alert("Bitte ein Ergebnis eingeben!");
    return;
  }
  console.log("before: " + athlete.feats);
  let discipline: string;
  let exToDisc = [["50mLauf"], ["Hochsprung", "Weitsprung"], ["Kugelstossen"]];
  if (exToDisc[0].includes(exercise)) {
    discipline = "Schnelligkeit";
  } else if (exToDisc[1].includes(exercise)) {
    discipline = "Koordination";
  } else if (exToDisc[2].includes(exercise)) {
    discipline = "Kraft";
  } else {
    discipline = "Sonstiges";
  }
  let score = calculateMedal(result.length);
  let newFeat: Feat = {
    discipline: discipline,
    exercise: exercise,
    date: date,
    result: result,
    score: score,
  };
  if (athlete.feats) {
    let repeat = false;
    let overwrite = false;
    athlete.feats.forEach((feat) => {
      if (feat.date == date && feat.exercise == exercise) {
        repeat = true;
      }
    });
    if (repeat) {
      overwrite = confirm(
        "Diese Übung wurde für diesen Tag bereits eingetragen, überschreiben?"
      );
    }
    if (repeat) {
      if (overwrite) {
        athlete.feats.push(newFeat);
        alert("Neue Leistung Eingetragen!");
      }
    } else {
      athlete.feats.push(newFeat);
      alert("Neue Leistung Eingetragen!");
    }
  } else {
    athlete.feats = [newFeat];
    alert("Neue Leistung Eingetragen!");
  }
  console.log("after: " + athlete.feats);
}
