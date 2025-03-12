'use client'

import React, { useState } from 'react';
import styles from "../page.module.css";
import { button_loggig_color, getButtonResult } from "../../../generic_functions/button_loggig";

export default function Startpage() {
  const wert = 0;
  let testwert = 1;
  const buttonresulterfolg = "Das Aktualisieren der Reglungen war erfolgreich.";
  const buttonresultfehler = "Das Aktualisieren der Reglungen war nicht erfolgreich.<br />Versuchen sie es zu einem späteren Zeitpunkt erneut!";
  const buttonresultwarten = "Das Aktualisieren der Reglungen wird durchgeführt.<br />Bitte warten sie einen Moment.";
  const buttonresultabruch = "Das Aktualisieren der Reglungen wurde abgebrochen.";

  const [showPopup, setShowPopup] = useState(false);
  const [buttonresult, setButtonresult] = useState("");

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setButtonresult(buttonresultabruch);
  };

  const handleConfirm = () => {
    setShowPopup(false);
    // Hier kannst du die Logik für die Bestätigung hinzufügen
    //Bitte den Methodenaufruf zur Regelaktualisierung hier einfügen
    setButtonresult(buttonresultwarten);
    // Hier bitte die Methode einfügen, die den Wert zurückgibt, ob die Regelung erfolgreich aktualisiert wurde
    if (testwert === 1) {
      setButtonresult(buttonresulterfolg);
    } else {
      setButtonresult(buttonresultfehler);
    }
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
      {button_loggig_color() === wert ? (
        <div>
          <button className={styles.button} onClick={handleButtonClick}>Regelungen aktualisieren</button>
          <p dangerouslySetInnerHTML={{ __html: buttonresult }}></p>
        </div>
      ) : (
        <div>
          <button className={styles.button2} onClick={handleButtonClick}>Regelungen aktualisieren</button>
          <p dangerouslySetInnerHTML={{ __html: buttonresult }}></p>
        </div>
      )}

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>Regelungen aktualisieren</h2>
            <h3>Wollen sie wirklich die Regelungen aktualisieren?</h3>
            <button className={styles.button3} onClick={handleClosePopup}>Nein</button>
            <button className={styles.button4} onClick={handleConfirm}>Ja</button>
          </div>
        </div>
      )}
    </div>
  );
}