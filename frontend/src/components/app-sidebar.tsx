import { LayoutPanelTop, Users, Settings, ChartNoAxesCombined, BookOpenText } from "lucide-react"

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
    title: "Leistungseintrag",
    url: "/feat_entry_page",
    icon: ChartNoAxesCombined
  },
  {
    title: "Wiki",
    url: "/wiki_page",
    icon: BookOpenText
  },
  {
    title: "Einstellungen",
    url: "/settings",
    icon: Settings
  }
]

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