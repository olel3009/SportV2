// components/Layout.js
import React, { ReactNode } from 'react'
import Link from "next/link";
import styles from "../src/app/page.module.css";

let sites: string[][] = [["Startseite", "/"], ["Testseite", "/test_page"]];

function Nav_Menu() {
  let links = sites.map((site, index) => {
    return<Link href={site[1]} key={index} className={styles.navbutt}>{site[0]}</Link>
  });
  return <nav key = 'navMen' className={styles.navbar}>{links}</nav>;
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
      <div className={styles.back_layer}>
        <Nav_Menu />
        <div className={styles.page}>
          <main className={styles.main}>
            <div className={styles.content}>
              {children}
            </div>
          </main>
        </div>
      </div>
  )
}
