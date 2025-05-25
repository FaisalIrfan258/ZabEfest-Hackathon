"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, MapPin, TrendingUp, AlertTriangle, FileText } from "lucide-react"

// Mock analytics data
const analyticsData = {
  totalReports: 156,
  resolvedReports: 89,
  pendingReports: 67,
  highPriorityReports: 23,
  categories: [
    { name: "Water Dumping", count: 45, percentage: 28.8 },
    { name: "Air Pollution", count: 38, percentage: 24.4 },
    { name: "Sewage Leakage", count: 32, percentage: 20.5 },
    { name: "Noise Pollution", count: 25, percentage: 16.0 },
    { name: "Illegal Construction", count: 16, percentage: 10.3 },
  ],
  areaInsights: [
    { area: "Block 5", reports: 34, trend: "increasing", risk: "high" },
    { area: "Block 3", reports: 28, trend: "stable", risk: "medium" },
    { area: "Block 7", reports: 22, trend: "decreasing", risk: "low" },
    { area: "Block 2", reports: 19, trend: "increasing", risk: "medium" },
    { area: "Block 8", reports: 15, trend: "stable", risk: "low" },
  ],
}

export default function AnalyticsPage() {
  const [selectedArea, setSelectedArea] = useState("All Areas")
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 30 Days")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleExportReport = () => {
    // Mock export functionality
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeframe: selectedTimeframe,
      area: selectedArea,
      data: analyticsData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `environmental-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "📈"
      case "decreasing":
        return "📉"
      case "stable":
        return "➡️"
      default:
        return "➡️"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Analytics & Reports</h1>
        <p className="text-green-600 mt-2">
          Comprehensive analytics, heatmaps, and insights for environmental incident management
        </p>
      </div>

      {/* Controls */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Report Controls</CardTitle>
          <CardDescription className="text-green-600">Filter data and export reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-green-700">Area</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Areas">All Areas</SelectItem>
                  <SelectItem value="Block 5">Block 5</SelectItem>
                  <SelectItem value="Block 3">Block 3</SelectItem>
                  <SelectItem value="Block 7">Block 7</SelectItem>
                  <SelectItem value="Block 2">Block 2</SelectItem>
                  <SelectItem value="Block 8">Block 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-green-700">Timeframe</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                  <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                  <SelectItem value="Last Year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-green-700">Upload Report</Label>
              <Input
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={handleFileUpload}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700 w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{analyticsData.totalReports}</div>
            <p className="text-xs text-green-600">All time incidents</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Resolved</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{analyticsData.resolvedReports}</div>
            <p className="text-xs text-green-600">
              {((analyticsData.resolvedReports / analyticsData.totalReports) * 100).toFixed(1)}% resolution rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analyticsData.pendingReports}</div>
            <p className="text-xs text-green-600">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analyticsData.highPriorityReports}</div>
            <p className="text-xs text-green-600">Urgent attention needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap and Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Heatmap */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Area Risk Heatmap</CardTitle>
            <CardDescription className="text-green-600">Environmental incident density by area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.areaInsights.map((area, index) => (
                <div key={area.area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">{area.area}</div>
                      <div className="text-sm text-green-600">{area.reports} reports</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTrendIcon(area.trend)}</span>
                    <Badge className={`${getRiskColor(area.risk)} border`} variant="outline">
                      {area.risk} risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Incident Categories</CardTitle>
            <CardDescription className="text-green-600">Distribution of incident types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-green-800">{category.name}</span>
                    <span className="text-green-600">
                      {category.count} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded File Analysis */}
      {uploadedFile && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Area Insights - {uploadedFile.name}</CardTitle>
            <CardDescription className="text-green-600">
              Analysis and recommendations based on uploaded data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mock Graph */}
              <div className="space-y-4">
                <h4 className="font-semibold text-green-800">Environmental Impact Trends</h4>
                <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-green-700 font-medium">Interactive Chart</p>
                    <p className="text-sm text-green-600">Showing trends for your area</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="font-semibold text-green-800">Recommended Actions</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-green-800">Increase Water Quality Monitoring</p>
                        <p className="text-sm text-green-600">High concentration of water dumping incidents detected</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-green-800">Air Quality Assessment</p>
                        <p className="text-sm text-green-600">Consider installing air quality sensors in Block 3</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-green-800">Community Engagement</p>
                        <p className="text-sm text-green-600">Organize awareness campaigns in high-risk areas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
