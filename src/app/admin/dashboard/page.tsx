"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock incident data for admin dashboard
const mockIncidents = [
  {
    id: 1,
    category: "Water Dumping",
    description: "Industrial waste being dumped into the river near the bridge causing severe water pollution",
    location: "Karachi River Bridge, Block 5",
    reportedBy: "Ahmad Ali",
    reportedAt: "2 hours ago",
    status: "Pending",
    priority: "High",
    image: "/placeholder.svg?height=60&width=60",
    icon: "💧",
  },
  {
    id: 2,
    category: "Air Pollution",
    description: "Heavy smoke emission from factory chimney causing breathing issues in residential area",
    location: "Industrial Area, Block 3",
    reportedBy: "Fatima Khan",
    reportedAt: "5 hours ago",
    status: "Under Investigation",
    priority: "Medium",
    image: "/placeholder.svg?height=60&width=60",
    icon: "🏭",
  },
  {
    id: 3,
    category: "Sewage Leakage",
    description: "Major sewage overflow on main road creating health hazards for local residents",
    location: "Main Street, Block 7",
    reportedBy: "Hassan Sheikh",
    reportedAt: "1 day ago",
    status: "In Progress",
    priority: "High",
    image: "/placeholder.svg?height=60&width=60",
    icon: "🚰",
  },
  {
    id: 4,
    category: "Noise Pollution",
    description: "Loud construction work during night hours violating noise regulations",
    location: "Commercial Plaza, Block 2",
    reportedBy: "Aisha Malik",
    reportedAt: "2 days ago",
    status: "Resolved",
    priority: "Low",
    image: "/placeholder.svg?height=60&width=60",
    icon: "🔊",
  },
  {
    id: 5,
    category: "Illegal Construction",
    description: "Unauthorized building construction blocking public drainage system",
    location: "Residential Area, Block 8",
    reportedBy: "Omar Farooq",
    reportedAt: "3 days ago",
    status: "Resolved",
    priority: "Medium",
    image: "/placeholder.svg?height=60&width=60",
    icon: "🏗️",
  },
]

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<any>(null)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  if (!admin) {
    return <div>Loading...</div>
  }

  const displayName = admin.fullName || admin.email || "Admin"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Under Investigation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Pending":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredIncidents = filter === "All" ? mockIncidents : mockIncidents.filter((i) => i.status === filter)

  const stats = {
    total: mockIncidents.length,
    pending: mockIncidents.filter((i) => i.status === "Pending").length,
    inProgress: mockIncidents.filter((i) => i.status === "In Progress" || i.status === "Under Investigation").length,
    resolved: mockIncidents.filter((i) => i.status === "Resolved").length,
  }

  const handleViewIncident = (incident: any) => {
    setSelectedIncident(incident)
    setIsViewModalOpen(true)
  }

  const handleStatusChange = (incident: any, newStatus: string) => {
    console.log(`Changing status of incident ${incident.id} to ${newStatus}`)
    // Handle status change logic
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
        <p className="text-green-100">
          Manage environmental incidents and monitor community reports from your admin dashboard.
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
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500">All incident reports</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-500">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-gray-500">Being processed</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-gray-500">Successfully handled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Under Investigation", "In Progress", "Resolved"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={
              filter === status
                ? "bg-green-600 hover:bg-green-700"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Recent Incident Reports */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Incident Reports</CardTitle>
          <CardDescription className="text-gray-600">
            Manage and track environmental incident reports from the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.id} className="border border-gray-200 hover:border-green-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Priority Indicator */}
                    <div className="flex-shrink-0">
                      <div className={`w-1 h-16 rounded-full ${getPriorityColor(incident.priority)}`}></div>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                        {incident.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{incident.category}</h3>
                        <Badge className={`${getStatusColor(incident.status)} border text-xs`} variant="outline">
                          {incident.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {incident.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {incident.reportedBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {incident.reportedAt}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewIncident(incident)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(incident, "Under Investigation")}>
                            Mark as Under Investigation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(incident, "In Progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(incident, "Resolved")}>
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Incident Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedIncident?.icon}</span>
              {selectedIncident?.category}
            </DialogTitle>
            <DialogDescription>Incident Report Details</DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(selectedIncident.status)} border`} variant="outline">
                    {selectedIncident.status}
                  </Badge>
                  <Badge variant="outline">{selectedIncident.priority} Priority</Badge>
                </div>
                <span className="text-sm text-gray-500">{selectedIncident.reportedAt}</span>
              </div>

              <img
                src={selectedIncident.image || "/placeholder.svg"}
                alt="Incident"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Description</h4>
                <p className="text-gray-700">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">Location</h4>
                  <p className="text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedIncident.location}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">Reported By</h4>
                  <p className="text-gray-700">{selectedIncident.reportedBy}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact Reporter
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                  View on Map
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
