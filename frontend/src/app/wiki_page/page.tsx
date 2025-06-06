"use client";

import { validateAndGetToken } from "@/auth";
import React, { useEffect, useState } from "react";

export default function Home() {

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    setTokenValid(validateAndGetToken());
  }, []);

  if (tokenValid === null) {
    // Noch nicht geprüft, z.B. Ladeanzeige oder leer
    return null;
  }
  if (!tokenValid) {
    // Token ist ungültig, validateAndGetToken leitet bereits weiter
    return null;
  }
  return (
    <div className="flex h-screen">
      {/* Inhaltsverzeichnis Sidebar */}
      <div className="w-64 bg-white border-r border-gray-300 p-4 fixed h-full">
        <h2 className="text-lg font-bold mb-4">Inhaltsverzeichnis</h2>
        <ul className="space-y-2">
          <li>
            <a
              id="link_leistungen_ergebnisse_athlet_diziplin"
              href="#leistungen_ergebnisse_athlet_diziplin"
              className="text-black hover:text-gray-600"
            >
              01. Dashboard
            </a>
          </li>
          <li>
            <a
              id="link_detailansicht_athleten"
              href="#detailansicht_athleten"
              className="text-black hover:text-gray-600"
            >
              02. Detailansicht eines Athleten
            </a>
          </li>
          <li>
            <a
              id="link_eintragsmodus_leistungen"
              href="#eintragsmodus_leistungen"
              className="text-black hover:text-gray-600"
            >
              03. Eintragsmodus für Leistungswerte
            </a>
          </li>
          <li>
            <a
              id="link_export_eines_athleten"
              href="#export_eines_athleten"
              className="text-black hover:text-gray-600"
            >
              04. Export eines Athleten
            </a>
          </li>
          <li>
            <a
              id="link_export_eines_athleten_pdf"
              href="#export_eines_athleten_pdf"
              className="text-black hover:text-gray-600"
            >
              05. Export eines Athleten und seiner Daten als PDF
            </a>
          </li>
          <li>
            <a
              id="link_export_mehrer_athlethen"
              href="#export_mehrer_athlethen"
              className="text-black hover:text-gray-600"
            >
              06. Export mehrerer Athleten als CSV
            </a>
          </li>
          <li>
            <a
              id="link_liste_athlethen"
              href="#liste_athlethen"
              className="text-black hover:text-gray-600"
            >
              07. Liste aller Athleten
            </a>
          </li>
          <li>
            <a
              id="link_knopf_reglungsaktualisierung"
              href="#knopf_reglungsaktualisierung"
              className="text-black hover:text-gray-600"
            >
              08. Manuelle Aktualisierung der Regelungen durch Knopfdruck
            </a>
          </li>
          <li>
            <a
              id="link_erstellung_athleten"
              href="#erstellung_athleten"
              className="text-black hover:text-gray-600"
            >
              09. Erstellung eines Athleten
            </a>
          </li>
        </ul>
      </div>

      {/* Hauptinhalt */}
      <div className="flex-1 p-6 overflow-y-auto ml-64">
        <h1 className="text-2xl font-bold mb-6">Wiki-Seite</h1>
        <div id="leistungen_ergebnisse_athlet_diziplin" className="mb-8">
          <h2 className="text-xl font-semibold">01. Dashboard</h2>
          <p>Im Dashboard werden zwei Tabellen angezeigt</p>
          <p>Die linke Tabelle zeigt die anstehenden Geburtstage der Athleten innerhalb den nächsten 7 Tagen</p>
          <p>Die rechte Tabelle zeigt die besten Athleten sortiert nach Medaillenanzahl an</p>
          <p>Es exisitert auch der Knopf zum aktualisieren der Regelungen. Weitere Details im Kapitel "08. Manuelle Aktualisierung der Regelungen durch Knopfdruck"</p>
        </div>
        <div id="detailansicht_athleten" className="mb-8">
          <h2 className="text-xl font-semibold">02. Detailansicht eines Athleten</h2>
          <p>Die Detailansicht eines Athleten zeigt:</p>
          <p> 
            1. Ob ein Schwimmnachweis generell beim Athleten verfügbar ist. Sollte einer auch hochgeladen sein, kann man diesen auch durch das Klicken auf die angezeigte Datei herunterladen.<br />
               Das Hochladen des Schwimmnachweises erfolgt über den grünen Knopf "Schwimmnachweis Hochladen". Beim Betätigen des Knopfes öffnet sich ein Pop-Up.<br />
            2. Alle Leistungen des Athleten. Es werden alle Übungen, gefiltert nach den einelnen Disziplinen, in welcher der Athlet teilgenommen hat angezeigt.<br />
               Unter den Übungen kann ein Akkordion geöffnet werden, worunter dann die Leistungen welche in der Übung erzielt wurden angezeigt.<br />
            3. Im Akkordion wird zu dem auch eine visuelle Darstellung der Entwicklung des Athleten in dieser Übung angezeigt.<br />
            4. Über den grünen Knopf "CSV" können zwei CSVs für den Athleten erstellt und heruntergeladen werden. Die eine CSV beinhalten die Daten des Athleten und die Andere die Leistungen<br />
            5. Über den grünen Knopf "PDF" kann eine Prüfkarte erstellen und herunterladen. Diese Prüfkarte wird mit den besten Leistungen aus jeder Disziplin ausgefüllt.<br />
            6. Über den roten Knopf mit den Mülltonnen-Symbol können die Leistungen oder ganz der Athlet gelöscht werden. Beim Löschen des Athleten werden auch seine Leistungen gelöscht.<br />
          </p>
        </div>
        <div id="eintragsmodus_leistungen" className="mb-8">
          <h2 className="text-xl font-semibold">03. Eintragsmodus für Leistungswerte</h2>
          <p>Diese Seite kann sowohl über das Seitenmenü als auch über die Athletenübersicht erreicht werden</p>
          <p>Auf dieser Seite können einzelne Leistungen, anhand der zugehörigen Regelungen, für Athleten erstellt werden</p>
          <p>Für die eingabe einer CSV Datei für leistungen muss die Seite CSV-Eingabe im Seitenmenü genutzt werden</p>
        </div>
        <div id="export_eines_athleten" className="mb-8">
          <h2 className="text-xl font-semibold">04. Export eines Athleten</h2>
          <p>Sowohl unter der Athleten-Detailansicht als auch der Athletenübersicht können einzelne Athleten als CSV exportiert werden</p>
          <p>Hierbei werden zwei CSV Dateien heruntergeladen, eine für die Leistungen des Athleten, eine für den Athleten an sich</p>
          <p>Die CSV für Leistungen entspricht dem Format Name;Vorname;Geschlecht;Geburtsdatum;Übung;Kategorie;Datum;Ergebnis;Punkte</p>
          <p>Die CSV für den Athleten An sich entspricht dem Format Vorname;Nachname;Geburtsdatum;Geschlecht;E-Mail</p>
        </div>
        <div id="export_eines_athleten_pdf" className="mb-8">
          <h2 className="text-xl font-semibold">05. Export eines Athleten und seiner Daten als PDF</h2>
          <p>Sowohl unter der Athleten-Detailansicht als auch der Athletenübersicht können einzelne Athleten als PDF exportiert werden</p>
          <p>Diese PDF entspricht dem Format einer Einzelprüfkarte</p>
        </div>
        <div id="export_mehrer_athlethen" className="mb-8">
          <h2 className="text-xl font-semibold">06. Export mehrerer Athleten als CSV</h2>
          <p>Unter der Athletenübersicht können mehrere Athleten gleichzeitig als CSV oder PDF heruntergeladen werden</p>
          <p>Für den CSV Download entspricht das Format den Formaten des Einzel Downloads</p>
          <p>Für den PDF download entspricht das Format dem einer Gruppenprüfkarte</p>
        </div>
        <div id="liste_athlethen" className="mb-8">
          <h2 className="text-xl font-semibold">07. Liste aller Athleten</h2>
          <p>Hier werden alle Athleten aufgelistet mit den ihren Vor- und Nachnamen, Geburtsdatum, Geschlecht und alle erworbenen Medaillen.</p>
          <p>Dabei kann bei den Vor- und Nachnamen, Geburtsdatum und Medaillen diese auf- und absteigend sortieren</p>
        </div>
        <div id="knopf_reglungsaktualisierung" className="mb-8">
          <h2 className="text-xl font-semibold">08. Manuelle Aktualisierung der Regelungen durch Knopfdruck</h2>
          <p>Der Knopf zur Aktualisierung der Regelungen befindet sich unten auf der Startseite und trägt die Aufschrift "Regelungen aktualisieren".<br />
            Dieser Knopf sorgt dafür, dass nach einer Bestätigung die aktuellen Regelungen geladen werden.<br /><br />
          </p>

          <h4 className="text-lg font-semibold">Farbliche Bedeutung des Knopfes:</h4>
          <p>
            - Rot: Die Regelungen wurden in diesem Jahr noch nicht aktualisiert und die ersten vier Wochen des Jahres sind noch nicht vorbei.<br />
            - Grün: Die Regelungen wurden bereits aktualisiert oder die ersten vier Wochen des Jahres sind vorbei.<br /><br />
          </p>
          <h4 className="text-lg font-semibold">Schritt-für-Schritt-Anleitung:</h4>
          <p>
            1. Um die Regelungen zu aktualisieren, klicken Sie auf den Knopf "Regelungen aktualisieren".<br />
            2. Warten Sie, bis sich ein Popup öffnet.<br />
            3. Laden Sie anschließend die CSV mit den Regelungen im Standart-Design hoch.<br />
            (Sie können eine Beispiel CSV durch das drücken auf den Knopf mit der Aufschrift "Beispiel CSV" herunterladen.)<br />
            4. Bestätigen Sie den Vorgang mit "Bestätigen" (grün hinterlegter Knopf) oder brechen Sie den Vorgang mit "Abbrechen" (rot hinterlegter Knopf) ab.<br />
            5. Warten Sie, bis der Vorgang abgeschlossen ist. Den Status des Vorgangs können Sie am Text unter dem "Regelungen aktualisieren"-Knopf erkennen.<br />
            6. Überprüfen Sie, ob der Vorgang erfolgreich war oder nicht. Dies können Sie ebenfalls am Text unter dem "Regelungen aktualisieren"-Knopf erkennen.<br />
            7. Falls der Vorgang nicht erfolgreich war und keine zusätzliche Fehlermeldung kommt,  versuchen Sie es zu einem späteren Zeitpunkt erneut. <br />
            8. Falls eine Fehlermeldung kommt ist ein Fahler in ihrer Datei dort angegeben, die Sie beheben müssen und können danach erneut Versuchen<br />
          </p>

          <h4 className="text-lg font-semibold">Rückmeldungen vom Aktualisierungsprozess:</h4>
          <p>
            - Falsches Dateiformat/keine Datei hochgeladen: Bitte laden Sie eine CSV-Datei hoch.<br />
            - Das Aktualisieren der Regelungen war erfolgreich: Die Regelungen wurden erfolgreich aktualisiert.<br />
            - Das Aktualisieren der Regelungen war nicht erfolgreich: Die Regelungen konnten nicht aktualisiert werden.<br />
            - Das Aktualisieren der Regelungen wird durchgeführt: Die Regelungen werden gerade aktualisiert.<br />
            - Das Aktualisieren der Regelungen wurde abgebrochen: Die Regelungen wurden nicht aktualisiert, da Sie den Prozess abgebrochen haben.<br /><br />
          </p>

          <h4 className="text-lg font-semibold">Wichtige Hinweise:</h4>
          <p>
            - Es können nur Regelungen aus der CSV gelesen werden, wenn diese dem Standard-Design entsprechen. Dies kann über Knopfdruck heruntergeladen werden.<br />
            - Der Prozess kann nach der Bestätigung nicht abgebrochen werden.<br />
            - Sollte das Aktualisieren der Regelungen nicht erfolgreich sein, versuchen Sie es nicht direkt erneut, sondern warten Sie ein paar Minuten.<br />
            Dies kann dem Server helfen, falls das Fehlschlagen des Vorgangs an einer zu hohen Auslastung liegt oder die Daten aus einer anderen Ursache nicht abrufbar sind.<br />
            - Sollte der Prozess öfter fehlschlagen, wenden Sie sich an den Administrator.<br />
            - Wenn sich das Popup nicht öffnet, kontrollieren Sie Ihre Internetverbindung und versuchen Sie es nach kurzem Warten erneut.<br />
          </p>
        </div>
        <div id="erstellung_athleten" className="mb-8">
          <h2 className="text-xl font-semibold">09. Erstellung eines Athleten</h2>
          <p>Unter dem Menüpunkt Athletenerstellung können neue Athleten eingegeben werden.</p>
          <p>Hierzu müssen die Felder nur wie in den Feldern angegeben befüllt und die Eingabe mit dem unten stehenden Knopf bestätigt werden</p>
          <p>Eine Hinterlegung des Schwimmnachweises ist an dieser Stelle noch nicht möglich und muss später unter der Detailansicht durchgeführt werden.</p>
        </div>
      </div>
    </div>
  );
}