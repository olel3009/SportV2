"use client";
import Image from "next/image";
import styles from "../page.module.css";
import { json } from "stream/consumers";
import exp from "constants";
import { useSearchParams } from "next/navigation";


export default function FeatsResultsPage() {
  const searchParams = useSearchParams();
  const presentID=searchParams.get('id');
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <h1 className={styles.title}>Leistungen Ergebnisse</h1>
      <section className={styles.resultsSection}>
        <p>Hier sind die Ergebnisse und Leistungen:</p>
        <p>
        Displaying for ID: {presentID}
        </p>
      </section>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}