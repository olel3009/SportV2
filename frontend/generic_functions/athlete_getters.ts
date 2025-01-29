//Fügen Sie hier alle Funktionen ein, die Athleten abrufen, damit sie im bereits vorhandenen Code verwendet werden können
//Auf diese Weise müssen wir, wenn die API fertig ist, nur die Logik hier ändern und nicht an anderer Stelle im Code
//Außerdem werden diese Funktionen mit ziemlicher Sicherheit mehr als einmal verwendet, daher ist es gut, sie woanders zu platzieren
import { Athlete } from "@/models/athlete";

let mockupData = `[
  {
    "id": 1,
    "firstName": "Max",
    "lastName": "Muster",
    "sex": "m",
    "dateOfBirth": "1995-07-15",
    "disciplines": ["100m Sprint", "Weitsprung"],
    "feats": []
  },
  {
    "id": 2,
    "firstName": "Lisa",
    "lastName": "Beispiel",
    "sex": "w",
    "dateOfBirth": "1998-03-22",
    "disciplines": ["Speerwurf", "Diskuswurf"],
    "feats": []
  },
  {
    "id": 3,
    "firstName": "Chris",
    "lastName": "Musterfrau",
    "sex": "d",
    "dateOfBirth": "2000-12-05",
    "disciplines": ["Hochsprung"],
    "feats": []
  },
  {
    "id": 4,
    "firstName": "Jonas",
    "lastName": "Klein",
    "sex": "m",
    "dateOfBirth": "1992-11-30",
    "disciplines": ["400m Hürden", "Stabhochsprung"],
    "feats": []
  },
  {
    "id": 5,
    "firstName": "Sophie",
    "lastName": "Schmidt",
    "sex": "w",
    "dateOfBirth": "1997-09-17",
    "disciplines": ["Marathon"],
    "feats": []
  },
  {
    "id": 6,
    "firstName": "Alex",
    "lastName": "Fischer",
    "sex": "d",
    "dateOfBirth": "2001-06-25",
    "disciplines": ["Dreisprung", "110m Hürden"],
    "feats": []
  },
  {
    "id": 7,
    "firstName": "Tobias",
    "lastName": "Weber",
    "sex": "m",
    "dateOfBirth": "1993-04-12",
    "disciplines": ["Zehnkampf"],
    "feats": []
  },
  {
    "id": 8,
    "firstName": "Hannah",
    "lastName": "Meier",
    "sex": "w",
    "dateOfBirth": "1999-08-05",
    "disciplines": ["800m", "1500m"],
    "feats": []
  },
  {
    "id": 9,
    "firstName": "Nico",
    "lastName": "Lange",
    "sex": "m",
    "dateOfBirth": "1994-03-27",
    "disciplines": ["Kugelstoßen"],
    "feats": []
  },
  {
    "id": 10,
    "firstName": "Emma",
    "lastName": "Becker",
    "sex": "w",
    "dateOfBirth": "2002-02-14",
    "disciplines": ["5000m", "10.000m"],
    "feats": []
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