"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  LogOut,
  User,
  MapPin,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  isActive: boolean
  onClick?: () => void
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        isActive
          ? "bg-green-100 text-green-900"
          : "hover:bg-green-50 text-gray-700 hover:text-green-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Listen for resize events to handle responsive menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    {
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/incident-reporting",
      icon: <AlertTriangle className="w-5 h-5" />,
      label: "Report Incident",
    },
    {
      href: "/dashboard/nearby-incidents",
      icon: <MapPin className="w-5 h-5" />,
      label: "Incidents Map",
    },
    {
      href: "/dashboard/profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile header */}
        <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between md:hidden">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full p-1 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-green-800">Eco Tracker</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </header>

        <div className="flex flex-1">
          {/* Sidebar for desktop */}
          <aside className="w-64 bg-white shadow-md hidden md:flex md:flex-col h-screen sticky top-0">
            <div className="p-4 flex items-center gap-2">
              <div className="bg-green-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-green-800">Eco Tracker</h1>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={user?.profilePicture || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
              </div>
            </div>

            <Separator />

            <nav className="p-4 flex-1 space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>

            <div className="p-4">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </aside>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
              <div className="bg-white h-full w-64 shadow-lg p-4 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold text-green-800">Eco Tracker</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="relative">
                    <img
                      src={user?.profilePicture || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                </div>

                <Separator />

                <nav className="py-4 flex-1 space-y-1">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={pathname === item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </nav>

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
