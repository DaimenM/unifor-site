"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function TestPage() {
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/test")
      if (!response.ok) {
        throw new Error("Failed to fetch articles")
      }
      
      const articles = await response.json()
      
      // Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(articles, null, 2)], { type: "application/json" })
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "articles.json"
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Articles downloaded successfully",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download articles",
        variant: "destructive",
      })
    }
  }

  const handleSeed = async () => {
    try {
      const response = await fetch("/api/test", {
        method: "POST",
      })
      
      if (!response.ok) {
        throw new Error("Failed to seed articles")
      }

      toast({
        title: "Success",
        description: "Articles seeded successfully",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed articles",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex gap-4">
        <Button onClick={handleDownload}>
          Download Articles
        </Button>
        <Button onClick={handleSeed} variant="secondary">
          Seed Articles to KV
        </Button>
      </div>
    </div>
  )
}
