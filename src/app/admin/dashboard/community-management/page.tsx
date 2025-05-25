"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Users, Plus, Check, X, UserPlus, Settings, Eye } from "lucide-react"

// Mock communities data
const mockCommunities = [
  {
    id: 1,
    name: "Green Block 5 Initiative",
    description: "Community focused on environmental protection in Block 5 area",
    memberCount: 45,
    category: "Environmental",
    status: "Active",
    createdAt: "2024-01-10",
    admin: "Ahmad Ali",
  },
  {
    id: 2,
    name: "Clean Air Advocates",
    description: "Fighting air pollution and promoting clean air initiatives",
    memberCount: 32,
    category: "Air Quality",
    status: "Active",
    createdAt: "2024-01-08",
    admin: "Fatima Khan",
  },
  {
    id: 3,
    name: "Water Conservation Group",
    description: "Promoting water conservation and preventing water pollution",
    memberCount: 28,
    category: "Water",
    status: "Pending",
    createdAt: "2024-01-15",
    admin: "Hassan Sheikh",
  },
]

// Mock join requests
const mockJoinRequests = [
  {
    id: 1,
    user: {
      name: "Sara Ahmed",
      email: "sara.ahmed@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    community: "Green Block 5 Initiative",
    requestedAt: "2024-01-16T10:30:00Z",
    message: "I'm passionate about environmental protection and would love to contribute to this community.",
  },
  {
    id: 2,
    user: {
      name: "Omar Farooq",
      email: "omar.farooq@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    community: "Clean Air Advocates",
    requestedAt: "2024-01-16T08:15:00Z",
    message: "I have experience in air quality monitoring and want to help the community.",
  },
  {
    id: 3,
    user: {
      name: "Aisha Malik",
      email: "aisha.malik@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    community: "Water Conservation Group",
    requestedAt: "2024-01-15T16:45:00Z",
    message: "I'm interested in water conservation efforts in our area.",
  },
]

export default function CommunityManagementPage() {
  const [communities, setCommunities] = useState(mockCommunities)
  const [joinRequests, setJoinRequests] = useState(mockJoinRequests)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    category: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCreateCommunity = () => {
    if (newCommunity.name && newCommunity.description && newCommunity.category) {
      const community = {
        id: communities.length + 1,
        ...newCommunity,
        memberCount: 1,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        admin: "Admin",
      }
      setCommunities([...communities, community])
      setNewCommunity({ name: "", description: "", category: "" })
      setIsCreateModalOpen(false)
    }
  }

  const handleJoinRequest = (requestId: number, action: "approve" | "reject") => {
    setJoinRequests(joinRequests.filter((request) => request.id !== requestId))
    // In a real app, you would also update the community member count if approved
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const stats = {
    totalCommunities: communities.length,
    activeCommunities: communities.filter((c) => c.status === "Active").length,
    pendingRequests: joinRequests.length,
    totalMembers: communities.reduce((sum, c) => sum + c.memberCount, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Community Management</h1>
        <p className="text-green-600 mt-2">
          Create and manage environmental communities, handle join requests, and foster collaboration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Communities</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.totalCommunities}</div>
            <p className="text-xs text-green-600">Active groups</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Communities</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.activeCommunities}</div>
            <p className="text-xs text-green-600">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Pending Requests</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
            <p className="text-xs text-green-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.totalMembers}</div>
            <p className="text-xs text-green-600">Across all communities</p>
          </CardContent>
        </Card>
      </div>

      {/* Join Requests */}
      {joinRequests.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Pending Join Requests</CardTitle>
                <CardDescription className="text-green-600">Review and approve community join requests</CardDescription>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {joinRequests.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {joinRequests.map((request) => (
                <Card key={request.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {request.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-green-800">{request.user.name}</h4>
                          <span className="text-sm text-green-600">wants to join</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {request.community}
                          </Badge>
                        </div>
                        <p className="text-sm text-green-600 mb-2">{request.user.email}</p>
                        <p className="text-sm text-gray-700 mb-3">{request.message}</p>
                        <p className="text-xs text-gray-500">Requested: {formatDate(request.requestedAt)}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleJoinRequest(request.id, "approve")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleJoinRequest(request.id, "reject")}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communities List */}
      <Card className="border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Environmental Communities</CardTitle>
              <CardDescription className="text-green-600">
                Manage existing communities and create new ones
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communities.map((community) => (
              <Card key={community.id} className="border border-gray-200 hover:border-green-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-green-800">{community.name}</h3>
                        <Badge className={`${getStatusColor(community.status)} border text-xs`} variant="outline">
                          {community.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-green-600 mb-2">{community.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium text-green-700">Members:</span> {community.memberCount}
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Category:</span> {community.category}
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Admin:</span> {community.admin}
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Created:</span> {formatDate(community.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Community Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-800">Create New Community</DialogTitle>
            <DialogDescription className="text-green-600">
              Create a new environmental community for users to join and collaborate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-green-700">
                Community Name
              </Label>
              <Input
                id="name"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                placeholder="Enter community name"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-green-700">
                Category
              </Label>
              <Select
                value={newCommunity.category}
                onValueChange={(value) => setNewCommunity({ ...newCommunity, category: value })}
              >
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                  <SelectItem value="Air Quality">Air Quality</SelectItem>
                  <SelectItem value="Water">Water Conservation</SelectItem>
                  <SelectItem value="Waste Management">Waste Management</SelectItem>
                  <SelectItem value="Green Energy">Green Energy</SelectItem>
                  <SelectItem value="Wildlife">Wildlife Protection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-green-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={newCommunity.description}
                onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                placeholder="Describe the community's purpose and goals"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateCommunity} className="flex-1 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="border-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
