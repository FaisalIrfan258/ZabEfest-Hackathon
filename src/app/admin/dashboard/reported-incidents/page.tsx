"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Clock, User, Eye, Search, Filter } from "lucide-react"

// Mock reported incidents data
const mockReportedIncidents = [
  {
    id: 1,
    category: "Water Dumping",
    description:
      "Industrial waste being dumped into the river near the bridge causing severe water pollution and affecting marine life",
    location: "Karachi River Bridge, Block 5",
    coordinates: { lat: 24.8607, lng: 67.0011 },
    reportedBy: {
      name: "Ahmad Ali",
      email: "ahmad.ali@email.com",
      phone: "03001234567",
      cnic: "4210112345678",
    },
    reportedAt: "2024-01-15T10:30:00Z",
    status: "Pending",
    priority: "High",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    icon: "💧",
  },
  {
    id: 2,
    category: "Air Pollution",
    description:
      "Heavy smoke emission from factory chimney causing breathing issues in residential area. Multiple residents have complained about respiratory problems.",
    location: "Industrial Area, Block 3",
    coordinates: { lat: 24.8647, lng: 67.0051 },
    reportedBy: {
      name: "Fatima Khan",
      email: "fatima.khan@email.com",
      phone: "03009876543",
      cnic: "4210187654321",
    },
    reportedAt: "2024-01-15T08:15:00Z",
    status: "Under Investigation",
    priority: "Medium",
    images: ["/placeholder.svg?height=200&width=300"],
    icon: "🏭",
  },
  {
    id: 3,
    category: "Sewage Leakage",
    description:
      "Major sewage overflow on main road creating health hazards for local residents and causing traffic disruption",
    location: "Main Street, Block 7",
    coordinates: { lat: 24.8567, lng: 67.0091 },
    reportedBy: {
      name: "Hassan Sheikh",
      email: "hassan.sheikh@email.com",
      phone: "03007654321",
      cnic: "4210156789012",
    },
    reportedAt: "2024-01-14T16:45:00Z",
    status: "In Progress",
    priority: "High",
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    icon: "🚰",
  },
  {
    id: 4,
    category: "Noise Pollution",
    description:
      "Loud construction work during night hours violating noise regulations and disturbing residents' sleep",
    location: "Commercial Plaza, Block 2",
    coordinates: { lat: 24.8487, lng: 67.0171 },
    reportedBy: {
      name: "Aisha Malik",
      email: "aisha.malik@email.com",
      phone: "03005432109",
      cnic: "4210143210987",
    },
    reportedAt: "2024-01-14T22:30:00Z",
    status: "Resolved",
    priority: "Low",
    images: ["/placeholder.svg?height=200&width=300"],
    icon: "🔊",
  },
  {
    id: 5,
    category: "Illegal Construction",
    description: "Unauthorized building construction blocking public drainage system and violating building codes",
    location: "Residential Area, Block 8",
    coordinates: { lat: 24.8527, lng: 67.0131 },
    reportedBy: {
      name: "Omar Farooq",
      email: "omar.farooq@email.com",
      phone: "03008765432",
      cnic: "4210198765432",
    },
    reportedAt: "2024-01-13T14:20:00Z",
    status: "Resolved",
    priority: "Medium",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    icon: "🏗️",
  },
  {
    id: 6,
    category: "Deforestation",
    description:
      "Illegal cutting of trees in protected area without proper authorization from environmental department",
    location: "Green Park, Block 4",
    coordinates: { lat: 24.8707, lng: 67.0211 },
    reportedBy: {
      name: "Sara Ahmed",
      email: "sara.ahmed@email.com",
      phone: "03002345678",
      cnic: "4210123456789",
    },
    reportedAt: "2024-01-13T09:15:00Z",
    status: "Pending",
    priority: "High",
    images: ["/placeholder.svg?height=200&width=300"],
    icon: "🌳",
  },
]

const categories = [
  "All Categories",
  "Water Dumping",
  "Air Pollution",
  "Sewage Leakage",
  "Noise Pollution",
  "Illegal Construction",
  "Deforestation",
]
const statuses = ["All Status", "Pending", "Under Investigation", "In Progress", "Resolved"]

export default function ReportedIncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("All Status")

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const filteredIncidents = mockReportedIncidents.filter((incident) => {
    const matchesSearch =
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All Categories" || incident.category === categoryFilter
    const matchesStatus = statusFilter === "All Status" || incident.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleViewIncident = (incident: any) => {
    setSelectedIncident(incident)
    setIsViewModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Reported Incidents</h1>
        <p className="text-green-600 mt-2">
          View and monitor all environmental incident reports submitted by community members
        </p>
      </div>

      {/* Filters */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredIncidents.length} of {mockReportedIncidents.length} incidents
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="border border-gray-200 hover:border-green-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Priority Indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-1 h-20 rounded-full ${getPriorityColor(incident.priority)}`}></div>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                    {incident.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{incident.category}</h3>
                    <Badge className={`${getStatusColor(incident.status)} border text-xs`} variant="outline">
                      {incident.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {incident.priority} Priority
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{incident.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{incident.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{incident.reportedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(incident.reportedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewIncident(incident)}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Incident Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedIncident?.icon}</span>
              {selectedIncident?.category} - Incident #{selectedIncident?.id}
            </DialogTitle>
            <DialogDescription>Complete incident report details</DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(selectedIncident.status)} border`} variant="outline">
                  {selectedIncident.status}
                </Badge>
                <Badge variant="outline">{selectedIncident.priority} Priority</Badge>
                <span className="text-sm text-gray-500">Reported: {formatDate(selectedIncident.reportedAt)}</span>
              </div>

              {/* Images */}
              {selectedIncident.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Evidence Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedIncident.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Incident Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* Location and Reporter Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Location Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedIncident.location}</span>
                    </div>
                    <div className="text-gray-500">
                      Coordinates: {selectedIncident.coordinates.lat}, {selectedIncident.coordinates.lng}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Reporter Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedIncident.reportedBy.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedIncident.reportedBy.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {selectedIncident.reportedBy.phone}
                    </div>
                    <div>
                      <strong>CNIC:</strong> {selectedIncident.reportedBy.cnic}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
