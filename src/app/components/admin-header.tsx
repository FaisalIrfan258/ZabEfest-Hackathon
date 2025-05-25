"use client"

import { Bell, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"

export function AdminHeader() {
  const [admin, setAdmin] = useState<any>(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New high priority incident",
      message: "Water dumping reported in Block 5",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "User registration spike",
      message: "15 new users registered today",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Weekly report ready",
      message: "Environmental impact report is available",
      time: "2 hours ago",
      read: true,
    },
  ])

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayName = admin?.fullName || admin?.email || "Admin"
  const adminEmail = admin?.email || "admin@ecotracker.com"

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <header className="bg-white border-b border-green-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-green-100 text-green-700">
              {displayName
                .split(" ")
                .map((n:any) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">{displayName}</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{adminEmail}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-green-600">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-xs flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Admin Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-green-50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{notification.message}</span>
                  <span className="text-xs text-gray-400 mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-green-600">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => (window.location.href = "/admin/dashboard/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "/admin/dashboard/analytics")}>
                <Shield className="mr-2 h-4 w-4" />
                System Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
