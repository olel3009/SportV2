"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { json } from "stream/consumers";
import exp from "constants";
import Link from "next/link";
import { useState } from "react";


export default function Home() {
  const [queryValue, setQueryValue] = useState("");
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       Nur hier um zu existieren, gerne schnell überschreiben
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}