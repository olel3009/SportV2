'use client'
import { LayoutPanelTop, Users, Settings, ChartNoAxesCombined, BookOpenText, LogOut, ClipboardList, Import } from "lucide-react"

import { 
    Sidebar, 
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem 
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutPanelTop
  },
  {
    title: "Athleten",
    url: "/athletes",
    icon: Users
  },
  {
    title: "Leistungseintrag",
    url: "/feat_entry_page",
    icon: ChartNoAxesCombined
  },
  {
    title: "Regelübersicht",
    url: "/rule_overview",
    icon: ClipboardList
  },
  {
    title: "CSV-Eingabe",
    url: "/csv_entry",
    icon: Import
  },
  {
    title: "Wiki",
    url: "/wiki_page",
    icon: BookOpenText
  },
  {
    title: "Logout",
    url: "/",
    icon: LogOut
  }
]

function handleLogout() {
  localStorage.removeItem("access_token");
  window.location.href = "/";
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Logout" ? (
                    <SidebarMenuButton asChild>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full">
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}