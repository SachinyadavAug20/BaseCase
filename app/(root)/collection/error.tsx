'use client' // Error boundaries must be Client Components
 
import handleError from '@/lib/handlers/error'
import { ErrorResponse } from '@/types/global'
import { useEffect } from 'react'
 
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.log(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
      >
        Try again
      </button>
    </div>
  )
}
