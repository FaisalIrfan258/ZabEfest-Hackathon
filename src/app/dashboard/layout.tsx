"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/login"
      return
    }
    setUser(JSON.parse(userData))
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <DashboardHeader />
      <SidebarInset>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
