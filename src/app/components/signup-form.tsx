"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    cnic: "",
    email: "",
    password: "",
    address: "",
    mobile: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{13}$/
    return cnicRegex.test(cnic)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^\d{10,15}$/
    return mobileRegex.test(mobile)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // For CNIC field, only allow numbers
    if (name === "cnic") {
      const numericValue = value.replace(/\D/g, "")
      if (numericValue.length <= 13) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }))
      }
    }
    // For mobile field, only allow numbers
    else if (name === "mobile") {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
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

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required"
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10-15 digits"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Handle signup logic here
      console.log("Signup data:", formData)
      alert("Signup successful!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Create your account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.address}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                type="text"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="03001234567"
                maxLength={15}
                className={errors.mobile ? "border-red-500" : ""}
              />
              {errors.mobile && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.mobile}</AlertDescription>
                </Alert>
              )}
              <p className="text-sm text-gray-500">Enter 10-15 digits</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>

            <div className="text-sm text-center">
              {"Already have an account? "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 underline font-medium">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
