"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { json } from "stream/consumers";
import exp from "constants";
import { MassExportButton, ExportCheckbox, SingleCSVExportButton } from "./csv_export_functions";




function CsvExporTable(){
  
//mockup, replace with actual JSON data source later
let traineeList =`[
  {
    "id": "420",
    "lastName": "Schulz",
    "name": "Dieter",
    "sex": "m",
    "dateOfBirth": "18.03.2014",
    "disciplines": ["Sprinten", "Springen"],
    "feats": [
      {
        "discipline": "Sprinten",
        "date": "5.09.2023",
        "result": "10 Sek",
        "score": "90"
      },
      {
        "discipline": "Sprinten",
        "date": "5.09.2022",
        "result": "90 Sek",
        "score": "1"
      },
      {
        "discipline": "Springen",
        "date": "5.08.2023",
        "result": "50 cm",
        "score": "70"
      }
    ]
  },
  {
    "id": "69",
    "lastName": "Dortmeier",
    "name": "Peter",
    "sex": "m",
    "dateOfBirth": "10.08.2010",
    "disciplines": ["Sprinten", "Springen"],
    "feats": [
      {
        "discipline": "Springen",
        "date": "5.08.2023",
        "result": "90 cm",
        "score": "80"
      },
      {
        "discipline": "Sprinten",
        "date": "5.09.2023",
        "result": "5 Sek",
        "score": "100"
      },
      {
        "discipline": "Sprinten",
        "date": "5.09.2022",
        "result": "10 Sek",
        "score": "80"
      }
    ]
  }
]`;
let translatedTrainees=JSON.parse(traineeList);
let listItems = translatedTrainees.map(trainee=><li key={trainee.id}><ExportCheckbox id={trainee.id} /> {trainee.name}, {trainee.lastName} <SingleCSVExportButton id={trainee.id} vorName={trainee.vorName} nachName={trainee.nachName} /></li>);
return(<ul id='athleteTable'>{listItems}</ul>);
}


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       Das hier ist die Standard next.js Seite und wird normalerweise angesprochen, ist also praktisch die index Seite
       Nutzt sie fürs Testen oder  bearbeitet schonmal was
        <div>
            <CsvExporTable />
            <MassExportButton />
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}