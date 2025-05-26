"use client"
import { validateAndGetToken } from '@/auth';
import React, { useState, DragEvent, useEffect } from 'react';
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Startpage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle drag-and-drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle file submission to backend
  const handleSubmit = async () => {
    const token = validateAndGetToken();
    if (token === null || token === false) {
        // Token ist ungültig, validateAndGetToken leitet bereits weiter
    } else {

    if (!file) {
      alert('Bitte eine CSV-Datei auswählen!');
      return;
    }
    setUploading(true);
    let csvType = 0;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await file.text()
        .then(csvString => {
          // csvString is now the full contents of your CSV as a JavaScript string
          if (csvString.includes("Vorname;Nachname;Geburtsdatum;Geschlecht;Schwimmzertifikat")) {
            console.log("Person Csv");
            csvType=2;
          } else if (csvString.includes("Name;Vorname;Geschlecht;Geburtsdatum;Übung;Kategorie;Datum;Ergebnis;Punkte")) {
            console.log("Leistungs Csv");
            csvType = 1;
          } else {
            console.log("Not found.");
          }
        })
        .catch(err => console.error("Failed to read file:", err));


      let res: any;
      if (csvType == 1) {
        console.log("Working with this form Data:");
        console.log(formData);
        res = await fetch('http://127.0.0.1:5000/results/import', {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token")
          },
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          console.error('Import-Fehler:', data);
          alert(`Fehler beim Import: ${data.error || JSON.stringify(data)}`);
        } else {
          console.log('Import-Ergebnis:', data);
          alert(`Import erfolgreich! Erstellt: ${data.created.length}, Aktualisiert: ${data.updated.length}`);
          if (data.missing_athletes) {
            console.warn('Fehlende Athleten:', data.missing_athletes);
          }
          if (data.duplicate_athletes) {
            console.warn('Doppelte Athleten:', data.duplicate_athletes);
          }
        }
      } else if (csvType == 2) {
        console.log(formData);
        let csvText = await file.text();
        res = await fetch('http://127.0.0.1:5000/athletes/csv', {

          method: 'POST',
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
            'Content-Type': 'text/csv; charset=utf-8'
          },
          body: csvText,
        });
        const data = await res.json();
        if (!res.ok) {
          console.error('Import-Fehler:', data);
          alert(`Fehler beim Import: ${data.error || JSON.stringify(data)}`);
        } else {
          console.log('Import-Ergebnis:', data);
          alert(`Import erfolgreich! Erstellt`);

        }

      } else {
        alert("CSV Typ nicht erkannt!")
      }

    } catch (error) {
      console.error('Fetch-Fehler:', error);
      alert('Netzwerkfehler beim Import');
    } finally {
      setUploading(false);
    }
  }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">CSV-Eingabe</h1>
      <p className="mb-4">Bitte laden sie hier eine CSV in einem der folgenden Formate hoch</p>
      <ul>
        <li>Vorname;Nachname;Geburtsdatum;Geschlecht;Schwimmzertifikat</li>
        <li>Name;Vorname;Geschlecht;Geburtsdatum;Übung;Kategorie;Datum;Ergebnis;Punkte</li>
      </ul>
      <br></br>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-gray-500"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            
            {file ? (
              <p className="text-gray-700">Ausgewählte Datei: {file.name}</p>
            ) : (
              <p className="text-gray-500">CSV hierher ziehen oder klicken zum Auswählen</p>
            )}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="left" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Fügen sie hier eine CSV in einem der gültigen Formate ein
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className={`${
              uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded`}
          >
            {uploading ? 'Lädt...' : 'CSV importieren'}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="left" // Tooltip wird rechts angezeigt
          align="center" // Zentriert den Tooltip vertikal zur Maus
          sideOffset={10} // Abstand zwischen Tooltip und Maus
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
        >
          Bestätigen und hochladen
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}
function setTokenValid(arg0: any) {
  throw new Error('Function not implemented.');
}

