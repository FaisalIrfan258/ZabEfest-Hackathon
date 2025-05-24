import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Choose an option to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/signup" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
