"use client"

import { useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ErrorDisplay from "./ErrorDisplay";
import { FileUp } from "lucide-react";
import { Button } from "./ui/button";
import uploadSwimCert from "@/swim_cert";



export default function SwimCertificateUpload({ id }: { id: number }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fehlerhafterdateityp = "Ungültige Dateiendung. Erlaubt sind .pdf, .png, .jpg und .jpeg. ";
  const allowedTypes = [".pdf", ".png", ".jpg", ".jpeg"]

  async function handleConfirm() {
    if (!uploadedFile) return;
    setErrorMessage("");
    const errorMsg = await uploadSwimCert(id, uploadedFile)
    if (!errorMsg) {
      window.location.reload();
    }
    else {
      console.log(errorMsg)
    }
    setUploadedFile(null)
  }

  function handleClosePopup() {
    setUploadedFile(null);
    setErrorMessage("");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (allowedTypes.some(ext => file.name.endsWith(ext))) {
        setUploadedFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage(fehlerhafterdateityp);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="w-min">
        <Button>
          Schwimmnachweis Hochladen
        </Button>
      </DialogTrigger>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Schwimmnachweis Hochladen</DialogTitle>
        </DialogHeader>

        {/* Upload Field */}
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
              if (allowedTypes.some(ext => file.name.endsWith(ext))) {
                setUploadedFile(file);
                setErrorMessage("");
              } else {
                setErrorMessage(fehlerhafterdateityp);
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
                Ziehen Sie einen Schwimmnachweis hierher oder klicken Sie, um eine Datei auszuwählen. <br />
                Es ist nur eine Datei gleichzeitig möglich.
              </p>
            </div>
          )}
          <input
            type="file"
            accept={allowedTypes.join(",")}
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        {errorMessage && (
          <ErrorDisplay message={errorMessage} />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleClosePopup}>Abbrechen</Button>
              <Button onClick={handleConfirm}>Hochladen</Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>


    </Dialog>
  )
}