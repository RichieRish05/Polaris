"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Download, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface ScoreBreakdown {
  category: string
  score: number
  maxScore: number
}

const mockScoreBreakdown: ScoreBreakdown[] = [
  { category: "Technical Skills", score: 95, maxScore: 100 },
  { category: "Experience", score: 88, maxScore: 100 },
  { category: "Education", score: 92, maxScore: 100 },
  { category: "Leadership", score: 85, maxScore: 100 },
  { category: "Cultural Fit", score: 90, maxScore: 100 },
]

export default function ResumeDetailPage() {
  const params = useParams()
  const router = useRouter()

  const overallScore = 92
  const candidateName = "Sarah Johnson"
  const fileName = "sarah_johnson_resume.pdf"

  const strengths = [
    "5+ years of professional React development experience",
    "Strong leadership skills demonstrated through tech lead role",
    "Contributed to major open source projects",
    "Excellent problem-solving abilities",
    "Strong communication skills",
  ]

  const weaknesses = [
    "Limited backend development experience",
    "No direct experience with TypeScript (though JavaScript expertise is strong)",
    "Gap in employment from 2021-2022",
  ]

  const summary =
    "Sarah is a strong candidate with extensive frontend development experience. Her React expertise and leadership background make her an excellent fit for senior-level positions. While she has limited backend experience, her strong foundation and proven ability to learn new technologies quickly suggest this gap can be addressed. Her open source contributions demonstrate initiative and community engagement."

  const flags = ["Resume exceeds standard 2-page length", "Salary expectations may be above budget range"]

  return (
    <DashboardLayout>
      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-muted-foreground">
              Jobs
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/jobs/${params.id}`)}
              className="text-muted-foreground"
            >
              Fall 2024 Internship Applicants
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{candidateName}</span>
          </div>

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{candidateName}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{fileName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Resume Preview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[8.5/11] rounded-lg border border-border bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">PDF Preview</p>
                      <p className="mt-1 text-xs text-muted-foreground">{fileName}</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-transparent" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Analysis */}
            <div className="space-y-6 lg:col-span-2">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                  <CardDescription>Composite evaluation across all categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-3xl font-bold text-primary">{overallScore}</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={overallScore} className="h-3" />
                      <p className="mt-2 text-sm text-muted-foreground">Excellent candidate - Highly recommended</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                  <CardDescription>Performance across evaluation categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockScoreBreakdown.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-muted-foreground">
                            {item.score}/{item.maxScore}
                          </span>
                        </div>
                        <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary Evaluation</CardTitle>
                  <CardDescription>AI-generated analysis of candidate fit</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground">{summary}</p>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                  <CardDescription>Notable qualifications and positive attributes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm leading-relaxed">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card>
                <CardHeader>
                  <CardTitle>Areas for Development</CardTitle>
                  <CardDescription>Potential concerns or skill gaps</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                        <span className="text-sm leading-relaxed">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Notable Flags */}
              {flags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notable Flags</CardTitle>
                    <CardDescription>Items requiring attention or follow-up</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {flags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                            <div className="h-2 w-2 rounded-full bg-yellow-600" />
                          </div>
                          <span className="text-sm leading-relaxed">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
