"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Article } from "@/types/article"

export default function TestPage() {
  const { toast } = useToast()

  const articles: Article[] = [
    {
      id: "collective-agreement",
      title: "Collective Agreement",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    },
    {
      id: "constitution-and-bylaws",
      title: "Constitution and Bylaws",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    },
    {
      id: "union-representatives",
      title: "Union Representatives",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    }, {
      id: "unifor-local-2002",
      title: "Unifor Local 2002",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    },
    {
      id: "unifor-national",
      title: "Unifor National",
      content: "To be filled",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    },
    {
      id: "womens-advocate",
      title: "Women's Advocate",
      content: "To be filled",
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
