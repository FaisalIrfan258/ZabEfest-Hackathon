"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/components/admin-sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      window.location.href = "/admin/login"
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [])

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
