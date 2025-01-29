"use client";
import Image from "next/image";
import styles from "../page.module.css";
import { useSearchParams } from "next/navigation";
import { getAthleteById } from "../../../generic_functions/athlete_getters";
import { useState } from "react";
import { Feat } from "@/models/athlete";

export default function FeatsResultsPage() {
  const searchParams = useSearchParams();
  const presentID = searchParams.get('id');
  const presentIDNumber = Number(presentID);
  const athletedata = getAthleteById(presentIDNumber);
  const [expanded, setExpanded] = useState<string | false>(false);

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
            Ergebnisse von: {athletedata.name} {athletedata.lastName}
          </p>
          <div className={styles.disciplinesContainer}>
            <span>
              {athletedata.disciplines.map((discipline: string) => (
                <a key={discipline} onClick={() => handleChange(discipline)} className={styles.disciplineTitle}>
                  {discipline}
                  <div className={styles.newestFeat}>
                  {(() => {
                    const newestFeat = getNewestFeat(discipline);
                    return newestFeat ? (
                      <div>
                        <p>Neueste Leistung:</p>
                        <p>Übung: {newestFeat.exercise}</p>
                        <p>Ergebnis: {newestFeat.result}</p>
                        <p>Punkte: {newestFeat.score}</p>
                        <p>Datum: {newestFeat.date}</p>
                      </div>
                    ) : (
                      <p>Keine Leistungen vorhanden</p>
                    );
                  })()}
                </div>
                </a>
                
              ))}
            </span>
            {athletedata.disciplines.map((discipline: string) => (
              <div key={discipline} className={styles.disciplineCard}>
                {expanded === discipline && (
                  <div className={styles.resultsCard}>
                    <table className={styles.resultsTable}>
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
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}