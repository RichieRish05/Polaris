"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, Search, Download, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Resume {
  id: string
  candidateName: string
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  status: "processed" | "failed"
}

const mockResumes: Resume[] = [
  {
    id: "1",
    candidateName: "Sarah Johnson",
    overallScore: 92,
    strengths: ["5+ years React", "Strong leadership"],
    weaknesses: ["Limited backend experience"],
    status: "processed",
  },
  {
    id: "2",
    candidateName: "Michael Chen",
    overallScore: 88,
    strengths: ["Full-stack expertise", "Open source contributor"],
    weaknesses: ["No management experience"],
    status: "processed",
  },
  {
    id: "3",
    candidateName: "Emily Rodriguez",
    overallScore: 85,
    strengths: ["Design systems", "Excellent communication"],
    weaknesses: ["Limited testing experience"],
    status: "processed",
  },
  {
    id: "4",
    candidateName: "James Wilson",
    overallScore: 78,
    strengths: ["Quick learner", "Team player"],
    weaknesses: ["Junior level", "Limited projects"],
    status: "processed",
  },
  {
    id: "5",
    candidateName: "Lisa Anderson",
    overallScore: 95,
    strengths: ["10+ years experience", "Tech lead background", "Strong architecture skills"],
    weaknesses: ["Salary expectations high"],
    status: "processed",
  },
  {
    id: "6",
    candidateName: "David Kim",
    overallScore: 72,
    strengths: ["Eager to learn", "Good academic record"],
    weaknesses: ["No professional experience", "Limited portfolio"],
    status: "processed",
  },
]

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [resumes] = useState<Resume[]>(mockResumes)

  const filteredResumes = resumes.filter((resume) =>
    resume.candidateName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const avgScore = Math.round(resumes.reduce((acc, r) => acc + r.overallScore, 0) / resumes.length)
  const topScore = Math.max(...resumes.map((r) => r.overallScore))
  const lowestScore = Math.min(...resumes.map((r) => r.overallScore))

  const getScoreIndicator = (score: number) => {
    if (score >= 85)
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-3 w-3" />
        </div>
      )
    if (score >= 70)
      return (
        <div className="flex items-center gap-1 text-yellow-600">
          <Minus className="h-3 w-3" />
        </div>
      )
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="h-3 w-3" />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-muted-foreground">
                Jobs
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Fall 2024 Internship Applicants</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Fall 2024 Internship Applicants</h1>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="outline">Completed</Badge>
                  <span className="text-sm text-muted-foreground">Internship Applications</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Created Jan 15, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Resumes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{resumes.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">All processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{avgScore}</div>
                <p className="mt-1 text-xs text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Top Score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{topScore}</div>
                <p className="mt-1 text-xs text-green-600">Excellent candidate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Lowest Score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{lowestScore}</div>
                <p className="mt-1 text-xs text-muted-foreground">Below threshold</p>
              </CardContent>
            </Card>
          </div>

          {/* Resume Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resume Analysis</CardTitle>
                  <CardDescription className="mt-1.5">
                    Detailed breakdown of each candidate's evaluation
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Candidate</TableHead>
                      <TableHead className="w-[120px]">Score</TableHead>
                      <TableHead>Strengths</TableHead>
                      <TableHead>Weaknesses</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResumes.length > 0 ? (
                      filteredResumes.map((resume) => (
                        <TableRow key={resume.id} className="cursor-pointer">
                          <TableCell className="font-medium">
                            <Link href={`/jobs/${params.id}/resumes/${resume.id}`} className="hover:underline">
                              {resume.candidateName}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">{resume.overallScore}</span>
                              {getScoreIndicator(resume.overallScore)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {resume.strengths.slice(0, 2).map((strength, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                              {resume.strengths.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{resume.strengths.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {resume.weaknesses.slice(0, 2).map((weakness, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {weakness}
                                </Badge>
                              ))}
                              {resume.weaknesses.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resume.weaknesses.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={resume.status === "processed" ? "outline" : "destructive"}>
                              {resume.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No candidates found matching "{searchQuery}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  )
}
