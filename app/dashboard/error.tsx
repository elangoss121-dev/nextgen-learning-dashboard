"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4 bg-[#09090b]"
    >
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="text-white/50 text-sm max-w-md break-words">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors cursor-pointer"
      >
        Try again
      </button>
    </motion.div>
  )
}
