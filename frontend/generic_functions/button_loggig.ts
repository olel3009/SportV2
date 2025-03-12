
//1 für positive und 0 für negative rückmeldung
let dbresults = 0;
//0 für aktuelles Datum und 1 für nicht aktuelles Datum welche keine hinterlegung triggert, 2 für hervorheben
let other_date = 1;


export function button_loggig_dbresults_changer(x: number): void {
    if (x == 1) {
        dbresults = 1;
    } else {
        dbresults = 0;
    }
}

export function button_loggig_date(): number {
    let result = 0;
    if (other_date == 0)/*dass reale Datum zu Nutzen*/ {
        if (new Date().getMonth() === 1) /*Wenn es Januar ist*/ {
            if (new Date().getDate() >= 29)/*Wenn es Januar ist und nicht die ersten vier Wochen des Jahres*/ {
                result = 0; //0 bedeutet, dass der Knopf hervorgehoben wird
            } else/*Wenn es Januar ist und in den ersten vier Wochen*/ {
                result = 1;//1 bedeutet, dass der Knopf nicht hervorgehoben wird
            }
        } else {
            result = 0;
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

export function button_loggig_dbresults(): number {
    // Hier bitte Datenbankabfrgae/Api aufruf machen, zum feststellen, ob in diesem Jahr schon mal aktualisiert wurde

    //Hier wird der Wert der Datenbankabfrage zurückgegeben, ob die Regelungen schon mal in diesem Jahr aktualisiert wurden
    return dbresults;
}

export function button_loggig_other_date_changer(x: number): void {
    //0 für aktuelles Datum und 1 für nicht aktuelles Datum welche keine hinterlegung triggert, 2 für hervorheben
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

export function button_loggig_color(): number {
    let result = 0;
    if (dbresults == 1) {
        result = 0;
    } else {
        if (button_loggig_date() == 0) {
            result = 0;
        } else {
            result = 1;
        }
    }
    return result;
}


export function getButtonResult(): string {

    let result = "Das Aktualisieren der Reglung war erfolgreich";

    return result;
}

