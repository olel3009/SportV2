"use client";
import Image from "next/image";
import styles from "../page.module.css"
import { useSearchParams } from "next/navigation";
import { getAthleteById } from "@/athlete_getters";
import { useState } from "react";
import { Feat } from "@/models/athlete";
import { useEffect } from "react";
import DataTable from 'datatables.net-dt';

export default function Page() {
  const searchParams = useSearchParams();
  const presentID = searchParams.get('id');
  const presentIDNumber = Number(presentID);
  const athletedata = getAthleteById(presentIDNumber);
  const [expanded, setExpanded] = useState<string | false>(false);

  interface DiscProps {
    discipline: string; // We’re making this required and specifically a string
  }

  function DisciplineTable({discipline}:DiscProps){
    let tID= discipline+"_table";
    useEffect(() => {

      new DataTable('#' + tID, {
        destroy: true,
        language: {
          sEmptyTable:     "Keine Daten in der Tabelle vorhanden",
          sInfo:           "Zeige _START_ bis _END_ von _TOTAL_ Einträgen",
          sInfoEmpty:      "Zeige 0 bis 0 von 0 Einträgen",
          sInfoFiltered:   "(gefiltert von _MAX_ Einträgen)",
          sLengthMenu:     "Zeige _MENU_ Einträge",
          sLoadingRecords: "Wird geladen...",
          sProcessing:     "Bitte warten...",
          sSearch:         "Suchen:",
          sZeroRecords:    "Keine Einträge vorhanden.",
          oPaginate: {
            sFirst:    "Erste",
            sPrevious: "Zurück",
            sNext:     "Weiter",
            sLast:     "Letzte"
          },
          oAria: {
            sSortAscending:  ": aktivieren, um Spalte aufsteigend zu sortieren",
            sSortDescending: ": aktivieren, um Spalte absteigend zu sortieren"
          }
        }
      });

    }, []);
    return(
      <table id ={tID} className={styles.featTable}>
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
      </table>
      
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