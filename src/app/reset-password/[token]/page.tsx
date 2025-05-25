"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resetPassword } from "@/lib/auth"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generalError, setGeneralError] = useState("")
  
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

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

    if (!token) {
      setGeneralError("Invalid or missing reset token");
      return;
    }

    // Validation
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

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      setGeneralError("")
      
      try {
        // Call reset password API
        const response = await resetPassword(
          token,
          formData.password,
          formData.confirmPassword
        )
        
        if (response.success) {
          setIsSuccess(true)
          // Redirect after 3 seconds
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        } else {
          setGeneralError(response.message || "Failed to reset password. Please try again.")
        }
      } catch (error) {
        console.error("Reset password error:", error)
        setGeneralError(error instanceof Error ? error.message : "Failed to reset password. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-green-200">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-green-800">Password Reset Successful</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully updated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You will be redirected to the login page in a few seconds...
            </p>
            <Link href="/login" className="text-green-600 hover:text-green-700 underline">
              Go to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardTitle className="text-2xl font-bold text-center text-green-800">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {generalError && (
              <Alert variant="destructive">
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your new password"
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
                placeholder="Confirm your new password"
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
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
                  Updating...
                </span>
              ) : "Reset Password"}
            </Button>

            <div className="text-sm text-center">
              <Link href="/login" className="text-green-600 hover:text-green-700 underline">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 