'use client'

import React, { useRef, useState } from 'react';
import styles from "../page.module.css";
import { button_loggig_color } from "../../../generic_functions/button_loggig";

export default function Startpage() {
  const wert = 0;
  let testwert = 1;
  const buttonresulterfolg = "Das Aktualisieren der Reglungen war erfolgreich.";
  const buttonresultfehler = "Das Aktualisieren der Reglungen war nicht erfolgreich.<br />Versuchen sie es zu einem späteren Zeitpunkt erneut!";
  const buttonresultwarten = "Das Aktualisieren der Reglungen wird durchgeführt.<br />Bitte warten sie einen Moment.";
  const buttonresultabruch = "Das Aktualisieren der Reglungen wurde abgebrochen.";

  const currentYear = new Date().getFullYear(); // Aktuelles Jahr
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i); // Generiert das aktuelle Jahr und die letzten 4 Jahre

  const [showPopup, setShowPopup] = useState(false);
  const [buttonresult, setButtonresult] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString()); // Standardmäßig aktuelles Jahr
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Zustand für die Fehlermeldung

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setButtonresult(buttonresultabruch);
    setSelectedYear(currentYear.toString()); // Setzt das Jahr auf das aktuelle Jahr zurück
    setUploadedFile(null); // Entfernt die hochgeladene Datei
    setErrorMessage(""); // Fehlermeldung zurücksetzen

  };

  const handleConfirm = () => {

    if (!uploadedFile || !uploadedFile.name.endsWith('.csv')) {
      setErrorMessage("Bitte laden Sie eine CSV-Datei hoch.");
      return;
      
    }
    else {
    
    setShowPopup(false);
    setButtonresult(buttonresultwarten);
    // Hier kannst du die Logik für die Bestätigung hinzufügen
    //Bitte den Methodenaufruf zur Regelaktualisierung hier einfügen
    
    
    // Hier bitte die Methode einfügen, die den Wert zurückgibt, ob die Regelung erfolgreich aktualisiert wurde
    //bzw. die auch die Regelungsktualisierung durchführt 
    //1 für positive (erfolgreiches aktualisieren) und 0 für negative (fehlgeschlagene aktualisierung) rückmeldung

    if (testwert === 1) {
      setButtonresult(buttonresulterfolg);
    } else {
      setButtonresult(buttonresultfehler);
    }
    setSelectedYear(currentYear.toString()); // Setzt das Jahr auf das aktuelle Jahr zurück
    setUploadedFile(null); // Entfernt die hochgeladene Datei
    setErrorMessage(""); // Fehlermeldung zurücksetzen
  }

  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setUploadedFile(event.dataTransfer.files[0]);
    }
  };

  const handleClickOnDragDropArea = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Öffnet die Datei-Auswahl
    }
  };

  return (
    <div>
      <div>
        <div><h1>Startseite</h1></div>
        <p>Nur hier um zu existieren</p>
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

            {/* Drag-and-Drop-Bereich */}
            <div
              className={`${styles.dragDropArea} ${dragging ? styles.dragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickOnDragDropArea} // Klick-Handler hinzugefügt
            >
              <div className={styles.uploadIconContainer}>
                <img
                  src="\file-upload.svg"
                  alt="Upload Icon"
                  className={styles.uploadIcon}
                />
              </div>
              {uploadedFile ? (
                <p>Hochgeladene Datei: {uploadedFile.name} <br/>Wenn Sie eine falsche datei hochgeladen haben, laden Sie eine neue Datei hoch. 
                Die neue Datei ersätzt die alte Datei.</p>
              ) : (
                <div className={styles.uploadIconContainer}>
                    <p>Ziehen Sie die CSV-Datei mit den Regelungen in das Feld oder klicken Sie auf das Feld und wählen Sie eine CSV-Datei aus. <br/>
                      Es ist nur eine CSV-Datei gleichzeitig möglich. </p>
                </div>
              )}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className={styles.fileInput}
                ref={fileInputRef} // Referenz für das Input-Feld
              />
            </div>
            
            {/* Dropdown für die Jahre */}
            <div className={styles.yearSelect}>
              <label htmlFor="year">Jahr der Regelungen:</label>
              <select id="year" value={selectedYear} onChange={handleYearChange}>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <button className={styles.button3} onClick={handleClosePopup}>Abbrechen</button>
            <button className={styles.button4} onClick={handleConfirm}>Bestätigen</button>
          </div>
        </div>
      )}
    </div>
  );
}