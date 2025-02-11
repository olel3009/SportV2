"use client"

import React from "react";
import { Athlete } from "@/models/athlete";
import { useRouter } from "next/navigation";
import { DataTable } from "@/ui/DataTable";

export function AthleteList( {athletes}: {athletes: Athlete[]} ) {
    const router = useRouter();

    return (
        <div className="overflow-x-auto">
            <DataTable className="display">

                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">Vorname</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Nachname</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Geschlecht</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Geburtsdatum</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Disziplinen</th>
                    </tr>
                </thead>

                <tbody>
                    {athletes.map((athlete) => (
                        <tr 
                            key={athlete.id} 
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push(`/athletes/${athlete.id}`)}
                        >
                            <td className="border border-gray-300 px-4 px-2">{athlete.firstName}</td>
                            <td className="border border-gray-300 px-4 px-2">{athlete.lastName}</td>
                            <td className="border border-gray-300 px-4 px-2">{athlete.sex}</td>
                            <td className="border border-gray-300 px-4 px-2">{athlete.dateOfBirth}</td>
                            <td className="border border-gray-300 px-4 px-2">
                                {athlete.disciplines && athlete.disciplines.length > 0
                                    ? athlete.disciplines.join(", ")
                                    : "Keine"}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </DataTable>
        </div>
    )
}