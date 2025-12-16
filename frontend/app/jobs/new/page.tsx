"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Folder, FileText, Loader2 } from "lucide-react"

interface DriveFolder {
  id: string
  name: string
  fileCount: number
}

const mockFolders: DriveFolder[] = [
  { id: "1", name: "Internship Applications", fileCount: 127 },
  { id: "2", name: "SWE Applications", fileCount: 89 },
  { id: "3", name: "PM Resumes", fileCount: 45 },
  { id: "4", name: "Marketing Applications", fileCount: 62 },
  { id: "5", name: "DS Intern Apps", fileCount: 31 },
  { id: "6", name: "Design Portfolio Reviews", fileCount: 18 },
]

export default function NewJobPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedFolder, setSelectedFolder] = useState<DriveFolder | null>(null)
  const [jobName, setJobName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [driveFiles, setDriveFiles] = useState<any[]>([])


  useEffect(() => {
    const fetchDriveFiles = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/drive-files`, {
        credentials: 'include',
      })
      const data = await response.json()
      console.log('DATA', data)
      setDriveFiles(data)
    }
    fetchDriveFiles()

  }, [])

  console.log('DRIVE FILES', driveFiles)

  const handleFolderSelect = (folder: DriveFolder) => {
    setSelectedFolder(folder)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate job creation
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <DashboardLayout>
      <main className="p-8">
        <div className="mx-auto max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-muted-foreground">
                Jobs
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">New Review Job</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Create Resume Review Job</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a folder from your Google Drive and configure your resume review job
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className={`h-0.5 w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className={`h-0.5 w-16 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>

          {/* Step 1: Select Folder */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Google Drive Folder</CardTitle>
                <CardDescription>Choose a folder containing PDF resumes to review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleFolderSelect(folder)}
                      className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                        selectedFolder?.id === folder.id ? "border-primary bg-accent" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{folder.name}</p>
                          <p className="text-sm text-muted-foreground">{folder.fileCount} PDFs</p>
                        </div>
                      </div>
                      {selectedFolder?.id === folder.id && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <svg
                            className="h-3 w-3 text-primary-foreground"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!selectedFolder}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Job Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Name your job and add an optional description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobName">Job Name</Label>
                  <Input
                    id="jobName"
                    placeholder="e.g., Fall 2024 Internship Applicants"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Description (Optional)</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Add notes about this review job..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!jobName.trim()}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Start */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Start Job</CardTitle>
                <CardDescription>Review your settings and start the resume review process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Selected Folder</p>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{selectedFolder?.name}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                      Change
                    </Button>
                  </div>
                  <div className="flex items-start justify-between border-t border-border pt-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Job Name</p>
                      <p className="font-medium">{jobName}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 border-t border-border pt-4">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">{selectedFolder?.fileCount}</span> resumes will be processed
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        className="h-5 w-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Processing Time</p>
                      <p className="text-sm text-muted-foreground">
                        This job will be processed asynchronously. You'll be notified when it's complete.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Job...
                      </>
                    ) : (
                      "Start Review Job"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </DashboardLayout>
  )
}
