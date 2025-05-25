"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { loginUser } from "@/lib/auth"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "", // Can be email, username, or CNIC
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"
  const { login } = useAuth()

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

    // Validation
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or username is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      setGeneralError("")
      
      try {
        // Call login API
        const response = await loginUser(formData.identifier, formData.password)
        
        if (response.success) {
          // Set auth context
          login(response.data.user, response.data.token)
          
          // Navigate to dashboard or redirect URL
          router.push(redirectTo)
        } else {
          setGeneralError(response.message || "Failed to login. Please try again.")
        }
      } catch (error) {
        console.error("Login error:", error)
        setGeneralError(error instanceof Error ? error.message : "Failed to login. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-center text-green-800">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {generalError && (
              <Alert variant="destructive">
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="identifier">Email / Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="Enter your email or username"
                className={errors.identifier ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.identifier && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.identifier}</AlertDescription>
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
                disabled={isLoading}
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
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
                  Logging in...
                </span>
              ) : "Login"}
            </Button>

            <div className="flex flex-col space-y-2 text-sm text-center">
              <Link href="/forgot-password" className="text-green-600 hover:text-green-800 underline">
                Forgot Password?
              </Link>
              <div>
                {"Don't have an account? "}
                <Link href="/signup" className="text-green-600 hover:text-green-800 underline font-medium">
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
