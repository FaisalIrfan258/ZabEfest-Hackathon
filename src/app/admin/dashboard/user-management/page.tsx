"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Calendar, Search, Filter, MoreVertical, Eye, Ban, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Ahmad Ali",
    email: "ahmad.ali@email.com",
    phone: "03001234567",
    cnic: "4210112345678",
    address: "Block 5, Karachi",
    joinedAt: "2024-01-10T10:30:00Z",
    lastActive: "2024-01-15T14:20:00Z",
    status: "Active",
    reportsCount: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Fatima Khan",
    email: "fatima.khan@email.com",
    phone: "03009876543",
    cnic: "4210187654321",
    address: "Block 3, Karachi",
    joinedAt: "2024-01-08T15:45:00Z",
    lastActive: "2024-01-15T09:10:00Z",
    status: "Active",
    reportsCount: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Hassan Sheikh",
    email: "hassan.sheikh@email.com",
    phone: "03007654321",
    cnic: "4210156789012",
    address: "Block 7, Karachi",
    joinedAt: "2024-01-05T12:20:00Z",
    lastActive: "2024-01-14T18:30:00Z",
    status: "Active",
    reportsCount: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Aisha Malik",
    email: "aisha.malik@email.com",
    phone: "03005432109",
    cnic: "4210143210987",
    address: "Block 2, Karachi",
    joinedAt: "2024-01-03T08:15:00Z",
    lastActive: "2024-01-12T16:45:00Z",
    status: "Inactive",
    reportsCount: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Omar Farooq",
    email: "omar.farooq@email.com",
    phone: "03008765432",
    cnic: "4210198765432",
    address: "Block 8, Karachi",
    joinedAt: "2024-01-01T11:30:00Z",
    lastActive: "2024-01-13T20:15:00Z",
    status: "Suspended",
    reportsCount: 1,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const statusOptions = ["All Status", "Active", "Inactive", "Suspended"]

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Suspended":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "All Status" || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleUserAction = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`)
    // Handle user actions (suspend, activate, etc.)
  }

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "Active").length,
    inactive: mockUsers.filter((u) => u.status === "Inactive").length,
    suspended: mockUsers.filter((u) => u.status === "Suspended").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">User Management</h1>
        <p className="text-green-600 mt-2">
          Manage registered users, view their activity, and monitor their incident reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Users</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Inactive Users</CardTitle>
            <User className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
            <p className="text-xs text-gray-500">Not recently active</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <p className="text-xs text-gray-500">Suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Filter className="h-5 w-5" />
            Search & Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredUsers.length} of {mockUsers.length} users
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Registered Users</CardTitle>
          <CardDescription className="text-gray-600">Manage user accounts and monitor their activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border border-gray-200 hover:border-green-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <Badge className={`${getStatusColor(user.status)} border text-xs`} variant="outline">
                          {user.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{user.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Joined: {formatDate(user.joinedAt).split(" ")[0]}</span>
                        </div>
                        <div>
                          <span>Last active: {getTimeAgo(user.lastActive)}</span>
                        </div>
                        <div>
                          <span>{user.reportsCount} reports</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
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
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "contact")}>
                            Contact User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "reports")}>
                            Edit Reports
                          </DropdownMenuItem>
                          {user.status === "Active" && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, "suspend")}
                              className="text-red-600"
                            >
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          {user.status === "Suspended" && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, "activate")}
                              className="text-green-600"
                            >
                              Activate User
                            </DropdownMenuItem>
                          )}
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

      {/* User Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details - {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>Complete user information and activity summary</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Overview */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                    <Badge className={`${getStatusColor(selectedUser.status)} border`} variant="outline">
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <p className="text-xs text-gray-500">
                    Member since {formatDate(selectedUser.joinedAt).split(" ")[0]}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span>{selectedUser.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">CNIC:</span>
                      <span>{selectedUser.cnic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Address:</span>
                      <span>{selectedUser.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Activity Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{selectedUser.reportsCount}</div>
                    <div className="text-sm text-gray-600">Reports Submitted</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{getTimeAgo(selectedUser.lastActive)}</div>
                    <div className="text-sm text-gray-600">Last Active</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-600">
                      {Math.floor(
                        (new Date().getTime() - new Date(selectedUser.joinedAt).getTime()) / (1000 * 60 * 60 * 24),
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Days as Member</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact User
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                  View Reports
                </Button>
                {selectedUser.status === "Active" ? (
                  <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend User
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
