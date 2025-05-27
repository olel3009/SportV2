import { getAthleteWithFeats, csvCombo, getAthleteById } from "./athlete_getters"
import { Athlete } from "@/models/athlete";

export async function getCsvString(ids:number[]):Promise<string>{
    let csvTxt='Name;Vorname;Geschlecht;Geburtsdatum;Übung;Kategorie;Datum;Ergebnis;Punkte\n'
    for (const id of ids) {
        const currAthArr: csvCombo[] = await getAthleteWithFeats(id);
        currAthArr.forEach(currAth => {
            csvTxt += currAth.last_name + `;` + currAth.first_name + `;` + currAth.gender + `;` + currAth.birth_date + `;` + currAth.exercise + `;` + currAth.category + `;` + currAth.date + `;` + currAth.medal + `;` + currAth.result + `\n`;
        })
    }
    return csvTxt;

}

export async function getPersCsvString(ids:number[]):Promise<string>{
    let csvTxt='Vorname;Nachname;Geburtsdatum;Geschlecht;Schwimmzertifikat;Email\n'
    for (const id of ids) {
        const currAth: Athlete | undefined = await getAthleteById(id);
        if (currAth != undefined) {
            csvTxt += currAth.firstName + `;` + currAth.lastName + `;` + currAth.dateOfBirth + `;` + currAth.sex + `;` + currAth.swimCertificate + `;`+currAth.email+`\n`;
        }
    }
    return csvTxt;

}

export async function downloadCsv(ids: number[]): Promise<boolean> {
    let filename = '';
    if (ids.length > 1) {
        filename = 'athleten_leist.csv';
    } else {
        let athlete: Athlete | undefined = await getAthleteById(ids[0]);
        if (athlete == undefined) {
            filename = 'athleten_leist.csv';
        } else {
            filename = athlete.firstName + '_' + athlete.lastName + '_leist.csv';
        }
    }
    let csvContent = await getCsvString(ids);
    try {
        // 1. Create a Blob representing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // 2. Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // 3. Create a hidden link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);

        // 4. Append to the DOM, trigger click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 5. Release the Object URL
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error(' feat CSV download failed:', error);
    }

    filename = '';
    if (ids.length > 1) {
        filename = 'athleten_pers.csv';
    } else {
        let athlete: Athlete | undefined = await getAthleteById(ids[0]);
        if (athlete == undefined) {
            filename = 'athleten_pers.csv';
        } else {
            filename = athlete.firstName + '_' + athlete.lastName + '_pers.csv';
        }
    }
    csvContent = await getPersCsvString(ids);
    try {
        // 1. Create a Blob representing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // 2. Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // 3. Create a hidden link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);

        // 4. Append to the DOM, trigger click and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 5. Release the Object URL
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error(' athlete CSV download failed:', error);
    }
    return true;
}
