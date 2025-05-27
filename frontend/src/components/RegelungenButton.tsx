'use client';

import * as Tooltip from "@radix-ui/react-tooltip";
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, FileUp, Info } from "lucide-react";
import { add_rules, button_loggig_color } from '@/button_loggig';
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function Error({ message }: { message: string }) {
  return (
    <Card className="bg-red-50 border border-red-200 text-red-700 inline-block">
      <CardContent className="flex items-center gap-2 py-2 px-4">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <span
          className="whitespace-pre-line break-words"
          title={typeof message === "string" ? message.replace(/<br\s*\/?>/gi, "\n") : ""}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </CardContent>
    </Card>
  );
}

function Success({ message }: { message: string }) {
  return (
    <Card className="bg-green-50 border border-green-200 text-green-700 inline-block">
      <CardContent className="flex items-center gap-2 py-2 px-4">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span
          className="whitespace-pre-line break-words"
          title={typeof message === "string" ? message.replace(/<br\s*\/?>/gi, "\n") : ""}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </CardContent>
    </Card>
  );
}

const Waiting = ({ message }: { message: string }) => {
  return (
    <Card className="bg-blue-50 border border-blue-200 text-blue-700 inline-block">
      <CardContent className="flex items-center gap-2 py-2 px-4">
        <Info className="h-5 w-5 text-blue-600" />
        <span
          className="whitespace-pre-line break-words"
          title={typeof message === "string" ? message.replace(/<br\s*\/?>/gi, "\n") : ""}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </CardContent>
    </Card>
  );
};

export default function RegelungenButton() {
  const buttonresulterfolg = "Das Aktualisieren der Regelungen war erfolgreich.";
  const buttonresultwarten = "Das Aktualisieren der Regelungen wird durchgeführt.<br />Bitte warten sie einen Moment.";
  const buttonresultabruch = "Das Aktualisieren der Regelungen wurde abgebrochen.";
  const fehlerhaftedatei = "Das Aktualisieren der Regelungen war nicht erfolgreich. Brücksichtigen sie die folgenden Fehler und versuchen sie es mit einer abgeänderten Datei erneut: ";
  const fehlerhafterdateityp="Bitte laden Sie eine gültige CSV-Datei hoch.";

  const wert = 0;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [showPopup, setShowPopup] = useState(false);
  const [buttonresult, setButtonResult] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [waitingMessage, setWaitingMessage] = useState("");
  const [buttonColor, setButtonColor] = useState<number | null>(null);
  const [popupErrorMessage, setPopupErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // API-Aufruf nur einmal beim Mounten
  useEffect(() => {
    button_loggig_color().then(setButtonColor);
  }, []);

  const handleButtonClick = () => {
    setSuccessMessage("");
    setWaitingMessage("");
    setErrorMessage("")
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setUploadedFile(null);
    setSuccessMessage("");
    setWaitingMessage("");
    setPopupErrorMessage("");
    setErrorMessage(buttonresultabruch);
  };

  const handleConfirm = async () => {
    if (!uploadedFile || !uploadedFile.name.endsWith('.csv')) {
      setPopupErrorMessage(fehlerhafterdateityp);
      return;
    }

    setShowPopup(false);
    setWaitingMessage(buttonresultwarten);
    setPopupErrorMessage("");
    const errorMsg = await add_rules(uploadedFile);
    if (!errorMsg) {
    button_loggig_color().then(setButtonColor);
    setWaitingMessage("");
    setErrorMessage("");
    setSuccessMessage(buttonresulterfolg);
  } else {
    if (errorMsg === "Token invalid or not found") {
      setWaitingMessage("");
    setSuccessMessage("");
    setErrorMessage("");
    }else {
    setWaitingMessage("");
    setSuccessMessage("");
    setErrorMessage(fehlerhaftedatei+ "<br />" + errorMsg); // Fehler im UI anzeigen
    }
  }
    setUploadedFile(null);
    //setErrorMessage("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.name.endsWith(".csv")) {
        setUploadedFile(file);
        setPopupErrorMessage("");
      } else {
        setPopupErrorMessage(fehlerhafterdateityp);
      }
    }
  };
  return (
    <div>
      
      {buttonColor === null ? (
        <div></div>
      ) : buttonColor === wert ? (
        <div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button variant="default" onClick={handleButtonClick}>
                Regelungen aktualisieren
              </Button>
            </Tooltip.Trigger>
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
          {waitingMessage && <div className="mt-2"><Waiting message={waitingMessage} /></div>}
          {successMessage && <div className="mt-2"><Success message={successMessage} /></div>}
          {errorMessage && <div className="mt-2"><Error message={errorMessage}/></div>}
        </div>
      ) : (
        <div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button variant="destructive" onClick={handleButtonClick}>
                Regelungen aktualisieren
              </Button>
            </Tooltip.Trigger>
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
          {waitingMessage && <div className="mt-2"><Waiting message={waitingMessage} /></div>}
          {errorMessage && <div className="mt-2"><Error message={errorMessage}/></div>}
          {waitingMessage && <div className="mt-2"><Success message={waitingMessage} /></div>}
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
                      setPopupErrorMessage("");
                    } else {
                      setPopupErrorMessage(fehlerhafterdateityp);
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
          

          {popupErrorMessage && <div className="mt-2"><Error message={popupErrorMessage} /></div>}
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