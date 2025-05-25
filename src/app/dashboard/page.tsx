"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MapPin, User, Clock, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Mock reports data
const mockReports = [
  {
    id: 1,
    category: "Water Dumping",
    description: "Industrial waste being dumped into the river near the bridge causing water pollution",
    location: "Karachi River Bridge, Block 5",
    reportedAt: "2 hours ago",
    status: "Under Investigation",
    image: "/placeholder.svg?height=80&width=80",
    icon: "💧",
  },
  {
    id: 2,
    category: "Air Pollution",
    description: "Heavy smoke emission from factory chimney causing breathing issues in the area",
    location: "Industrial Area, Block 3",
    reportedAt: "1 day ago",
    status: "In Progress",
    image: "/placeholder.svg?height=80&width=80",
    icon: "🏭",
  },
  {
    id: 3,
    category: "Sewage Leakage",
    description: "Major sewage overflow on main road creating health hazards for residents",
    location: "Main Street, Block 7",
    reportedAt: "3 days ago",
    status: "Resolved",
    image: "/placeholder.svg?height=80&width=80",
    icon: "🚰",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  const displayName = user.name || user.username || "User"

  const handleViewReport = (report: any) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleEditReport = (report: any) => {
    console.log("Edit report:", report)
    // Navigate to edit form or open edit modal
  }

  const handleDeleteReport = (report: any) => {
    console.log("Delete report:", report)
    // Show confirmation and delete
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Under Investigation":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
        <p className="text-green-100">
          Thank you for being part of our environmental monitoring community. Your reports help make our environment
          better.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockReports.length}</div>
            <p className="text-xs text-gray-500">Reports submitted</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockReports.filter((r) => r.status === "Under Investigation").length}
            </div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Following</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500">Incidents followed</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Eco Points</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-gray-500">Earned points</p>
          </CardContent>
        </Card>
      </div>

      {/* My Reports Section */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900">My Reports</CardTitle>
          <CardDescription className="text-gray-600">
            Track and manage your environmental incident reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports submitted yet</p>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => (window.location.href = "/dashboard/incident-reporting")}
              >
                Submit Your First Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mockReports.map((report) => (
                <Card key={report.id} className="border border-gray-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                          {report.icon}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{report.category}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {report.reportedAt}
                          </div>
                        </div>
                      </div>

                      {/* Image */}

                      {/* Status */}
                      <div className="flex-shrink-0">
                        <Badge className={`${getStatusColor(report.status)} border`} variant="outline">
                          {report.status}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewReport(report)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditReport(report)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteReport(report)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Report Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedReport?.icon}</span>
              {selectedReport?.category}
            </DialogTitle>
            <DialogDescription>Report Details</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(selectedReport.status)} border`} variant="outline">
                  {selectedReport.status}
                </Badge>
                <span className="text-sm text-gray-500">{selectedReport.reportedAt}</span>
              </div>

              <img
                src={selectedReport.image || "/placeholder.svg"}
                alt="Incident"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Description</h4>
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Location</h4>
                <p className="text-gray-700 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedReport.location}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
