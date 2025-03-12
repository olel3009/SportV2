"use client";

import React from 'react';
import styles from '../page.module.css'; // Importiere die CSS-Module von der Ebene darüber

export default function Home() {
  return (


    <div>
      <nav className={styles.sidebar}>
        <h2>Inhaltsverzeichnis</h2>
        <ul>
          <li><a id="link_leistungen_ergebnisse_athlet_diziplin" href="#leistungen_ergebnisse_athlet_diziplin">01. Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</a></li>
          <li><a id="link_detailansicht_athleten" href="#detailansicht_athleten">02. Detailansicht eines Athleten</a></li>
          <li><a id="link_eintragsmodus_leistungen" href="#eintragsmodus_leistungen">03. Eintragsmodus für Leistungswerte</a></li>
          <li><a id="link_erstellen_aendern_von_reglungen" href="#erstellen_aendern_von_reglungen">04. Erstellen oder Ändern von Reglungen</a></li>
          <li><a id="link_export_eines_athleten" href="#export_eines_athleten">05. Export eines Athleten</a></li>
          <li><a id="link_export_eines_athleten_pdf" href="#export_eines_athleten_pdf">06. Export eines Athleten und seiner Daten als PDF</a></li>
          <li><a id="link_export_mehrer_athlethen" href="#export_mehrer_athlethen">07. Export mehrerer Athleten als CSV</a></li>
          <li><a id="link_liste_athlethen" href="#liste_athlethen">08. Liste aller Athleten</a></li>
          <li><a id="link_knopf_reglungsaktualisierung" href="#knopf_reglungsaktualisierung">09. Manuelle Aktualisierung der Reglungen durch Knopfdruck</a></li>
          <li><a id="link_medaillen_ansicht" href="#medaillen_ansicht">10. Medaillen Ansicht</a></li>
          <li><a id="link_regelungsverwaltung" href="#regelungsverwaltung">11. Regelungsverwaltung</a></li>
          <li><a id="link_visuelle_darstellung_entwicklung" href="#visuelle_darstellung_entwicklung">12. Visuelle Darstellung der Entwicklung eines Athleten</a></li>
        </ul>
      </nav>
      <div className={styles.container}>

        <div className={styles.content2}>
          <h1>Wiki-Seite</h1>
          <div id="leistungen_ergebnisse_athlet_diziplin" className={styles.section}>
            <h2>01. Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="detailansicht_athleten" className={styles.section}>
            <h2>02. Detailansicht eines Athleten</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="eintragsmodus_leistungen" className={styles.section}>
            <h2>03. Eintragsmodus für Leistungswerte</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="erstellen_aendern_von_reglungen" className={styles.section}>
            <h2>04. Erstellen oder Ändern von Reglungen</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="export_eines_athleten" className={styles.section}>
            <h2>05. Export eines Athleten</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="export_eines_athleten_pdf" className={styles.section}>
            <h2>06. Export eines Athleten und seiner Daten als PDF</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="export_mehrer_athlethen" className={styles.section}>
            <h2>07. Export mehrerer Athleten als CSV</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="liste_athlethen" className={styles.section}>
            <h2>08. Liste aller Athleten</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="knopf_reglungsaktualisierung" className={styles.section}>
            <h2>09. Manuelle Aktualisierung der Regelungen durch Knopfdruck</h2>
            <p>Der Knopf zur Aktualisierung der Regelungen ist unten auf der Startseite zu finden. Dieser trägt die Aufschrift "Regelungen aktualisieren". 
              Dieser Knopf sorgt dafür das nach einer Bestätigung, dass akuelle Regelungen geladen werden.<br />
              
              <h4>Farbliche Bedeutung des Knopfes</h4>
              - Rot: Regelungen wurden dieses Jahr noch nicht aktualisiert und die ersten vier Wochen des Jahres sind noch nicht vorbei.<br />
              - Weiß: Regelungen wurden schon aktualisiert oder die ersten vier Wochen des Jahres sind vorbei.<br />
              
              <h4>Schritt für Schritt Anleitung</h4>
              1. Zum Aktualisieren der Regelungen, klicken Sie auf den Knopf "Regelungen aktualisieren".<br />
              2. Warten Sie bis sich ein Popup öffnet.<br />
              3. Bestätigen Sie den Vorgang mit "Ja" (Grün hinterlegter Knopf) oder brechen Sie den Vorgang mit "Nein" (Rot hinterlegter Knopf) ab.<br />
              4. Warten Sie bis der Vorgang abgeschlossen ist. Denn Status vom Vorgang können sie am Text unter dem "Reglungen aktualisieren" Knopf erkennen.<br />
              5. Überprüfen Sie ob der Vorgang erfolgreich war oder nicht. Dies können sie am Text unter dem "Reglungen aktualisieren" Knopf erkennen.<br />
              6. Wenn der Vorgang nicht erfolgreich war, versuchen Sie es zu einem späteren Zeitpunkt erneut.<br />
              
              <h4>Rückmeldung vom Aktualisierungsprozess</h4>
              - Das Aktualisieren der Reglungen war erfolgreich: Die Regelungen wurden erfolgreich aktualisiert.<br />
              - Das Aktualisieren der Reglungen war nicht erfolgreich: Die Regelungen konnten nicht aktualisiert werden.<br />
              - Das Aktualisieren der Reglungen wird durchgeführt: Die Regelungen werden gerade aktualisiert.<br />
              - Das Aktualisieren der Reglungen wurde abgebrochen: Die Regelungen wurden nicht aktualisiert, da sie den Prozess abgebrochen haben.<br />

              <h4>Wichtige Hinweise</h4>
              - Der Prozess kann nach der Bestätigung nicht abgebrochen werden.<br />
              - Sollte dqs Aktualisieren der Regelungen nicht erfolgreich sein, versuchen Sie es nicht direkt nochmal sondern warten sie ein paar Minuten.
              Dies kann dem Server helfe, wenn die fehlschläge an einer zu hohen auslastung liegt oder die Daten im moment durch andere Ursachen nicht abrufbar sind.<br />
              - Sollte der Prozess öfter fehlschlagen, wenden Sie sich an den Administrator.<br />
              - Wenn sich das Popup nicht öffnet, kontrollieren sie ihre Internetverbindung und versuchen sie es nach kurzem warten erneut.<br />

            </p>


          </div>
          <div id="medaillen_ansicht" className={styles.section}>
            <h2>10. Medaillen Ansicht</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="regelungsverwaltung" className={styles.section}>
            <h2>11. Regelungsverwaltung</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
          <div id="visuelle_darstellung_entwicklung" className={styles.section}>
            <h2>12. Visuelle Darstellung der Entwicklung eines Athleten</h2>
            <p>Hier könnte die Beschreibung stehen</p>
          </div>
        </div>
      </div>
    </div>
  );
}