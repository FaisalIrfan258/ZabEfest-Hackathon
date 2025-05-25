"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { registerUser } from "@/lib/auth"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    location: "",
    cnic: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  
  const router = useRouter()
  const { login } = useAuth()

  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{13}$/
    return cnicRegex.test(cnic)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For CNIC field, only allow numbers
    if (name === "cnic") {
      const numericValue = value.replace(/\D/g, "")
      if (numericValue.length <= 13) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (generalError) {
      setGeneralError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.cnic) {
      newErrors.cnic = "CNIC is required"
    } else if (!validateCNIC(formData.cnic)) {
      newErrors.cnic = "CNIC must be exactly 13 digits"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      setGeneralError("")
      
      try {
        // Call register API
        const response = await registerUser(formData)
        
        if (response.success) {
          // Set auth context
          login(response.data.user, response.data.token)
          
          // Navigate to dashboard
          router.push("/dashboard")
        } else {
          setGeneralError(response.message || "Failed to register. Please try again.")
        }
      } catch (error) {
        console.error("Registration error:", error)
        setGeneralError(error instanceof Error ? error.message : "Failed to register. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-green-200">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-green-800">Create Account</CardTitle>
          <CardDescription className="text-center">Join our community to track and report environmental issues</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {generalError && (
              <Alert variant="destructive">
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className={errors.username ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.username && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.username}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC (13 digits)</Label>
              <Input
                id="cnic"
                name="cnic"
                type="text"
                value={formData.cnic}
                onChange={handleInputChange}
                placeholder="1234567890123"
                maxLength={13}
                className={errors.cnic ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.cnic && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.cnic}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-gray-500">Enter exactly 13 digits</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className={errors.location ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.location && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.location}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : "Sign Up"}
            </Button>

            <div className="text-sm text-center">
              {"Already have an account? "}
              <Link href="/login" className="text-green-600 hover:text-green-800 underline font-medium">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
