"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Save,
  Edit,
  Camera,
  Lock,
  Smartphone,
  Clock,
  Calendar,
  Mail,
  Phone,
  User,
  Settings,
} from "lucide-react"

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (adminData) {
      const parsedAdmin = JSON.parse(adminData)
      setAdmin(parsedAdmin)
      setFormData({
        fullName: parsedAdmin.fullName || "",
        email: parsedAdmin.email || "",
        phoneNo: parsedAdmin.phoneNo || "",
      })
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10,15}$/
    return phoneRegex.test(phone)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "phoneNo") {
      const numericValue = value.replace(/\D/g, "")
      if (numericValue.length <= 15) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phoneNo && !validatePhone(formData.phoneNo)) {
      newErrors.phoneNo = "Phone number must be 10-15 digits"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const updatedAdmin = { ...admin, ...formData }
      localStorage.setItem("admin", JSON.stringify(updatedAdmin))
      setAdmin(updatedAdmin)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: admin?.fullName || "",
      email: admin?.email || "",
      phoneNo: admin?.phoneNo || "",
    })
    setIsEditing(false)
    setErrors({})
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-green-600 mt-4">Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayName = admin.fullName || admin.email || "Admin"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Admin Profile</h1>
          <p className="text-green-600 text-lg">Manage your account information and security settings</p>
        </div>

        {successMessage && (
          <Alert className="border-green-200 bg-green-50 max-w-2xl mx-auto">
            <AlertDescription className="text-green-800 font-medium">{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="h-32 w-32 border-4 border-green-200 shadow-lg">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white text-3xl font-bold">
                        {displayName
                          .split(" ")
                          .map((n:any) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-green-800 break-words text-center px-4 leading-tight">
                      {displayName}
                    </h2>
                    <Badge className="mt-2 bg-green-100 text-green-700 border-green-200 px-3 py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      System Administrator
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Member since: {admin.registeredAt ? new Date(admin.registeredAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last login: {admin.loginTime ? new Date(admin.loginTime).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reports</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    1,247
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resolved Issues</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    1,156
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Users</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    342
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Profile Information */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                      <User className="h-6 w-6" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Update your admin account details and contact information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700 shadow-lg">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-green-700 font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`h-12 ${!isEditing ? "bg-gray-50 border-gray-200" : "border-green-300 focus:border-green-500 focus:ring-green-500"} ${errors.fullName ? "border-red-500" : ""}`}
                    />
                    {errors.fullName && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">{errors.fullName}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-700 font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`h-12 ${!isEditing ? "bg-gray-50 border-gray-200" : "border-green-300 focus:border-green-500 focus:ring-green-500"} ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNo" className="text-green-700 font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="03001234567"
                      maxLength={15}
                      className={`h-12 ${!isEditing ? "bg-gray-50 border-gray-200" : "border-green-300 focus:border-green-500 focus:ring-green-500"} ${errors.phoneNo ? "border-red-500" : ""}`}
                    />
                    {errors.phoneNo && (
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">{errors.phoneNo}</AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-gray-500">Enter 10-15 digits</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-700 font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                    </Label>
                    <Input value="System Administrator" disabled className="bg-gray-50 border-gray-200 h-12" />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 shadow-lg">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-50">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                  <Lock className="h-6 w-6" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Manage your account security and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-6 border border-green-200 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Password</h4>
                        <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-6 border border-green-200 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Smartphone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-6 border border-green-200 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Settings className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Login Sessions</h4>
                        <p className="text-sm text-gray-600">Manage your active login sessions</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
