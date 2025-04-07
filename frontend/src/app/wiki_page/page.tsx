"use client";

import React from "react";
import styles from "../page.module.css"; // Importiere die CSS-Module von der Ebene darüber

export default function Home() {
  return (
    <div className="flex h-full">
      {/* Inhaltsverzeichnis Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 p-4">
        <h2 className="text-lg font-bold mb-4">Inhaltsverzeichnis</h2>
        <ul className="space-y-2">
          <li>
            <a
              id="link_leistungen_ergebnisse_athlet_diziplin"
              href="#leistungen_ergebnisse_athlet_diziplin"
              className="text-blue-600 hover:underline"
            >
              01. Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin
            </a>
          </li>
          <li>
            <a
              id="link_detailansicht_athleten"
              href="#detailansicht_athleten"
              className="text-blue-600 hover:underline"
            >
              02. Detailansicht eines Athleten
            </a>
          </li>
          <li>
            <a
              id="link_eintragsmodus_leistungen"
              href="#eintragsmodus_leistungen"
              className="text-blue-600 hover:underline"
            >
              03. Eintragsmodus für Leistungswerte
            </a>
          </li>
          <li>
            <a
              id="link_erstellen_aendern_von_reglungen"
              href="#erstellen_aendern_von_reglungen"
              className="text-blue-600 hover:underline"
            >
              04. Erstellen oder Ändern von Reglungen
            </a>
          </li>
          <li>
            <a
              id="link_export_eines_athleten"
              href="#export_eines_athleten"
              className="text-blue-600 hover:underline"
            >
              05. Export eines Athleten
            </a>
          </li>
          <li>
            <a
              id="link_export_eines_athleten_pdf"
              href="#export_eines_athleten_pdf"
              className="text-blue-600 hover:underline"
            >
              06. Export eines Athleten und seiner Daten als PDF
            </a>
          </li>
          <li>
            <a
              id="link_export_mehrer_athlethen"
              href="#export_mehrer_athlethen"
              className="text-blue-600 hover:underline"
            >
              07. Export mehrerer Athleten als CSV
            </a>
          </li>
          <li>
            <a
              id="link_liste_athlethen"
              href="#liste_athlethen"
              className="text-blue-600 hover:underline"
            >
              08. Liste aller Athleten
            </a>
          </li>
          <li>
            <a
              id="link_knopf_reglungsaktualisierung"
              href="#knopf_reglungsaktualisierung"
              className="text-blue-600 hover:underline"
            >
              09. Manuelle Aktualisierung der Reglungen durch Knopfdruck
            </a>
          </li>
          <li>
            <a
              id="link_medaillen_ansicht"
              href="#medaillen_ansicht"
              className="text-blue-600 hover:underline"
            >
              10. Medaillen Ansicht
            </a>
          </li>
          <li>
            <a
              id="link_regelungsverwaltung"
              href="#regelungsverwaltung"
              className="text-blue-600 hover:underline"
            >
              11. Regelungsverwaltung
            </a>
          </li>
          <li>
            <a
              id="link_visuelle_darstellung_entwicklung"
              href="#visuelle_darstellung_entwicklung"
              className="text-blue-600 hover:underline"
            >
              12. Visuelle Darstellung der Entwicklung eines Athleten
            </a>
          </li>
        </ul>
      </div>

      {/* Hauptinhalt */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Wiki-Seite</h1>
        <div id="leistungen_ergebnisse_athlet_diziplin" className="mb-8">
          <h2 className="text-xl font-semibold">01. Ansicht von Leistungen und Ergebnissen pro Athlet und Disziplin</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="detailansicht_athleten" className="mb-8">
          <h2 className="text-xl font-semibold">02. Detailansicht eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="eintragsmodus_leistungen" className="mb-8">
          <h2 className="text-xl font-semibold">03. Eintragsmodus für Leistungswerte</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="erstellen_aendern_von_reglungen" className="mb-8">
          <h2 className="text-xl font-semibold">04. Erstellen oder Ändern von Reglungen</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_eines_athleten" className="mb-8">
          <h2 className="text-xl font-semibold">05. Export eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_eines_athleten_pdf" className="mb-8">
          <h2 className="text-xl font-semibold">06. Export eines Athleten und seiner Daten als PDF</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="export_mehrer_athlethen" className="mb-8">
          <h2 className="text-xl font-semibold">07. Export mehrerer Athleten als CSV</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="liste_athlethen" className="mb-8">
          <h2 className="text-xl font-semibold">08. Liste aller Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="knopf_reglungsaktualisierung" className="mb-8">
          <h2 className="text-xl font-semibold">09. Manuelle Aktualisierung der Reglungen durch Knopfdruck</h2>
          <p>Der Knopf zur Aktualisierung der Regelungen befindet sich unten auf der Startseite und trägt die Aufschrift "Regelungen aktualisieren".
              Dieser Knopf sorgt dafür, dass nach einer Bestätigung die aktuellen Regelungen geladen werden.<br />
            </p>

            <h4>Farbliche Bedeutung des Knopfes</h4>
            <p>
              - Rot: Die Regelungen wurden in diesem Jahr noch nicht aktualisiert und die ersten vier Wochen des Jahres sind noch nicht vorbei.<br />
              - Weiß: Die Regelungen wurden bereits aktualisiert oder die ersten vier Wochen des Jahres sind vorbei.<br />
            </p>
            <h4>Schritt-für-Schritt-Anleitung</h4>
            <p>
              1. Um die Regelungen zu aktualisieren, klicken Sie auf den Knopf "Regelungen aktualisieren".<br />
              2. Warten Sie, bis sich ein Popup öffnet.<br />
              3. Laden Sie anschließend die CSV mit den Regelungen im Standart-Design hoch.<br />
              4. Wählen Sie das Jahr aus.<br />
              5. Bestätigen Sie den Vorgang mit "Bestätigen" (grün hinterlegter Knopf) oder brechen Sie den Vorgang mit "Abbrechen" (rot hinterlegter Knopf) ab.<br />
              6. Warten Sie, bis der Vorgang abgeschlossen ist. Den Status des Vorgangs können Sie am Text unter dem "Regelungen aktualisieren"-Knopf erkennen.<br />
              7. Überprüfen Sie, ob der Vorgang erfolgreich war oder nicht. Dies können Sie ebenfalls am Text unter dem "Regelungen aktualisieren"-Knopf erkennen.<br />
              8. Falls der Vorgang nicht erfolgreich war, versuchen Sie es zu einem späteren Zeitpunkt erneut.<br />
            </p>

            <h4>Rückmeldungen vom Aktualisierungsprozess</h4>
            <p>
              - Falsches Dateiformat/keine Datei hochgeladen: Bitte laden Sie eine CSV-Datei hoch.<br />
              - Das Aktualisieren der Regelungen war erfolgreich: Die Regelungen wurden erfolgreich aktualisiert.<br />
              - Das Aktualisieren der Regelungen war nicht erfolgreich: Die Regelungen konnten nicht aktualisiert werden.<br />
              - Das Aktualisieren der Regelungen wird durchgeführt: Die Regelungen werden gerade aktualisiert.<br />
              - Das Aktualisieren der Regelungen wurde abgebrochen: Die Regelungen wurden nicht aktualisiert, da Sie den Prozess abgebrochen haben.<br/>
            </p>

            <h4>Wichtige Hinweise</h4>
            <p>
              - Es können nur Regelungen aus der CSV gelesen werden, wenn diese dem Standard-Design entsprechen.<br />
              - Der Prozess kann nach der Bestätigung nicht abgebrochen werden.<br />
              - Sollte das Aktualisieren der Regelungen nicht erfolgreich sein, versuchen Sie es nicht direkt erneut, sondern warten Sie ein paar Minuten.
              Dies kann dem Server helfen, falls das Fehlschlagen des Vorgangs an einer zu hohen Auslastung liegt oder die Daten aus einer anderen Ursache nicht abrufbar sind.<br />
              - Sollte der Prozess öfter fehlschlagen, wenden Sie sich an den Administrator.<br />
              - Wenn sich das Popup nicht öffnet, kontrollieren Sie Ihre Internetverbindung und versuchen Sie es nach kurzem Warten erneut.<br />
            </p>
        </div>
        <div id="medaillen_ansicht" className="mb-8">
          <h2 className="text-xl font-semibold">10. Medaillen Ansicht</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="regelungsverwaltung" className="mb-8">
          <h2 className="text-xl font-semibold">11. Regelungsverwaltung</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
        <div id="visuelle_darstellung_entwicklung" className="mb-8">
          <h2 className="text-xl font-semibold">12. Visuelle Darstellung der Entwicklung eines Athleten</h2>
          <p>Hier könnte die Beschreibung stehen</p>
        </div>
      </div>
    </div>
  );
}