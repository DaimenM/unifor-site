'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()} className="text-blue-600 mr-4">
        Try again
      </button>
      <Link href="/" className="text-red-600">
        Return to home
      </Link>
    </div>
  )
} 