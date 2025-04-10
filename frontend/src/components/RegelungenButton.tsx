'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileUp } from "lucide-react";

export default function RegelungenButton() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [showPopup, setShowPopup] = useState(false);
  const [buttonResult, setButtonResult] = useState("");
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
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  return (
    <div>
      <Button variant="default" onClick={handleButtonClick}>
        Regelungen aktualisieren
      </Button>
      <p dangerouslySetInnerHTML={{ __html: buttonResult }}></p>

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