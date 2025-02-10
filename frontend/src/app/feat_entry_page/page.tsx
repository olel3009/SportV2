"use client";
import { Athlete } from "../../models/athlete";
import { getAllAthletes, addFeatToAthlete } from "../../../generic_functions/athlete_getters";

function AthleteSelect() {
  const athletes: Athlete[] = getAllAthletes();
  let options = athletes.map((athlete, index) => {
    return (
      <option value={athlete.id} key={index}>
        {athlete.firstName} {athlete.lastName}
      </option>
    );
  });
  return <select name="athlete" id="athlete">{options}</select>;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
  const year = String(date.getFullYear());
  return `${day}.${month}.${year}`;
}

export default function Home() {
  const today = new Date();
  const formatted = formatDate(today);

  const submit = () => {
    // Safely cast each element to its correct type
    const uebungSelect   = document.getElementById("uebung")   as HTMLSelectElement | null;
    const athleteSelect  = document.getElementById("athlete")  as HTMLSelectElement | null;
    const datumInput     = document.getElementById("datum")    as HTMLInputElement  | null;
    const ergebnisInput  = document.getElementById("ergebnis") as HTMLInputElement  | null;

    if (!uebungSelect || !athleteSelect || !datumInput || !ergebnisInput) {
      console.error("Some elements were not found in the DOM.");
      return;
    }

    // Use .value instead of getAttribute("value")
    let ueb = uebungSelect.value;
    let ath = athleteSelect.value;
    let dat = datumInput.value;
    let erg = ergebnisInput.value;

    console.log("Uebung:", ueb, "Athlet:", ath, "Datum:", dat, "Ergebnis:", erg);

    // If you need to store the result, you might do:
    // addFeatToAthlete( /* your parameters here */ );
  };

  return (
    <div>
      <h1>Leistungseintragung</h1>
      <div>
        <select name="uebung" id="uebung">
          <option value="50mLauf">50-Meter Lauf</option>
          <option value="Hochsprung">Hochsprung</option>
          <option value="Weitsprung">Weitsprung</option>
          <option value="Kugelstossen">Kugelstossen</option>
        </select>
        <AthleteSelect />
        <input
          name="datum"
          id="datum"
          placeholder="Datum des Ergebnis"
          defaultValue={formatted}
        />
        <input id="ergebnis" placeholder="Ergebnis" />
        <br />
        <button id="submit" onClick={submit}>Eintragen</button>
      </div>
    </div>
  );
}
