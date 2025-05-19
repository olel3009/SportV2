'use client';

import * as Tooltip from "@radix-ui/react-tooltip";
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileUp } from "lucide-react";
import { add_rules, button_loggig_color } from '@/button_loggig';
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function Error({ message }: { message: string }) {
  return (
    <Card className="bg-red-50 border border-red-200 text-red-700">
      <CardContent className="flex items-center gap-2 py-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <span>{message}</span>
      </CardContent>
    </Card>
  )
}

export default function RegelungenButton() {
  const buttonresulterfolg = "Das Aktualisieren der Reglungen war erfolgreich.";
  const buttonresultfehler = "Das Aktualisieren der Reglungen war nicht erfolgreich.<br />Versuchen sie es zu einem späteren Zeitpunkt erneut!";
  const buttonresultwarten = "Das Aktualisieren der Reglungen wird durchgeführt.<br />Bitte warten sie einen Moment.";
  const buttonresultabruch = "Das Aktualisieren der Reglungen wurde abgebrochen.";
  const fehlerhaftedatei = "Das Aktualisieren der Reglungen war nicht erfolgreich. <br/>Falls eine Fehlermeldung erscheint bitte die hochgeladene <br/> Datei daraufhin überprüfen und zu einem späteren Zeitpunkt erneut versuchen!<br />";

  const wert = 0;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [showPopup, setShowPopup] = useState(false);
  const [buttonresult, setButtonResult] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonColor, setButtonColor] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // API-Aufruf nur einmal beim Mounten
  useEffect(() => {
    button_loggig_color().then(setButtonColor);
  }, []);

  const handleButtonClick = () => {
    setButtonResult("");
    setErrorMessage("")
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setButtonResult(buttonresultabruch);
    setUploadedFile(null);
    setErrorMessage("");
  };

  const handleConfirm = async () => {
    if (!uploadedFile || !uploadedFile.name.endsWith('.csv')) {
      setErrorMessage("Bitte laden Sie eine gültige CSV-Datei hoch.");
      return;
    }

    setShowPopup(false);
    setButtonResult(buttonresultwarten);
    // Simulierte Logik für die Regelaktualisierung
    const errorMsg = await add_rules(uploadedFile);
    if (!errorMsg) {
    button_loggig_color().then(setButtonColor);
    setButtonResult(buttonresulterfolg);
  } else {
    setButtonResult(fehlerhaftedatei);
    setErrorMessage(errorMsg); // Fehler im UI anzeigen
  }
    setUploadedFile(null);
    //setErrorMessage("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.name.endsWith(".csv")) {
        setUploadedFile(file);
        setErrorMessage(""); // Entfernt vorherige Fehlermeldungen
      } else {
        setErrorMessage("Bitte laden Sie eine gültige CSV-Datei hoch."); // Fehlermeldung für ungültige Dateien
      }
    }
  };
  return (
    <div>
      {errorMessage && <div className="mb-4"><Error message={errorMessage}/></div>}
      {buttonColor === null ? (
        <div>Lade...</div>
      ) : buttonColor === wert ? (
        <div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button variant="default" onClick={handleButtonClick}>
                Regelungen aktualisieren
              </Button>
            </Tooltip.Trigger>
            <p dangerouslySetInnerHTML={{ __html: buttonresult }}></p>
            <Tooltip.Content
              side="right"
              align="center"
              sideOffset={10}
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
            >
              Klicken Sie hier, um die Regelungen zu aktualisieren
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Root>
          
        </div>
      ) : (
        <div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button variant="destructive" onClick={handleButtonClick}>
                Regelungen aktualisieren
              </Button>
            </Tooltip.Trigger>
            <p dangerouslySetInnerHTML={{ __html: buttonresult }}></p>
            <Tooltip.Content
              side="right"
              align="center"
              sideOffset={10}
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
            >
              Klicken Sie hier, um die Regelungen zu aktualisieren
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      )}
      <Dialog
        open={showPopup}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClosePopup();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regelungen aktualisieren</DialogTitle>
          </DialogHeader>
          {/* Drag-and-Drop-Bereich */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                className="relative border border-dashed border-gray-300 p-4 rounded-md mb-4 cursor-pointer flex flex-col items-center justify-center h-48"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = "copy";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    if (file.name.endsWith(".csv")) {
                      setUploadedFile(file);
                      setErrorMessage("");
                    } else {
                      setErrorMessage("Bitte laden Sie eine gültige CSV-Datei hoch.");
                    }
                  }
                }}
              >
                <FileUp className="absolute w-40 h-40 text-gray-200" />
                {uploadedFile ? (
                  <p className="z-10">
                    Hochgeladene Datei: <strong>{uploadedFile.name}</strong> <br />
                    Falls Sie eine andere Datei hochladen möchten, ziehen Sie diese hierher oder klicken Sie auf das Feld. <br />
                    Die alte Datei wird mit der neuen Datei ersetzt.
                  </p>
                ) : (
                  <div className="text-center z-10">
                    <p>
                      Ziehen Sie eine CSV-Datei hierher oder klicken Sie, um eine Datei auszuwählen. <br />
                      Es ist nur eine Datei gleichzeitig möglich.
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="left"
              align="center"
              sideOffset={10}
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
            >
              Hier Klicken um Datei Explorer zu öffnen, um eine Datei hochzuladen.
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Root>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          <DialogFooter>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <a href="/regelung-beispiel.csv" download>
                  <Button>
                    Beispiel CSV
                  </Button>
                </a>
              </Tooltip.Trigger>
              <Tooltip.Content
                side="left"
                align="center"
                sideOffset={10}
                className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
              >
                Hier Klicken um eine Beispiel CSV-Datei Herunterzuladen.
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button variant="destructive" onClick={handleClosePopup}>
                  Abbrechen
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content
                side="left"
                align="center"
                sideOffset={10}
                className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
              >
                Hier Klicken um den Vorgang Abzubrechen.
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white" onClick={handleConfirm}>
                  Bestätigen
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content
                side="right"
                align="center"
                sideOffset={10}
                className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
              >
                Hier Klicken um den Vorgang des Aktualisierens zu starten.
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Root>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}