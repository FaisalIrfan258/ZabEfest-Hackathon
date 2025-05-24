"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for nearby incidents
const mockIncidents = [
  {
    id: 1,
    category: "Water Dumping",
    description: "Industrial waste being dumped into the river near the bridge",
    location: { lat: 24.8607, lng: 67.0011, address: "Karachi River Bridge" },
    distance: "0.8 km",
    status: "Under Investigation",
    reportedBy: "Ahmad Ali",
    reportedAt: "2 hours ago",
    image: "/placeholder.svg?height=200&width=300",
    icon: "💧",
    color: "bg-blue-500",
  },
  {
    id: 2,
    category: "Air Pollution",
    description: "Heavy smoke emission from factory chimney causing breathing issues",
    location: { lat: 24.8647, lng: 67.0051, address: "Industrial Area Block 5" },
    distance: "1.2 km",
    status: "Resolved",
    reportedBy: "Fatima Khan",
    reportedAt: "1 day ago",
    image: "/placeholder.svg?height=200&width=300",
    icon: "🏭",
    color: "bg-gray-500",
  },
  {
    id: 3,
    category: "Sewage Leakage",
    description: "Major sewage overflow on main road causing health hazards",
    location: { lat: 24.8567, lng: 67.0091, address: "Main Street Block 3" },
    distance: "2.1 km",
    status: "In Progress",
    reportedBy: "Hassan Sheikh",
    reportedAt: "5 hours ago",
    image: "/placeholder.svg?height=200&width=300",
    icon: "🚰",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    category: "Illegal Construction",
    description: "Unauthorized building construction blocking drainage system",
    location: { lat: 24.8527, lng: 67.0131, address: "Residential Area Block 7" },
    distance: "3.5 km",
    status: "Pending",
    reportedBy: "Aisha Malik",
    reportedAt: "3 hours ago",
    image: "/placeholder.svg?height=200&width=300",
    icon: "🏗️",
    color: "bg-red-500",
  },
  {
    id: 5,
    category: "Noise Pollution",
    description: "Loud music and construction noise during night hours",
    location: { lat: 24.8487, lng: 67.0171, address: "Commercial Plaza Block 2" },
    distance: "4.2 km",
    status: "Under Investigation",
    reportedBy: "Omar Farooq",
    reportedAt: "6 hours ago",
    image: "/placeholder.svg?height=200&width=300",
    icon: "🔊",
    color: "bg-purple-500",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "Under Investigation":
      return <AlertTriangle className="h-4 w-4 text-blue-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Under Investigation":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function NearbyIncidentsMap() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [filter, setFilter] = useState("All")

  const filteredIncidents = filter === "All" ? mockIncidents : mockIncidents.filter((i) => i.status === filter)

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Incidents Map
          </CardTitle>
          <CardDescription>Environmental incidents within 5km radius of your location</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mock Map */}
          <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
              <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4 text-blue-600" />
                  <span>Your Location</span>
                </div>
              </div>

              {/* Incident Markers */}
              {filteredIncidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${incident.color} text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                  onClick={() => setSelectedIncident(incident)}
                >
                  <span className="text-lg">{incident.icon}</span>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow">
                <h4 className="font-semibold text-sm mb-2">Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Water Issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span>Air Pollution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Construction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Under Investigation", "In Progress", "Resolved"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4" onClick={() => setSelectedIncident(incident)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{incident.icon}</span>
                  <h3 className="font-semibold text-sm">{incident.category}</h3>
                </div>
                <Badge className={getStatusColor(incident.status)} variant="secondary">
                  {getStatusIcon(incident.status)}
                  <span className="ml-1">{incident.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{incident.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{incident.distance} away</span>
                <span>{incident.reportedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Incident Detail Modal */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedIncident?.icon}</span>
              {selectedIncident?.category}
            </DialogTitle>
            <DialogDescription>Incident Details</DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedIncident.status)} variant="secondary">
                  {getStatusIcon(selectedIncident.status)}
                  <span className="ml-1">{selectedIncident.status}</span>
                </Badge>
                <span className="text-sm text-gray-500">{selectedIncident.distance} away</span>
              </div>

              <img
                src={selectedIncident.image || "/placeholder.svg"}
                alt="Incident"
                className="w-full h-48 object-cover rounded-lg"
              />

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{selectedIncident.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-gray-700 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedIncident.location.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Reported by:</span>
                  <p className="text-gray-700">{selectedIncident.reportedBy}</p>
                </div>
                <div>
                  <span className="font-semibold">Reported:</span>
                  <p className="text-gray-700">{selectedIncident.reportedAt}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">Get Directions</Button>
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
