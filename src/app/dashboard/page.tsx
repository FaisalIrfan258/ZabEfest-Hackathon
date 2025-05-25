"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MapPin, User, Clock, ArrowUp } from 'lucide-react'
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null // This should not happen as the ProtectedRoute component will redirect to login
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-green-100">
          Thank you for being part of our environmental monitoring community. 
          Your reports help make our environment better.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.reportedIncidents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Reports submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Following</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.followedIncidents?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Incidents followed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{user.points}</div>
            <p className="text-xs text-muted-foreground">Earned points</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with reporting environmental incidents in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/report-incident">
              <Card className="cursor-pointer hover:shadow-md transition-shadow hover:border-green-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Report New Incident</h3>
                      <p className="text-sm text-gray-600">Submit a new environmental incident report</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/profile">
              <Card className="cursor-pointer hover:shadow-md transition-shadow hover:border-green-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Profile</h3>
                      <p className="text-sm text-gray-600">Manage your account settings and information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Badges</CardTitle>
            <CardDescription>
              Achievements earned for your environmental contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {user.badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {badge.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="mt-2 text-sm">{badge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
