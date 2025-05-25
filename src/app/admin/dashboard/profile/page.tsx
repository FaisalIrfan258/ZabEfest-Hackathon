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
import { Shield, Save, Edit } from "lucide-react"

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

    // For phone field, only allow numbers
    if (name === "phoneNo") {
      const numericValue = value.replace(/\D/g, "")
      if (numericValue.length <= 15) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    // Validation
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
      // Update admin data in localStorage
      const updatedAdmin = { ...admin, ...formData }
      localStorage.setItem("admin", JSON.stringify(updatedAdmin))
      setAdmin(updatedAdmin)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
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
    return <div>Loading...</div>
  }

  const displayName = admin.fullName || admin.email || "Admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Admin Profile</h1>
        <p className="text-green-600 mt-2">Manage your admin account information and settings</p>
      </div>

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                {displayName
                  .split(" ")
                  .map((n:any) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl text-green-800">{displayName}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                System Administrator
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center text-sm text-green-600">
              <p>Member since: {admin.registeredAt ? new Date(admin.registeredAt).toLocaleDateString() : "N/A"}</p>
              <p>Last login: {admin.loginTime ? new Date(admin.loginTime).toLocaleDateString() : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800">Profile Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your admin account details and contact information
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-green-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-gray-50" : "border-gray-300 focus:border-green-500 focus:ring-green-500"} ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.fullName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-gray-50" : "border-gray-300 focus:border-green-500 focus:ring-green-500"} ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNo" className="text-green-700">
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
                  className={`${!isEditing ? "bg-gray-50" : "border-gray-300 focus:border-green-500 focus:ring-green-500"} ${errors.phoneNo ? "border-red-500" : ""}`}
                />
                {errors.phoneNo && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.phoneNo}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-gray-500">Enter 10-15 digits</p>
              </div>

              <div className="space-y-2">
                <Label className="text-green-700">Role</Label>
                <Input value="System Administrator" disabled className="bg-gray-50" />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="border-gray-300">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Security Settings</CardTitle>
          <CardDescription className="text-gray-600">
            Manage your account security and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-green-800">Password</h4>
              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-green-800">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-green-800">Login Sessions</h4>
              <p className="text-sm text-gray-600">Manage your active login sessions</p>
            </div>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              View Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
