"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function TestPage() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "Test Toast",
      description: "This is a test notification",
      variant: "default",
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
