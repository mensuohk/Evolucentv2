"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/10 hover:border-red-500/50"
    >
      Sign out
    </button>
  )
}
