import { LayoutPanelTop, Users, Settings } from "lucide-react"

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
    title: "Dasboard",
    url: "/dashboard",
    icon: LayoutPanelTop
  },
  {
    title: "Athleten",
    url: "/athletes",
    icon: Users
  },
  {
    title: "Leistung",
    url: "/feat_entry_page",
    icon: Users
  },
  {
    title: "Einstellungen",
    url: "/settings",
    icon: Settings
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}