"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    cnic: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{13}$/
    return cnicRegex.test(cnic)
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    if (!formData.cnic) {
      newErrors.cnic = "CNIC is required"
    } else if (!validateCNIC(formData.cnic)) {
      newErrors.cnic = "CNIC must be exactly 13 digits"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Store user data in localStorage for demo purposes
      const userData = {
        username: formData.username,
        cnic: formData.cnic,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("user", JSON.stringify(userData))

      // Use Next.js router for proper navigation
      window.location.replace("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.username}</AlertDescription>
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
                placeholder="Enter your password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
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
              />
              {errors.cnic && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.cnic}</AlertDescription>
                </Alert>
              )}
              <p className="text-sm text-gray-500">Enter exactly 13 digits</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="flex flex-col space-y-2 text-sm text-center">
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 underline">
                Forgot Password?
              </Link>
              <div>
                {"Don't have an account? "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 underline font-medium">
                  Sign up here
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
