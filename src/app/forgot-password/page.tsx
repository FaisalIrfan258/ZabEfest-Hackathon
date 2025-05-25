"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { forgotPassword } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const [cnic, setCnic] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{13}$/
    return cnicRegex.test(cnic)
  }

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "")
    if (numericValue.length <= 13) {
      setCnic(numericValue)
      if (error) setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cnic) {
      setError("CNIC is required")
      return
    }

    if (!validateCNIC(cnic)) {
      setError("CNIC must be exactly 13 digits")
      return
    }

    setIsLoading(true)
    try {
      // Call forgot password API
      const response = await forgotPassword(cnic)
      
      if (response.success) {
        setIsSubmitted(true)
      } else {
        setError(response.message || "Failed to process request. Please try again.")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setError(error instanceof Error ? error.message : "Failed to process request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
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
            <CardTitle className="text-2xl font-bold text-center text-green-800">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a password reset link to your registered email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              If you don't see the email, check your spam folder or try again.
            </p>
            <Link href="/login" className="text-green-600 hover:text-green-700 underline">
              Back to Login
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
          <CardTitle className="text-2xl font-bold text-center text-green-800">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your CNIC and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC (13 digits)</Label>
              <Input
                id="cnic"
                name="cnic"
                type="text"
                value={cnic}
                onChange={handleCnicChange}
                placeholder="1234567890123"
                maxLength={13}
                className={error ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-gray-500">Enter exactly 13 digits</p>
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
                  Sending...
                </span>
              ) : "Send Reset Link"}
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
