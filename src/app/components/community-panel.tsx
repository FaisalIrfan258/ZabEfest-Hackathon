"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, MapPin, Calendar, MessageCircle, CheckCircle, AlertTriangle } from "lucide-react"

// Mock community data
const communityMembers = [
  { id: 1, name: "Ahmad Ali", avatar: "/placeholder.svg?height=40&width=40", distance: "0.2 km", status: "online" },
  { id: 2, name: "Fatima Khan", avatar: "/placeholder.svg?height=40&width=40", distance: "0.5 km", status: "offline" },
  { id: 3, name: "Hassan Sheikh", avatar: "/placeholder.svg?height=40&width=40", distance: "0.8 km", status: "online" },
  { id: 4, name: "Aisha Malik", avatar: "/placeholder.svg?height=40&width=40", distance: "1.2 km", status: "online" },
  { id: 5, name: "Omar Farooq", avatar: "/placeholder.svg?height=40&width=40", distance: "1.5 km", status: "offline" },
]

const communityPosts = [
  {
    id: 1,
    type: "incident",
    author: "Ahmad Ali",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "2 hours ago",
    title: "Water Dumping Reported",
    content: "Industrial waste being dumped near the river bridge. Immediate action needed!",
    image: "/placeholder.svg?height=200&width=300",
    location: "Karachi River Bridge",
    status: "Under Investigation",
    likes: 12,
    comments: 5,
  },
  {
    id: 2,
    type: "event",
    author: "Fatima Khan",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "5 hours ago",
    title: "Community Tree Plantation Drive",
    content: "Join us this Saturday for a tree plantation drive in our neighborhood park. Let's make our area greener!",
    image: "/placeholder.svg?height=200&width=300",
    location: "Community Park Block 5",
    date: "Saturday, 2 PM",
    participants: 23,
    likes: 18,
    comments: 8,
  },
  {
    id: 3,
    type: "resolved",
    author: "Hassan Sheikh",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "1 day ago",
    title: "Sewage Issue Resolved ✅",
    content: "Great news! The sewage leakage on Main Street has been fixed. Thanks to everyone who reported it.",
    location: "Main Street Block 3",
    status: "Resolved",
    likes: 25,
    comments: 12,
  },
]

export default function CommunityPanel() {
  const [newPost, setNewPost] = useState({ title: "", content: "", location: "" })
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)

  const handleCreatePost = () => {
    // Handle post creation
    console.log("Creating post:", newPost)
    setNewPost({ title: "", content: "", location: "" })
    setShowNewPostDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Block 5 Community
              </CardTitle>
              <CardDescription>
                Environmental monitoring group • 5km radius • {communityMembers.length} members
              </CardDescription>
            </div>
            <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Community Post</DialogTitle>
                  <DialogDescription>Share an event, incident, or update with your community</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="What's happening in your community?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                  <Input
                    placeholder="Location (optional)"
                    value={newPost.location}
                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost}>Post</Button>
                    <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {/* Resolution Banner */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Issue Resolved!</h3>
                  <p className="text-sm text-green-700">
                    The sewage leakage on Main Street has been successfully fixed by the municipal team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          {communityPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-sm text-gray-500">{post.time}</span>
                      {post.type === "incident" && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Incident
                        </Badge>
                      )}
                      {post.type === "event" && (
                        <Badge variant="secondary" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Event
                        </Badge>
                      )}
                      {post.type === "resolved" && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-3">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {post.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {post.location}
                        </div>
                      )}
                      {post.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </div>
                      )}
                      {post.participants && <span>{post.participants} participants</span>}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <Button variant="ghost" size="sm">
                        👍 {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>Neighbors within 5km radius</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {communityMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.distance} away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          member.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-500">{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Community Events</CardTitle>
              <CardDescription>Environmental activities and community gatherings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Tree Plantation Drive</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Join us for a community tree plantation drive to make our neighborhood greener
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>📅 Saturday, 2:00 PM</span>
                        <span>📍 Community Park Block 5</span>
                        <span>👥 23 participants</span>
                      </div>
                    </div>
                    <Button size="sm">Join Event</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Cleanup Campaign</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Monthly neighborhood cleanup to maintain environmental hygiene
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>📅 Next Sunday, 8:00 AM</span>
                        <span>📍 Various locations</span>
                        <span>👥 15 participants</span>
                      </div>
                    </div>
                    <Button size="sm">Join Event</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
