"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminSignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

    if (!formData.phoneNo) {
      newErrors.phoneNo = "Phone number is required"
    } else if (!validatePhone(formData.phoneNo)) {
      newErrors.phoneNo = "Phone number must be 10-15 digits"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Store admin data in localStorage for demo purposes
      localStorage.setItem(
        "admin",
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNo: formData.phoneNo,
          role: "admin",
          registeredAt: new Date().toISOString(),
        }),
      )

      // Redirect to admin dashboard
      window.location.href = "/admin/dashboard"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-green-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Admin Registration</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Create your admin account for Eco Tracker
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.fullName ? "border-red-500" : ""}`}
              />
              {errors.fullName && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.fullName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo" className="text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                type="text"
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder="03001234567"
                maxLength={15}
                className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.phoneNo ? "border-red-500" : ""}`}
              />
              {errors.phoneNo && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.phoneNo}</AlertDescription>
                </Alert>
              )}
              <p className="text-sm text-gray-500">Enter 10-15 digits</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
              <p className="text-sm text-gray-500">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-green-600 hover:text-green-800 underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-green-600 hover:text-green-800 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              {errors.agreeToTerms && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.agreeToTerms}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Create Admin Account
            </Button>

            <div className="text-sm text-center">
              {"Already have an admin account? "}
              <Link href="/admin/login" className="text-green-600 hover:text-green-800 underline font-medium">
                Login here
              </Link>
            </div>
            <div className="pt-2 border-t border-gray-200 text-center">
              <Link href="/signup" className="text-gray-500 hover:text-gray-700 underline text-xs">
                Register as User Instead
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
