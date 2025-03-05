import React from "react";
import styles from "../page.module.css";
import { button_loggig_color, getButtonResult } from "../../../generic_functions/button_loggig";

export default function Home() {
  const wert= 0;
  let buttonresult="";
  let buttonresulterfolg="Das Aktualisieren der Reglung war erfolgreich";
  let buttonresultfehler="Das Aktualisieren der Reglung war nicht erfolgreich";
  return (
    <div>
      <h1>Testseite</h1>
      <p>Nur hier um zu existieren</p>
      <div>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      </div>

      {button_loggig_color() == wert ? (
        <div>
          <button className={styles.button}>Reglungsaktualisierung</button>

            <p>{buttonresult}</p>
        </div>
      ) : (

        <div>
          <button className={styles.button2}>Reglungsaktualisierung</button>

          <p>{buttonresult}</p>
        </div>
      )}
    </div>
  );
}


