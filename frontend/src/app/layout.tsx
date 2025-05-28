'use client'

import React from 'react'
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import '@/app/globals.css'
import { usePathname } from 'next/navigation'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // list any paths where you want to hide the sidebar
  const hiddenPaths = ['/', '/signup']
  const showSidebar = !hiddenPaths.includes(pathname)

  return (
    <html lang="en">
      <body>
        <Tooltip.Provider>
          {showSidebar ? (
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-10">
                  <SidebarTrigger />
                </header>
                <main className="flex flex-col w-full h-full">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          ) : (
            <main className="flex flex-col w-full h-full">
              {children}
            </main>
          )}
        </Tooltip.Provider>
      </body>
    </html>
  )
}
