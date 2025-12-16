"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Info } from "lucide-react"


export default function SettingsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectedEmail, setConnectedEmail] = useState("")

  const handleConnect = async () => {
    setIsLoading(true)
    // Redirect to OAuth authorize endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/authorize`
    setIsLoading(false)
    // await getUser()
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
    await getUser()
    setConnectedEmail("")
  }

  const getUser = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/me`, {
      credentials: 'include',
    })
    const data = await response.json()
    console.log(data)
    return data
  }

  return (
    <DashboardLayout>
      <main className="p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">Settings</h2>
            <p className="mt-2 text-sm text-muted-foreground">Manage your integrations and application preferences</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Google Drive</CardTitle>
                    <CardDescription className="mt-1.5">
                      Connect your Google Drive to access resume folders
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Secure Access</p>
                          <p className="text-sm text-muted-foreground">
                            We only access folders you explicitly select. Your files remain private and secure.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleConnect} disabled={isLoading} className="w-full" size="lg">
                      {isLoading ? (
                        <>
                          <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.71 3.5L1.15 15l3.58 6.5L12 9.5 7.71 3.5z" fill="currentColor" opacity="0.9" />
                            <path d="M14.29 3.5l-6.58 12L12 21.5l6.58-12-4.29-6z" fill="currentColor" opacity="0.9" />
                            <path
                              d="M22.85 15l-3.58-6.5H4.73L1.15 15l3.58 6.5h14.54l3.58-6.5z"
                              fill="currentColor"
                              opacity="0.9"
                            />
                          </svg>
                          Connect Google Drive
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Connected</p>
                        <p className="text-sm text-muted-foreground">{connectedEmail}</p>
                      </div>
                    </div>
                    <Button onClick={handleDisconnect} variant="outline" className="w-full bg-transparent">
                      Disconnect
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription className="mt-1.5">Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">user@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">Professional</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">January 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
