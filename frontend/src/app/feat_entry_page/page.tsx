"use client"
import {Athlete} from "../../models/athlete"
import {getAllAthletes, addFeatToAthlete} from "../../../generic_functions/athlete_getters"


function AthleteSelect(){
  const athletes: Athlete[] = getAllAthletes();
  let options = athletes.map((athlete, index) => {
    return <option value={athlete.id} key={index}>{athlete.firstName} {athlete.lastName}</option>
  });
  let selectDiv = <select name="athlete" id="athlete">{options}</select>
  return selectDiv;
}

export default function Home() {
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
            <input name = "datum" id= "datum" placeholder="Datum des Ergebnis"></input>
            <input id="ergebnis" placeholder="Ergebnis"></input>
            <br />
            <button id="submit">Eintragen</button>
          </div>
    </div>
  );
}