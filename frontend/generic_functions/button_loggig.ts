import { useEffect, useState } from "react";
import { validateAndGetToken } from "./auth";
import { error } from "console";

//1 für positive und 0 für negative rückmeldung
let dbresults = 0;
//0 für aktuelles Datum und 1 für nicht aktuelles Datum welche keine hinterlegung triggert, 2 für hervorheben
let other_date = 0;

type RawRule ={
  id:number;
  discipline_id:number;
  rule_name:string;
  created_at:Date;
  updated_at:Date;
  valid_start:Date;
}


export function button_loggig_dbresults_changer(x: number): void {
    //1 für positive und 0 für negative rückmeldung
    //Dient zu testzwecken
    if (x == 1) {
        dbresults = 1;
    } else {
        dbresults = 0;
    }
}

export function button_loggig_date(): number {
    console.log("button_loggig_date");
    let result = 0;
    if (other_date == 0)/*dass reale Datum zu Nutzen*/ {
        if (new Date().getMonth() <= 0) /*Wenn es Januar ist*/ {
            if (new Date().getDate() >= 29)/*Wenn es Januar ist und nicht die ersten vier Wochen des Jahres*/ {
                result = 0; //0 bedeutet, dass der Knopf nicht hervorgehoben wird
            } else/*Wenn es Januar ist und in den ersten vier Wochen*/ {
                result = 1;//1 bedeutet, dass der Knopf hervorgehoben wird
            }
        } else {
            result = 0; //0 bedeutet, dass der Knopf nicht hervorgehoben wird
        }
    } else {
        if (other_date == 1) {
            result = 0;
        } else {
            result = 1;
        }
    }
    return result;
}

export async function button_loggig_dbresults(): Promise<number> {
    const token = validateAndGetToken();
    if (token === null || token === false) {
        // Token ist ungültig, validateAndGetToken leitet bereits weiter
        return 0; // Fehlertext zurückgeben
    }else{
console.log("button_loggig_dbresults");
    //Hier wird der Wert der Datenbankabfrage zurückgegeben, ob die Regelungen schon mal in diesem Jahr aktualisiert wurden
    //1 für positive und 0 für negative rückmeldung
    const res = await fetch("http://127.0.0.1:5000/rules", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token")
        },
        method: "GET",
        cache: "no-store"
    });
    if (!res.ok) {
        return 0; // Fehler bei der API-Abfrage
        throw new Error(`API call failed: ${res.status}`);
    }
    const data: RawRule[] = await res.json();
    const mapped: RawRule[] = data.map((raw) => ({
        id: raw.id,
        discipline_id: raw.discipline_id,
        rule_name: raw.rule_name,
        created_at: new Date(raw.created_at),
        updated_at: new Date(raw.updated_at),
        valid_start: new Date(raw.valid_start)
    }));
    //console.log("Mapped data:", mapped);
    const year =  new Date().getFullYear();
    //console.log("Current year:", year);
    //console.log("Mapped years:", mapped.some((rule) => rule.created_at.getFullYear()));

    if (mapped.some((rule) => rule.created_at.getFullYear() === year )) {
        dbresults = 1; // Regelungen wurden in diesem Jahr aktualisiert
        console.log("Regelungen wurden in diesem Jahr aktualisiert");
    }else{
        dbresults = 0; // Regelungen wurden in diesem Jahr noch nicht aktualisiert
        console.log("Regelungen wurden in diesem Jahr noch nicht aktualisiert");
    }
    return dbresults;
    }
    
}

export function button_loggig_other_date_changer(x: number): void {
    //0 für aktuelles Datum und 1 für nicht aktuelles Datum welche keine hinterlegung triggert, 2 für hervorheben
    //Dient zu testzwecken
    if (x == 1) {
        other_date = 0;
    } else {
        if (x == 2) {
            other_date = 1;
        } else {
            other_date = 2;

        }
    }
}

export async function button_loggig_color(): Promise<number> {
    let result = 0;
    if (await button_loggig_dbresults() === 1) {// bedeutet dass die regelungen aktualisiert wurden 
        result = 0;
    } else {
        if (button_loggig_date() == 0) {// es sind die ersten vier Wochen des Jahres vorbei
            result = 0;
        } else {
            result = 1;
        }
    }
    return result;
    //return 1;
}

export async function add_rules(file: File): Promise<string | null> {

    const token = validateAndGetToken();
    if (token === null || token === false) {
        // Token ist ungültig, validateAndGetToken leitet bereits weiter
        let errorMsg ="Token ist ungültig";
        return errorMsg; // Fehlertext zurückgeben
    }else{
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://127.0.0.1:5000/rules/import", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token")
        },
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        let errorMsg = "Unbekannter Fehler";
        try {
            const error = await res.json();
            errorMsg = error.error || JSON.stringify(error);
        } catch (e) {
            errorMsg = res.statusText;
        }
        console.log("Error adding rule:", errorMsg);
        return errorMsg; // Fehlertext zurückgeben
    } else {
        console.log("Rule added successfully");
        return null; // kein Fehler
    } 
}
}


