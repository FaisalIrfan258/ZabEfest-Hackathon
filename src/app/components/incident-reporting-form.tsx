"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Upload, X, CheckCircle } from 'lucide-react'

const incidentCategories = [
  "Water Dumping",
  "Air Pollution",
  "Sewage Leakage",
  "Noise Pollution",
  "Deforestation",
  "Illegal Construction",
  "Overgrown Lawns",
  "Abandoned or Suspicious Vehicle",
  "Power Outage",
  "Water Line Break",
  "Potholes",
  "Suspicious Fire",
  "Fallen Trees",
  "Illegal Weapons or Gunshots",
  "Others"
]

interface FormData {
  category: string
  description: string
  customCategory: string
  location: {
    latitude: number | null
    longitude: number | null
    address: string
  }
}

export default function IncidentReportingForm() {
  const [formData, setFormData] = useState<FormData>({
    category: "",
    description: "",
    customCategory: "",
    location: {
      latitude: null,
      longitude: null,
      address: ""
    }
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles: File[] = []
    const newPreviews: string[] = []
    let hasError = false

    files.forEach(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, files: `File "${file.name}" exceeds 10MB limit` }))
        hasError = true
        return
      }

      validFiles.push(file)

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          setFilePreviews(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      } else {
        newPreviews.push('')
        setFilePreviews(prev => [...prev, ''])
      }
    })

    if (!hasError) {
      setUploadedFiles(prev => [...prev, ...validFiles])
      setErrors(prev => ({ ...prev, files: "" }))
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: "Geolocation is not supported by this browser" }))
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocoding to get address (using a mock address for demo)
          const address = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
          
          setFormData(prev => ({
            ...prev,
            location: { latitude, longitude, address }
          }))
          setErrors(prev => ({ ...prev, location: "" }))
        } catch (error) {
          console.error('Error getting address:', error)
          setFormData(prev => ({
            ...prev,
            location: { 
              latitude, 
              longitude, 
              address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}` 
            }
          }))
        }
        
        setIsGettingLocation(false)
      },
      (error) => {
        setErrors(prev => ({ ...prev, location: "Unable to get your location. Please try again." }))
        setIsGettingLocation(false)
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (formData.category === "Others" && !formData.customCategory.trim()) {
      newErrors.customCategory = "Please specify the custom category"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less"
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      newErrors.location = "Please pin your location"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      console.log("Incident Report:", {
        ...formData,
        files: uploadedFiles
      })
      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          category: "",
          description: "",
          customCategory: "",
          location: { latitude: null, longitude: null, address: "" }
        })
        setUploadedFiles([])
        setFilePreviews([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 3000)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">Report Submitted Successfully!</h2>
            <p className="text-gray-600">
              Thank you for reporting this incident. We will review your submission and take appropriate action.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Report Environmental Incident</CardTitle>
        <CardDescription>
          Help us maintain a better environment by reporting incidents in your area
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Incident Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select incident category" />
              </SelectTrigger>
              <SelectContent>
                {incidentCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <Alert variant="destructive">
                <AlertDescription>{errors.category}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Custom Category Input */}
          {formData.category === "Others" && (
            <div className="space-y-2">
              <Label htmlFor="customCategory">Specify Category *</Label>
              <Input
                id="customCategory"
                value={formData.customCategory}
                onChange={(e) => handleInputChange('customCategory', e.target.value)}
                placeholder="Please specify the type of incident"
                className={errors.customCategory ? "border-red-500" : ""}
              />
              {errors.customCategory && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.customCategory}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide a clear explanation of what has happened, including time, specific details, and any other relevant information..."
              className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
              maxLength={500}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formData.description.length}/500 characters</span>
            </div>
            {errors.description && (
              <Alert variant="destructive">
                <AlertDescription>{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="files">Upload Images/Files (Max 10MB each)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop files here
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </Button>
            </div>
            {errors.files && (
              <Alert variant="destructive">
                <AlertDescription>{errors.files}</AlertDescription>
              </Alert>
            )}

            {/* File Previews */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                      {filePreviews[index] ? (
                        <img
                          src={filePreviews[index] || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500 text-center">
                            {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                          </span>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex-shrink-0"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {isGettingLocation ? "Getting Location..." : "Pin My Location"}
              </Button>
              {formData.location.address && (
                <div className="flex-1 p-2 bg-gray-50 rounded border text-sm">
                  {formData.location.address}
                </div>
              )}
            </div>
            {errors.location && (
              <Alert variant="destructive">
                <AlertDescription>{errors.location}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit Incident Report
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
