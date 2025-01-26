"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { json } from "stream/consumers";
import exp from "constants";

let exportThese:Array<Number>;
exportThese =[];

function exportToCsv(idArray:Array<Number>){
  //get Actual Values for export from Database/API here
  console.log(idArray);
  const csvRows = [
    ["ID"], // CSV headers
    idArray.map((row) => [
      row
    ]),
  ];
  if(idArray.length<1){
    alert("Bitte wählen sie die Athleten aus, welche sie exportieren wollen!");
  }else{
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    if (idArray.length==1){
      link.download = `${idArray[0]}_data.csv`;
    }else{
      link.download = `athleten_export_data.csv`;
    }
    link.click();
    URL.revokeObjectURL(url);
  }
}

export function  ExportCheckbox({id}){
  let willBeExported = false;
  function putID(yes:boolean, id:Number){
    willBeExported=!yes;
    if(willBeExported){
      exportThese.push(id);
    }else{
      exportThese=exportThese.filter(item=> item!=id);
    }
  }
  return(
  <input id = {`${id}export_checkbox`} name='csvCheckbox' type='checkbox' onChange={()=>putID(willBeExported, id)}></input>
  );
}

export function MassExportButton(){
  function massExport(){
    exportToCsv(exportThese);
  }
  return(
    <button name="csvMassExportButt" onClick = {()=>massExport()}>
        Alle ausgewählten als CSV exportieren
    </button>
    );
}

export function SingleCSVExportButton({id, vorName, nachName}){
  function exportAsCSV(id){
    let justThis:Array<Number>; 
    justThis =[id];
    exportToCsv(justThis);
  }
  return(
  <button id = {`${id}export_button`} name='csvSingleExportButt' onClick = {()=>exportAsCSV(id)}>
      {vorName} {nachName} als CSV exportieren
  </button>
  );
}

let isCool=true;

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