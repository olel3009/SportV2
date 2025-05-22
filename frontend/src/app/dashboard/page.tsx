'use client'
import { validateAndGetToken } from "@/auth";
import RegelungenButton from "@/components/RegelungenButton";

export default function Startpage() {
  if (validateAndGetToken()== true) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Dies ist die Dashboardseite</p>
      <RegelungenButton />
    </div>
  );
  }
  
}