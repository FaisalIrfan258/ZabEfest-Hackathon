"use client"

import { LayoutDashboard, FileText, Map, Settings, Users, BarChart3, MessageSquare, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reported Incidents",
    url: "/admin/dashboard/reported-incidents",
    icon: FileText,
  },
  {
    title: "Map",
    url: "/admin/dashboard/map",
    icon: Map,
  },
  {
    title: "Incident Management",
    url: "/admin/dashboard/incident-management",
    icon: Settings,
  },
  {
    title: "User Management",
    url: "/admin/dashboard/user-management",
    icon: Users,
  },
  {
    title: "Analytics & Reports",
    url: "/admin/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Community Management",
    url: "/admin/dashboard/community-management",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    url: "/admin/dashboard/profile",
    icon: User,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("admin")
    window.location.href = "/admin/login"
  }

  return (
    <Sidebar className="border-r border-green-200">
      <SidebarHeader className="border-b border-green-200 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">✓</span>
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900">Eco Tracker</span>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`
  ${
    pathname === item.url
      ? "bg-green-50 text-green-700 font-medium"
      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
  }
`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-green-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
