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
      "feats": [
        {
          "discipline": "Schnelligkeit",
          "exercise": "50mLauf",
          "date": "05.09.2023",
          "result": "10 Sek",
          "score": "90"
        },
        {
          "discipline": "Schnelligkeit",
          "exercise": "Sprinten",
          "date": "05.09.2022",
          "result": "90 Sek",
          "score": "1"
        },
        {
          "discipline": "Kraft",
          "exercise": "Springen",
          "date": "05.08.2023",
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
      "feats": [
        {
          "discipline": "Kraft",
          "exercise": "Springen",
          "date": "05.08.2023",
          "result": "90 cm",
          "score": "80"
        },
        {
          "discipline": "Schnelligkeit",
          "exercise": "Sprinten",
          "date": "05.09.2023",
          "result": "5 Sek",
          "score": "100"
        },
        {
          "discipline": "Schnelligkeit",
          "exercise": "Sprinten",
          "date": "05.09.2022",
          "result": "10 Sek",
          "score": "80"
        }
      ]
    }
  ]`;

export function getAthleteById(id: number) : Athlete | undefined {  
    let translatedTrainees: Athlete[] = JSON.parse(mockupData);
    // Return the trainee that has the id from the passed parameter 
    return translatedTrainees.find(trainee => trainee.id === id);
}


export function getAllAthletes() : Athlete[] {
  return JSON.parse(mockupData);
} 

function calculateMedal(score: number) : number {
 return 69;
}


export function addFeatToAthlete(athleteId: number, exercise: string, date: string, result: string) {
  let athlete = getAthleteById(athleteId);
  if(!athlete){
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
      }
    }else{
      athlete.feats.push(newFeat);
    }
  }else{
    athlete.feats = [newFeat];
  }
  console.log("after: "+athlete.feats);
}