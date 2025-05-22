"use client"

import React, { useState, DragEvent } from 'react';

export default function Startpage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    if (!file) {
      alert('Bitte eine CSV-Datei auswählen!');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://127.0.0.1:5000/results/import', {
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
    } catch (error) {
      console.error('Fetch-Fehler:', error);
      alert('Netzwerkfehler beim Import');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Dies ist die Dashboardseite</p>

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

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className={`${
          uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white px-4 py-2 rounded`}
      >
        {uploading ? 'Lädt...' : 'CSV importieren'}
      </button>
    </div>
  );
}
