import {getAthleteWithFeats, csvCombo} from "./athlete_getters"

export async function exportAthletesAsCsv(ids:number[]):Promise<string>{
    let csvTxt='Name;Vorname;Geschlecht;Geburtstag;Übung;Kategorie;Datum;Ergebnis;Punkte\n'
    for (const id of ids) {
        const currAthArr: csvCombo[] = await getAthleteWithFeats(id);
        currAthArr.forEach(currAth=>{
            csvTxt+=currAth.last_name+`;`+currAth.first_name+`;`+currAth.gender+`;`+currAth.birth_date+`;`+currAth.exercise+`;`+currAth.category+`;`+currAth.date+`;`+currAth.medal+`;`+ currAth.result+`\n`; 
        })     
    }
    return csvTxt;

}