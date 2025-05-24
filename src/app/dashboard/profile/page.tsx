"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Edit, Save, X } from "lucide-react"

interface UserData {
  name?: string
  username?: string
  email?: string
  cnic?: string
  address?: string
  mobile?: string
  loginTime?: string
  signupTime?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<UserData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setEditedUser(parsedUser)
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^\d{10,15}$/
    return mobileRegex.test(mobile)
  }

  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{13}$/
    return cnicRegex.test(cnic)
  }

  const handleInputChange = (field: string, value: string) => {
    // For CNIC field, only allow numbers
    if (field === "cnic") {
      const numericValue = value.replace(/\D/g, "")
      if (numericValue.length <= 13) {
        setEditedUser((prev) => ({ ...prev, [field]: numericValue }))
      }
    }
    // For mobile field, only allow numbers
    else if (field === "mobile") {
      const numericValue = value.replace(/\D/g, "")
      if (numericValue.length <= 15) {
        setEditedUser((prev) => ({ ...prev, [field]: numericValue }))
      }
    } else {
      setEditedUser((prev) => ({ ...prev, [field]: value }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    // Validation
    if (!editedUser.name?.trim() && !editedUser.username?.trim()) {
      newErrors.name = "Name is required"
    }

    if (editedUser.email && !validateEmail(editedUser.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (editedUser.cnic && !validateCNIC(editedUser.cnic)) {
      newErrors.cnic = "CNIC must be exactly 13 digits"
    }

    if (editedUser.mobile && !validateMobile(editedUser.mobile)) {
      newErrors.mobile = "Mobile number must be 10-15 digits"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Update localStorage
      const updatedUser = { ...user, ...editedUser }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleCancel = () => {
    setEditedUser(user || {})
    setIsEditing(false)
    setErrors({})
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAccountStatus = () => {
    if (user?.email && user?.mobile && user?.address) {
      return { status: "Complete", color: "bg-green-500" }
    } else if (user?.email || user?.mobile) {
      return { status: "Partial", color: "bg-yellow-500" }
    } else {
      return { status: "Basic", color: "bg-blue-500" }
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayName = user.name || user.username || "User"
  const accountStatus = getAccountStatus()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and settings</p>
        </div>
        <Badge className={`${accountStatus.color} text-white`}>{accountStatus.status} Profile</Badge>
      </div>

      {successMessage && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-gray-600">{user.email || "No email provided"}</p>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="outline">{user.signupTime ? "Registered User" : "Login User"}</Badge>
                <Badge className={accountStatus.color}>{accountStatus.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>Your account details and contact information</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              {isEditing ? (
                <Input
                  value={editedUser.name || editedUser.username || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
              ) : (
                <Input value={displayName} readOnly className="bg-gray-50" />
              )}
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* CNIC Field */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>CNIC</span>
              </Label>
              {isEditing ? (
                <Input
                  value={editedUser.cnic || ""}
                  onChange={(e) => handleInputChange("cnic", e.target.value)}
                  placeholder="1234567890123"
                  maxLength={13}
                  className={errors.cnic ? "border-red-500" : ""}
                />
              ) : (
                <Input value={user.cnic || "Not provided"} readOnly className="bg-gray-50" />
              )}
              {errors.cnic && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.cnic}</AlertDescription>
                </Alert>
              )}
              {isEditing && <p className="text-sm text-gray-500">Enter exactly 13 digits</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedUser.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? "border-red-500" : ""}
                />
              ) : (
                <Input value={user.email || "Not provided"} readOnly className="bg-gray-50" />
              )}
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Mobile Field */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Mobile Number</span>
              </Label>
              {isEditing ? (
                <Input
                  value={editedUser.mobile || ""}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="03001234567"
                  maxLength={15}
                  className={errors.mobile ? "border-red-500" : ""}
                />
              ) : (
                <Input value={user.mobile || "Not provided"} readOnly className="bg-gray-50" />
              )}
              {errors.mobile && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.mobile}</AlertDescription>
                </Alert>
              )}
              {isEditing && <p className="text-sm text-gray-500">Enter 10-15 digits</p>}
            </div>
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </Label>
            {isEditing ? (
              <Textarea
                value={editedUser.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your complete address"
                className="min-h-[80px]"
              />
            ) : (
              <Textarea value={user.address || "Not provided"} readOnly className="bg-gray-50 min-h-[80px]" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <CardDescription>Account creation and activity details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Input value={user.signupTime ? "Registered Account" : "Login Account"} readOnly className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label>Profile Completion</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${accountStatus.color}`}
                    style={{
                      width: `${
                        accountStatus.status === "Complete" ? 100 : accountStatus.status === "Partial" ? 60 : 30
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {accountStatus.status === "Complete" ? "100%" : accountStatus.status === "Partial" ? "60%" : "30%"}
                </span>
              </div>
            </div>

            {user.signupTime && (
              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Input value={formatDate(user.signupTime)} readOnly className="bg-gray-50" />
              </div>
            )}

            {user.loginTime && (
              <div className="space-y-2">
                <Label>Last Login</Label>
                <Input value={formatDate(user.loginTime)} readOnly className="bg-gray-50" />
              </div>
            )}
          </div>

          <Separator />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Complete Your Profile</h4>
            <p className="text-blue-700 text-sm mb-3">
              Complete your profile to unlock all features and improve your experience.
            </p>
            <div className="space-y-1 text-sm">
              {!user.email && <p className="text-blue-600">• Add your email address</p>}
              {!user.mobile && <p className="text-blue-600">• Add your mobile number</p>}
              {!user.address && <p className="text-blue-600">• Add your address</p>}
              {user.email && user.mobile && user.address && (
                <p className="text-green-600 font-medium">✓ Your profile is complete!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Download Data</h4>
              <p className="text-sm text-gray-600">Download a copy of your account data</p>
            </div>
            <Button variant="outline">Download</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
