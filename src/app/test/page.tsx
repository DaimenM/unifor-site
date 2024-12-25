"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Article } from "@/types/article"

export default function TestPage() {
  const { toast } = useToast()

  const articles: Article[] = [
    {
      id: "archived-news",
      title: "Archived News",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true,
    },
    {
      id: "call-to-action",
      title: "Call to Action",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true,
    },
    {
      id: "in-memoriam",
      title: "In Memoriam",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true,
    }
  ]

  const handleClick = () => {
    toast({
      title: "Test Toast",
      description: "This is a test notification",
      variant: "default",
    })

    fetch("/api/test", {
      method: "POST",
      body: JSON.stringify(articles)
    })
  }

  return (
    <div className="container mx-auto p-8">
      <Button onClick={handleClick} className="mb-8">
        Show Toast
      </Button>
    </div>
  )
}
