"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { seedArticles } from "@/lib/articles"
import { Article } from "@/types/article"

export default function TestPage() {
  const { toast } = useToast()

  const articles: Article[] = [
    {
      id: "contact",
      title: "Contact",
      content: "Contact",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    }
  ]

  const handleClick = () => {
    toast({
      title: "Test Toast",
      description: "This is a test notification",
      variant: "default",
    })

    seedArticles(articles)
  }

  return (
    <div className="container mx-auto p-8">
      <Button onClick={handleClick} className="mb-8">
        Show Toast
      </Button>
    </div>
  )
}
