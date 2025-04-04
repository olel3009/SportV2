//Fügen Sie hier alle Funktionen ein, die Athleten abrufen, damit sie im bereits vorhandenen Code verwendet werden können
//Auf diese Weise müssen wir, wenn die API fertig ist, nur die Logik hier ändern und nicht an anderer Stelle im Code
//Außerdem werden diese Funktionen mit ziemlicher Sicherheit mehr als einmal verwendet, daher ist es gut, sie woanders zu platzieren
import {Athlete, Feat} from "../src/models/athlete"
let mockupData = `[
  {
    "id": 420,
    "lastName": "Schulz",
    "firstName": "Dieter",
    "sex": "m",
    "eMail": "ds@wasauchimmer.de",
    "dateOfBirth": "18.03.2014",
    "disciplines": ["Schnelligkeit", "Kraft"],
    "goldMedals": 3,
    "silverMedals": 0,
    "bronzeMedals": 0,
    "feats": [
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "5.09.2023",
        "result": "10 Sek",
        "score": "90"
      },
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "5.09.2022",
        "result": "90 Sek",
        "score": "1"
      },
      {
        "discipline": "Kraft",
        "exercise": "Springen",
        "date": "5.08.2023",
        "result": "50 cm",
        "score": "70"
      }
    ]
  },
  {
    "id": 69,
    "lastName": "Dortmeier",
    "firstName": "Peter",
    "sex": "m",
    "eMail": "pD@wasauchimmer.de",
    "dateOfBirth": "10.08.2010",
    "disciplines": ["Schnelligkeit", "Kraft"],
    "goldMedals": 2,
    "silverMedals": 0,
    "bronzeMedals": 0,
    "feats": [
      {
        "discipline": "Kraft",
        "exercise": "Springen",
        "date": "5.08.2023",
        "result": "90 cm",
        "score": "80"
      },
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "5.09.2023",
        "result": "5 Sek",
        "score": "100"
      },
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "5.09.2022",
        "result": "10 Sek",
        "score": "80"
      }
    ]
  },
  {
    "id": 101,
    "lastName": "Müller",
    "firstName": "Anna",
    "sex": "w",
    "eMail": "anna.mueller@example.de",
    "dateOfBirth": "15.06.2005",
    "disciplines": ["Schnelligkeit", "Kraft"],
    "goldMedals": 4,
    "silverMedals": 2,
    "bronzeMedals": 1,
    "feats": [
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "01.09.2023",
        "result": "8 Sek",
        "score": "92"
      },
      {
        "discipline": "Kraft",
        "exercise": "Springen",
        "date": "01.08.2023",
        "result": "75 cm",
        "score": "85"
      }
    ]
  },
  {
    "id": 102,
    "lastName": "Schneider",
    "firstName": "Max",
    "sex": "m",
    "eMail": "max.schneider@example.de",
    "dateOfBirth": "02.11.2002",
    "disciplines": ["Schnelligkeit", "Kraft"],
    "goldMedals": 0,
    "silverMedals": 3,
    "bronzeMedals": 1,
    "feats": [
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "02.09.2023",
        "result": "7 Sek",
        "score": "95"
      },
      {
        "discipline": "Kraft",
        "exercise": "Springen",
        "date": "02.08.2023",
        "result": "80 cm",
        "score": "88"
      }
    ]
  },
  {
    "id": 103,
    "lastName": "Becker",
    "firstName": "Lisa",
    "sex": "w",
    "eMail": "lisa.becker@example.de",
    "dateOfBirth": "30.01.2008",
    "disciplines": ["Kraft"],
    "goldMedals": 0,
    "silverMedals": 0,
    "bronzeMedals": 0,
    "feats": [
      {
        "discipline": "Kraft",
        "exercise": "Springen",
        "date": "03.08.2023",
        "result": "70 cm",
        "score": "75"
      }
    ]
  },
  {
    "id": 104,
    "lastName": "Wagner",
    "firstName": "Thomas",
    "sex": "m",
    "eMail": "thomas.wagner@example.de",
    "dateOfBirth": "05.05.2012",
    "disciplines": ["Schnelligkeit"],
    "goldMedals": 0,
    "silverMedals": 0,
    "bronzeMedals": 1,
    "feats": [
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "04.09.2023",
        "result": "6 Sek",
        "score": "98"
      }
    ]
  },
  {
    "id": 105,
    "lastName": "Fischer",
    "firstName": "Sophie",
    "sex": "w",
    "eMail": "sophie.fischer@example.de",
    "dateOfBirth": "21.03.2007",
    "disciplines": ["Schnelligkeit", "Kraft"],
    "goldMedals": 1,
    "silverMedals": 0,
    "bronzeMedals": 0,
    "feats": [
      {
        "discipline": "Schnelligkeit",
        "exercise": "Sprinten",
        "date": "05.09.2023",
        "result": "9 Sek",
        "score": "93"
      },
      {
        "discipline": "Kraft",
        "exercise": "Springen",
        "date": "05.08.2023",
        "result": "65 cm",
        "score": "82"
      }
    ]
  }
]`;

export function getAthleteById(id: number) : Athlete | undefined {  
    let translatedTrainees: Athlete[] = JSON.parse(mockupData);
    id = typeof id === "string" ? parseInt(id, 10) : id;

    // Return the trainee that has the id from the passed parameter 
    return translatedTrainees.find(trainee => trainee.id === id);
}


export function getAllAthletes() : Athlete[] {
  return JSON.parse(mockupData);
} 

export function calculateMedal(score: number) : number {
 return 69;
}


export function addFeatToAthlete(athleteId: number, exercise: string, date: string, result: string) {
  let athlete = getAthleteById(athleteId);
  if(!athlete){
    return;
  }
  if(exercise==''){
    alert("Bitte eine Übung auswählen!");
    return;
  }
  if(date==''){
    alert("Bitte ein Datum eingeben!");
    return;
  }
  if(result==''){
    alert("Bitte ein Ergebnis eingeben!");
    return;
  }
  console.log("before: "+athlete.feats);
  let discipline: string;
  let exToDisc = [["50mLauf"], ["Hochsprung", "Weitsprung"], ["Kugelstossen"]];
  if (exToDisc[0].includes(exercise)){
    discipline = "Schnelligkeit"; 
  }else if(exToDisc[1].includes(exercise)){
    discipline = "Koordination";
  }else if(exToDisc[2].includes(exercise)){
    discipline = "Kraft";
  }else{
    discipline = "Sonstiges";
  }
  let score = calculateMedal(result.length); 
  let newFeat:Feat = {
    discipline: discipline,
    exercise: exercise,
    date: date,
    result: result,
    score: score
  };
  if(athlete.feats){
    let repeat = false;
    let overwrite=false;
    athlete.feats.forEach(feat=>{
      if(feat.date==date&&feat.exercise==exercise){
        repeat=true;
      }
    });
    if(repeat){
      overwrite = confirm("Diese Übung wurde für diesen Tag bereits eingetragen, überschreiben?");
    }
    if(repeat){
      if(overwrite){
        athlete.feats.push(newFeat);
        alert("Neue Leistung Eingetragen!")
      }
    }else{
      athlete.feats.push(newFeat);
      alert("Neue Leistung Eingetragen!")
    }
  }else{
    athlete.feats = [newFeat];
    alert("Neue Leistung Eingetragen!")
  }
  console.log("after: "+athlete.feats);
}