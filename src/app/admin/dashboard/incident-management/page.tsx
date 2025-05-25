"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Clock, User, ArrowRight, Timer, MessageSquare } from "lucide-react"

// TypeScript interfaces
interface Incident {
  id: number
  category: string
  description: string
  location: string
  reportedBy: string
  reportedAt: string
  priority: "High" | "Medium" | "Low"
  icon: string
  estimatedTime: string | null
}

interface IncidentsState {
  verify: Incident[]
  inprogress: Incident[]
  resolve: Incident[]
}

// Mock incidents data for kanban board
const initialIncidents = {
  verify: [
    {
      id: 1,
      category: "Water Dumping",
      description: "Industrial waste being dumped into the river near the bridge",
      location: "Karachi River Bridge, Block 5",
      reportedBy: "Ahmad Ali",
      reportedAt: "2024-01-15T10:30:00Z",
      priority: "High",
      icon: "💧",
      estimatedTime: null,
    },
    {
      id: 6,
      category: "Deforestation",
      description: "Illegal cutting of trees in protected area",
      location: "Green Park, Block 4",
      reportedBy: "Sara Ahmed",
      reportedAt: "2024-01-13T09:15:00Z",
      priority: "High",
      icon: "🌳",
      estimatedTime: null,
    },
  ],
  inprogress: [
    {
      id: 2,
      category: "Air Pollution",
      description: "Heavy smoke emission from factory chimney causing breathing issues",
      location: "Industrial Area, Block 3",
      reportedBy: "Fatima Khan",
      reportedAt: "2024-01-15T08:15:00Z",
      priority: "Medium",
      icon: "🏭",
      estimatedTime: "3-5 days",
    },
    {
      id: 3,
      category: "Sewage Leakage",
      description: "Major sewage overflow on main road creating health hazards",
      location: "Main Street, Block 7",
      reportedBy: "Hassan Sheikh",
      reportedAt: "2024-01-14T16:45:00Z",
      priority: "High",
      icon: "🚰",
      estimatedTime: "1-2 days",
    },
  ],
  resolve: [
    {
      id: 4,
      category: "Noise Pollution",
      description: "Loud construction work during night hours violating noise regulations",
      location: "Commercial Plaza, Block 2",
      reportedBy: "Aisha Malik",
      reportedAt: "2024-01-14T22:30:00Z",
      priority: "Low",
      icon: "🔊",
      estimatedTime: "Completed",
    },
    {
      id: 5,
      category: "Illegal Construction",
      description: "Unauthorized building construction blocking public drainage system",
      location: "Residential Area, Block 8",
      reportedBy: "Omar Farooq",
      reportedAt: "2024-01-13T14:20:00Z",
      priority: "Medium",
      icon: "🏗️",
      estimatedTime: "Completed",
    },
  ],
}

export default function IncidentManagementPage() {
  const [incidents, setIncidents] = useState<IncidentsState>(initialIncidents)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState("")
  const [notes, setNotes] = useState("")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const moveIncident = (incidentId: number, fromColumn: keyof IncidentsState, toColumn: keyof IncidentsState) => {
    setIncidents((prev) => {
      const newIncidents = { ...prev }
      const incidentIndex = newIncidents[fromColumn].findIndex((incident) => incident.id === incidentId)

      if (incidentIndex !== -1) {
        const [incident] = newIncidents[fromColumn].splice(incidentIndex, 1)
        newIncidents[toColumn].push(incident)
      }

      return newIncidents
    })
  }

  const handleUpdateEstimate = (incidentId: number, estimate: string) => {
    setIncidents((prev) => {
      const newIncidents = { ...prev }

      // Find and update the incident in any column
      Object.keys(newIncidents).forEach((column) => {
        const columnKey = column as keyof IncidentsState
        const incidentIndex = newIncidents[columnKey].findIndex((incident) => incident.id === incidentId)
        if (incidentIndex !== -1) {
          newIncidents[columnKey][incidentIndex].estimatedTime = estimate
        }
      })

      return newIncidents
    })
  }

  const openIncidentModal = (incident: Incident) => {
    setSelectedIncident(incident)
    setEstimatedTime(incident.estimatedTime || "")
    setIsModalOpen(true)
  }

  const handleSaveEstimate = () => {
    if (selectedIncident) {
      handleUpdateEstimate(selectedIncident.id, estimatedTime)
      setIsModalOpen(false)
    }
  }

  const columns = [
    {
      id: "verify",
      title: "Verify",
      description: "New incidents awaiting verification",
      color: "border-red-200 bg-red-50",
      headerColor: "bg-red-100 text-red-800",
      count: incidents.verify.length,
    },
    {
      id: "inprogress",
      title: "In Progress",
      description: "Incidents currently being processed",
      color: "border-blue-200 bg-blue-50",
      headerColor: "bg-blue-100 text-blue-800",
      count: incidents.inprogress.length,
    },
    {
      id: "resolve",
      title: "Resolved",
      description: "Completed incidents",
      color: "border-green-200 bg-green-50",
      headerColor: "bg-green-100 text-green-800",
      count: incidents.resolve.length,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Incident Management</h1>
        <p className="text-gray-600 mt-2">
          Manage incident workflow from verification to resolution with estimated timelines
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className={`${column.color} border-2`}>
            <CardHeader className={`${column.headerColor} rounded-t-lg`}>
              <CardTitle className="flex items-center justify-between">
                <span>{column.title}</span>
                <Badge variant="secondary" className="bg-white text-gray-700">
                  {column.count}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600">{column.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 min-h-[500px]">
              {incidents[column.id as keyof IncidentsState].map((incident: Incident) => (
                <Card
                  key={incident.id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openIncidentModal(incident)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{incident.icon}</span>
                          <h4 className="font-semibold text-sm text-gray-900">{incident.category}</h4>
                        </div>
                        <Badge className={`${getPriorityColor(incident.priority)} border text-xs`} variant="outline">
                          {incident.priority}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-600 line-clamp-2">{incident.description}</p>

                      {/* Details */}
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{incident.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{incident.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(incident.reportedAt)}</span>
                        </div>
                        {incident.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            <span className="font-medium text-blue-600">{incident.estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 pt-2 border-t border-gray-100">
                        {column.id === "verify" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs h-7 border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveIncident(incident.id, "verify", "inprogress")
                            }}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Start Work
                          </Button>
                        )}
                        {column.id === "inprogress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs h-7 border-green-200 text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveIncident(incident.id, "inprogress", "resolve")
                            }}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Mark Resolved
                          </Button>
                        )}
                        {column.id === "resolve" && (
                          <Badge
                            variant="outline"
                            className="flex-1 justify-center text-xs h-7 bg-green-100 text-green-800 border-green-200"
                          >
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {incidents[column.id as keyof IncidentsState].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-sm">No incidents in this stage</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Incident Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedIncident?.icon}</span>
              Manage Incident - {selectedIncident?.category}
            </DialogTitle>
            <DialogDescription>Update incident status and estimated resolution time</DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-6">
              {/* Incident Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <Badge className={`${getPriorityColor(selectedIncident.priority)} border mt-1`} variant="outline">
                    {selectedIncident.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Reported By</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedIncident.reportedBy}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedIncident.location}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm text-gray-900 mt-2 p-3 bg-gray-50 rounded-lg">{selectedIncident.description}</p>
              </div>

              {/* Estimated Time */}
              <div>
                <Label htmlFor="estimatedTime" className="text-sm font-medium text-gray-700">
                  Estimated Resolution Time
                </Label>
                <Input
                  id="estimatedTime"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="e.g., 2-3 days, 1 week, etc."
                  className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Provide an estimated timeframe for resolution</p>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the incident or resolution plan..."
                  className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSaveEstimate} className="bg-green-600 hover:bg-green-700">
                  <Timer className="h-4 w-4 mr-2" />
                  Update Estimate
                </Button>
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Reporter
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
