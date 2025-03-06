'use client'

import React, { useState } from 'react';
import styles from "../page.module.css";
import { button_loggig_color, getButtonResult } from "../../../generic_functions/button_loggig";

export default function Startpage() {
  const wert = 0;
  let buttonresult = "";
  let buttonresulterfolg = "Das Aktualisieren der Reglung war erfolgreich";
  let buttonresultfehler = "Das Aktualisieren der Reglung war nicht erfolgreich";

  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleConfirm = () => {
    // Hier kannst du die Logik für die Bestätigung hinzufügen
    setShowPopup(false);
    //alert("Bestätigt!");
  };

  return (
    <div>
      <div>
        <div><h1>Testseite</h1></div>
        <p>Nur hier um zu existieren</p>
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
          <button className={styles.button} onClick={handleButtonClick}>Reglungsaktualisierung</button>
          <p>{buttonresult}</p>
        </div>
      ) : (
        <div>
          <button className={styles.button2} onClick={handleButtonClick}>Reglungsaktualisierung</button>
          <p>{buttonresult}</p>
        </div>
      )}

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>Regelaktualisierung</h2>
            <h3>Wollen sie wirklich die Regelungen aktualisieren?</h3>
            <button className={styles.button3} onClick={handleClosePopup}>Nein</button>
            <button className={styles.button4} onClick={handleConfirm}>Ja</button>
          </div>
        </div>
      )}
    </div>
  );
}