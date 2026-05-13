"use client"

import { useRouter } from "next/navigation"

export function BackButton({ fallbackHref, label }: { fallbackHref: string; label: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      className="learning-back-button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back()
          return
        }
        router.push(fallbackHref)
      }}
    >
      {label}
    </button>
  )
}
