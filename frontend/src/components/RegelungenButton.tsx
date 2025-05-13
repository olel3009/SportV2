'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileUp } from "lucide-react";
import { button_loggig_color } from '@/button_loggig';

export default function RegelungenButton() {
  const buttonresulterfolg = "Das Aktualisieren der Reglungen war erfolgreich.";
  const buttonresultfehler = "Das Aktualisieren der Reglungen war nicht erfolgreich.<br />Versuchen sie es zu einem späteren Zeitpunkt erneut!";
  const buttonresultwarten = "Das Aktualisieren der Reglungen wird durchgeführt.<br />Bitte warten sie einen Moment.";
  const buttonresultabruch = "Das Aktualisieren der Reglungen wurde abgebrochen.";

  const wert = 0;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [showPopup, setShowPopup] = useState(false);
  const [buttonresult, setButtonResult] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setButtonResult("Das Aktualisieren der Regelungen wurde abgebrochen.");
    setSelectedYear(currentYear.toString());
    setUploadedFile(null);
    setErrorMessage("");
  };

  const handleConfirm = () => {
    if (!uploadedFile || !uploadedFile.name.endsWith('.csv')) {
      setErrorMessage("Bitte laden Sie eine gültige CSV-Datei hoch.");
      return;
    }

    setShowPopup(false);
    setButtonResult("Das Aktualisieren der Regelungen wird durchgeführt. Bitte warten Sie einen Moment.");

    // Simulierte Logik für die Regelaktualisierung
    setTimeout(() => {
      setButtonResult("Das Aktualisieren der Regelungen war erfolgreich.");
    }, 2000);
    setSelectedYear(currentYear.toString());
    setUploadedFile(null);
    setErrorMessage("");
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

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  return (
    <div>
      {button_loggig_color() === wert ? (
        <div>
          <Button variant="default" onClick={handleButtonClick}>
            Regelungen aktualisieren
          </Button>
          <p dangerouslySetInnerHTML={{ __html: buttonresult }}></p>
        </div>
      ) : (
        <div>
          <Button variant="destructive" onClick={handleButtonClick}>
            Regelungen aktualisieren
          </Button>
          <p dangerouslySetInnerHTML={{ __html: buttonresult }}></p>
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
          <div
            className="relative border border-dashed border-gray-300 p-4 rounded-md mb-4 cursor-pointer flex flex-col items-center justify-center h-48"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault(); // Verhindert das Standardverhalten des Browsers
              e.stopPropagation();
              e.dataTransfer.dropEffect = "copy"; // Zeigt an, dass Dateien kopiert werden können
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.name.endsWith(".csv")) {
                  setUploadedFile(file);
                  setErrorMessage(""); // Entfernt vorherige Fehlermeldungen
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

          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Jahr auswählen:
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedYear}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {years.map((year) => (
                  <DropdownMenuItem key={year} onClick={() => handleYearChange(year.toString())}>
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          <DialogFooter>
            <Button variant="destructive" onClick={handleClosePopup}>
              Abbrechen
            </Button>
            <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white" onClick={handleConfirm}>
              Bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}