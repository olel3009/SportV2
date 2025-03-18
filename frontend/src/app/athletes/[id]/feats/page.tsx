"use client";
import Image from "next/image";
import styles from "../../..//page.module.css"
import { useSearchParams } from "next/navigation";
import { getAthleteById } from "@/athlete_getters";
import { useState } from "react";
import { Feat } from "@/models/athlete";
import { useEffect } from "react";
import { DataTable } from "@/components/DataTable";

export default async function Page({ params }: {
  params: Promise<{ id: number }>
}) {
  const id = (await params).id
  const presentIDNumber = Number(id);
  const athletedata = getAthleteById(presentIDNumber);
  const [expanded, setExpanded] = useState<string | false>(false);

  interface DiscProps {
    discipline: string; // We’re making this required and specifically a string
  }

  function DisciplineTable({discipline}:DiscProps){

    return(
      <DataTable className={styles.featTable}>
        <thead>
          <tr>
            <th>Übung</th>
            <th>Ergebnis</th>
            <th>Punkte</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {filterAndSortFeats(discipline).map((feat: Feat, index: number) => (
            <tr key={index}>
              <td>{feat.exercise}</td>
              <td>{feat.result}</td>
              <td>{feat.score}</td>
              <td>{feat.date}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
        </tfoot>
      </DataTable>
      
    );
  
  }

  const handleChange = (discipline: string) => {
    setExpanded(expanded === discipline ? false : discipline);
  };
  const filterAndSortFeats = (discipline: string): Feat[] => {
    return athletedata.feats
      .filter((feat: Feat) => feat.discipline === discipline)
      .sort((a: Feat, b: Feat) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateB.getTime() - dateA.getTime(); // Neuere zuerst
      });
  };

  const getNewestFeat = (discipline: string): Feat | null => {
    const sortedFeats = filterAndSortFeats(discipline);
    return sortedFeats.length > 0 ? sortedFeats[0] : null;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Leistungen Ergebnisse</h1>
        <section className={styles.resultsSection}>
          <p className={styles.athleteInfo}>
            <a><b>Ergebnisse von: {athletedata?.firstName} {athletedata?.lastName}</b></a>
          </p>
          <div>
            <div className={styles.disciplinesContainer}>
              {athletedata?.disciplines?.map((discipline: string) => (
                <div key={discipline} onClick={() => handleChange(discipline)} className={styles.feat}>
                  <b>
                    {discipline}
                  </b>
                    {(() => {
                      const newestFeat = getNewestFeat(discipline);
                      return newestFeat ? (
                        <span>
                          <p>Neueste Leistung:</p>
                          <p>Übung: {newestFeat.exercise}</p>
                          <p>Ergebnis: {newestFeat.result}</p>
                          <p>Punkte: {newestFeat.score}</p>
                          <p>Datum: {newestFeat.date}</p>
                        </span>
                      ) : (
                        <p>Keine Leistungen vorhanden</p>
                      );
                    })()}
                  
                </div>  
              ))}
            </div>
            {athletedata?.disciplines?.map((discipline: string) => (
              <div key={discipline} className={styles.disciplineCard}>
                {expanded === discipline && (
                  <div>
                    <DisciplineTable discipline={discipline}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        </main>
    </div>
  );
}