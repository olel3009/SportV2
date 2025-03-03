"use client";

import React from 'react';
import styles from '../page.module.css'; // Importiere die CSS-Module von der Ebene darüber

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <ul>
          <li><a id="link_leistungen_ergebnisse_athlet_diziplin" href="#leistungen_ergebnisse_athlet_diziplin">Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</a></li>
          <li><a id="link_detailansicht_athleten" href="#detailansicht_athleten">Detailansicht eines Athleten</a></li>
          <li><a id="link_eintragsmodus_leistungen" href="#eintragsmodus_leistungen">Eintragsmodus für Leistungswerte</a></li>
          <li><a id="link_erstellen_aendern_von_reglungen" href="#erstellen_aendern_von_reglungen">Erstellen oder Ändern von Reglungen</a></li>
          <li><a id="link_export_eines_athleten" href="#export_eines_athleten">Export eines Athleten</a></li>
          <li><a id="link_export_eines_athleten_pdf" href="#export_eines_athleten_pdf">Export eines Athleten und seiner Daten als PDF</a></li>
          <li><a id="link_export_mehrer_athlethen" href="#export_mehrer_athlethen">Export mehrerer Athleten als CSV</a></li>
          <li><a id="link_liste_athlethen" href="#liste_athlethen">Liste aller Athleten</a></li>
          <li><a id="link_knopf_reglungsaktualisierung" href="#knopf_reglungsaktualisierung">Manuelle Aktualisierung der Reglungen durch Knopfdruck</a></li>
          <li><a id="link_medaillen_ansicht" href="#medaillen_ansicht">Medaillen Ansicht</a></li>
          <li><a id="link_regelungsverwaltung" href="#regelungsverwaltung">Regelungsverwaltung</a></li>
          <li><a id="link_visuelle_darstellung_entwicklung" href="#visuelle_darstellung_entwicklung">Visuelle Darstellung der Entwicklung eines Athleten</a></li>
        </ul>
      </nav>
      <div className={styles.content2}>
        <h1>Wiki-Seite</h1>
        <div id="leistungen_ergebnisse_athlet_diziplin" className={styles.section}>
          <h2>Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="detailansicht_athleten" className={styles.section}>
          <h2>Detailansicht eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="eintragsmodus_leistungen" className={styles.section}>
          <h2>Eintragsmodus für Leistungswerte</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="erstellen_aendern_von_reglungen" className={styles.section}>
          <h2>Erstellen oder Ändern von Reglungen</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_eines_athleten" className={styles.section}>
          <h2>Export eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_eines_athleten_pdf" className={styles.section}>
          <h2>Export eines Athleten und seiner Daten als PDF</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_mehrer_athlethen" className={styles.section}>
          <h2>Export mehrerer Athleten als CSV</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="liste_athlethen" className={styles.section}>
          <h2>Liste aller Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="knopf_reglungsaktualisierung" className={styles.section}>
          <h2>Manuelle Aktualisierung der Reglungen durch Knopfdruck</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="medaillen_ansicht" className={styles.section}>
          <h2>Medaillen Ansicht</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="regelungsverwaltung" className={styles.section}>
          <h2>Regelungsverwaltung</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="visuelle_darstellung_entwicklung" className={styles.section}>
          <h2>Visuelle Darstellung der Entwicklung eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
      </div>
    </div>
  );
}