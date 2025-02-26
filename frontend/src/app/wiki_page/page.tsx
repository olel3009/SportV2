"use client";

import React from 'react';
import styles from '../page.module.css'; // Importiere die CSS-Module von der Ebene darüber

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <ul>
          <li><a href="#leistungen_ergebnisse_athlet_diziplin">Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</a></li>
          <li><a href="#detailansicht_athleten">Detailansicht eines Athleten</a></li>
          <li><a href="#eintragsmodus_leistungen">Eintragsmodus für Leistungswerte</a></li>
          <li><a href="#erstellen_ändern_von_reglungen">Erstellen oder Ändern von Reglungen</a></li>
          <li><a href="#export_eines_athleten">Export eines Athleten</a></li>
          <li><a href="#export_mehrer_athlethen">Export mehrerer Athleten als CSV</a></li>
          <li><a href="#liste_athlethen">Liste aller Athleten</a></li>
          <li><a href="#knopf_reglungsaktualisierung">Manuelle Aktualisierung der Reglungen durch Knopfdruck</a></li>
          <li><a href="#medaillen_ansicht">Medaillen Ansicht</a></li>
          <li><a href="#regelungsverwaltung">Regelungsverwaltung</a></li>
          <li><a href="#visuelle_darstellung_entwicklung">Visuelle Darstellung der Entwicklung eines Athleten</a></li>
        </ul>
      </nav>
      <div className={styles.content}>
        <h1>Wiki-Seite</h1>
        <div id="leistungen_ergebnisse_athlet_diziplin">
          <h2>Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="detailansicht_athleten">
          <h2>Detailansicht eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="eintragsmodus_leistungen">
          <h2>Eintragsmodus für Leistungswerte</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="erstellen_ändern_von_reglungen">
          <h2>Erstellen oder Ändern von Reglungen</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_eines_athleten">
          <h2>Export eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_mehrer_athlethen">
          <h2>Export mehrerer Athleten als CSV</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="liste_athlethen">
          <h2>Liste aller Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="knopf_reglungsaktualisierung">
          <h2>Manuelle Aktualisierung der Reglungen durch Knopfdruck</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="medaillen_ansicht">
          <h2>Medaillen Ansicht</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="regelungsverwaltung">
          <h2>Regelungsverwaltung</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="visuelle_darstellung_entwicklung">
          <h2>Visuelle Darstellung der Entwicklung eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
      </div>
    </div>
  );
}