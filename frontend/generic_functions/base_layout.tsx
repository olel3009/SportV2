// components/Layout.js
import React, { ReactNode } from 'react'
import Link from "next/link";
import { useState } from "react";

let sites: string[][] = [["Startseite", "/"], ["Testseite", "/test_page"]];

function Nav_Menu() {
  let links = sites.map((site, index) => {
    return <Link href={site[1]} key={index}>{site[0]}</Link>
  });
  return <nav>{links}</nav>;
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Nav_Menu />
      <main>
        {children}
      </main>
    </div>
  )
}
