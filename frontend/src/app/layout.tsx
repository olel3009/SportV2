import React, { ReactNode } from 'react'
import Link from "next/link";
import '@/app/globals.css'
import { usePathname, useSearchParams } from 'next/navigation'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
          <SidebarInset>
            <main className='flex flex-col w-full h-full'>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
