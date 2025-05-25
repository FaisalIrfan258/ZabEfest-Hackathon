"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, User, Clock, Phone, Mail, BadgeIcon as IdCard } from "lucide-react"

// Mock incidents with user data for map
const mapIncidents = [
  {
    id: 1,
    category: "Water Dumping",
    description: "Industrial waste being dumped into the river near the bridge causing severe water pollution",
    location: "Karachi River Bridge, Block 5",
    coordinates: { lat: 24.8607, lng: 67.0011 },
    reportedBy: {
      name: "Ahmad Ali",
      email: "ahmad.ali@email.com",
      phone: "03001234567",
      cnic: "4210112345678",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedAt: "2024-01-15T10:30:00Z",
    status: "Pending",
    priority: "High",
    icon: "💧",
    color: "bg-blue-500",
  },
  {
    id: 2,
    category: "Air Pollution",
    description: "Heavy smoke emission from factory chimney causing breathing issues in residential area",
    location: "Industrial Area, Block 3",
    coordinates: { lat: 24.8647, lng: 67.0051 },
    reportedBy: {
      name: "Fatima Khan",
      email: "fatima.khan@email.com",
      phone: "03009876543",
      cnic: "4210187654321",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedAt: "2024-01-15T08:15:00Z",
    status: "Under Investigation",
    priority: "Medium",
    icon: "🏭",
    color: "bg-gray-500",
  },
  {
    id: 3,
    category: "Sewage Leakage",
    description: "Major sewage overflow on main road creating health hazards for local residents",
    location: "Main Street, Block 7",
    coordinates: { lat: 24.8567, lng: 67.0091 },
    reportedBy: {
      name: "Hassan Sheikh",
      email: "hassan.sheikh@email.com",
      phone: "03007654321",
      cnic: "4210156789012",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedAt: "2024-01-14T16:45:00Z",
    status: "In Progress",
    priority: "High",
    icon: "🚰",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    category: "Noise Pollution",
    description: "Loud construction work during night hours violating noise regulations",
    location: "Commercial Plaza, Block 2",
    coordinates: { lat: 24.8487, lng: 67.0171 },
    reportedBy: {
      name: "Aisha Malik",
      email: "aisha.malik@email.com",
      phone: "03005432109",
      cnic: "4210143210987",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedAt: "2024-01-14T22:30:00Z",
    status: "Resolved",
    priority: "Low",
    icon: "🔊",
    color: "bg-purple-500",
  },
  {
    id: 5,
    category: "Illegal Construction",
    description: "Unauthorized building construction blocking public drainage system",
    location: "Residential Area, Block 8",
    coordinates: { lat: 24.8527, lng: 67.0131 },
    reportedBy: {
      name: "Omar Farooq",
      email: "omar.farooq@email.com",
      phone: "03008765432",
      cnic: "4210198765432",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    reportedAt: "2024-01-13T14:20:00Z",
    status: "Resolved",
    priority: "Medium",
    icon: "🏗️",
    color: "bg-red-500",
  },
]

export default function AdminMapPage() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  }

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

  const handleMarkerClick = (incident: any) => {
    setSelectedIncident(incident)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Interactive Incidents Map</h1>
        <p className="text-green-600 mt-2">
          View all reported incidents on an interactive map with detailed user information
        </p>
      </div>

      {/* Map Container */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Environmental Incidents Map
          </CardTitle>
          <CardDescription>Click on any user icon to view incident details and reporter information</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Interactive Map */}
          <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-[600px] overflow-hidden border border-gray-200">
            {/* Map Background */}
            <div className="absolute inset-0">
              {/* Grid pattern for map effect */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
                  {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>

              {/* Admin Location */}
              <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md border border-green-200">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  <span>Admin View Center</span>
                </div>
              </div>

              {/* Incident Markers */}
              {mapIncidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${25 + index * 12}%`,
                  }}
                  onClick={() => handleMarkerClick(incident)}
                >
                  {/* Category Icon with Status Ring */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden ${incident.color} flex items-center justify-center text-white font-bold hover:scale-110 transition-transform text-lg`}
                    >
                      {incident.icon}
                    </div>

                    {/* Status Indicator */}
                    <div
                      className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        incident.status === "Resolved"
                          ? "bg-green-500"
                          : incident.status === "In Progress"
                            ? "bg-blue-500"
                            : incident.status === "Under Investigation"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                    ></div>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {incident.reportedBy.name} - {incident.category}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                  </div>
                </div>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-sm mb-3 text-gray-900">Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Under Investigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Resolved</span>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button variant="outline" size="sm" className="bg-white">
                  +
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  -
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedIncident?.icon}</span>
              Incident Details - {selectedIncident?.category}
            </DialogTitle>
            <DialogDescription>Complete information about the incident and reporter</DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-6">
              {/* Status and Time */}
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(selectedIncident.status)} border`} variant="outline">
                  {selectedIncident.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {formatDate(selectedIncident.reportedAt)}
                </div>
              </div>

              {/* Reporter Information */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Reporter Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Name:</span>
                        <span>{selectedIncident.reportedBy.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Email:</span>
                        <span>{selectedIncident.reportedBy.email}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Phone:</span>
                        <span>{selectedIncident.reportedBy.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IdCard className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">CNIC:</span>
                        <span>{selectedIncident.reportedBy.cnic}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Incident Information */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Incident Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2">{selectedIncident.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Priority:</span>
                    <span className="ml-2">{selectedIncident.priority}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600">{selectedIncident.location}</p>
                      <p className="text-sm text-gray-500">
                        Coordinates: {selectedIncident.coordinates.lat}, {selectedIncident.coordinates.lng}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">Description</h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Contact Reporter
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                  View Full Report
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
