"use client"
import React, { ReactNode } from 'react'
import Link from "next/link";
import '@/app/globals.css'
import { usePathname, useSearchParams } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <SidebarProvider>
          <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
        </SidebarProvider>
      </body>
    </html>
  )
}
