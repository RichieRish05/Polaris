"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useAuthStore } from "@/app/store/useAuthStore"
import { useEffect } from "react"



export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, setUser} = useAuthStore()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/me`, {
          credentials: 'include',
        })
        if (!response.ok) {
          setUser(null)
          return
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error during fetchUser:', error)
        setUser(null)
      }
    }
  
    fetchUser()
  }, [])

  const handleLogout = () => {
    logout()
  }

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/authorize`
  }


  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">ResumeReview</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            Jobs
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Resume Review Jobs</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogin}>
                Log In With Google
              </Button>
            )}
            {/* <div className="h-8 w-8 rounded-full bg-muted" /> */}
            {isAuthenticated ?
              <img src={user?.picture} alt="User Profile Picture" className="h-8 w-8 rounded-full" /> : 
              <div className="h-8 w-8 rounded-full bg-muted" />
          }
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
