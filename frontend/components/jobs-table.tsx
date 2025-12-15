"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"

interface Job {
  id: string
  name: string
  folderName: string
  resumeCount: number
  status: "queued" | "processing" | "completed" | "failed"
  createdAt: string
}

const mockJobs: Job[] = [
  {
    id: "1",
    name: "Fall 2024 Internship Applicants",
    folderName: "Internship Applications",
    resumeCount: 127,
    status: "completed",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Senior Software Engineer - Q1",
    folderName: "SWE Applications",
    resumeCount: 89,
    status: "completed",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Product Manager Screening",
    folderName: "PM Resumes",
    resumeCount: 45,
    status: "processing",
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    name: "Marketing Team Expansion",
    folderName: "Marketing Applications",
    resumeCount: 62,
    status: "completed",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Data Science Summer Interns",
    folderName: "DS Intern Apps",
    resumeCount: 31,
    status: "queued",
    createdAt: "2024-01-02",
  },
]

export function JobsTable() {
  const [jobs] = useState<Job[]>(mockJobs)

  const getStatusBadge = (status: Job["status"]) => {
    const variants = {
      queued: "secondary",
      processing: "default",
      completed: "outline",
      failed: "destructive",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">
              <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                Job Name
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                Folder Name
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                Resumes
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                Created
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="cursor-pointer">
              <TableCell className="font-medium">
                <Link href={`/jobs/${job.id}`} className="hover:underline">
                  {job.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{job.folderName}</TableCell>
              <TableCell>{job.resumeCount}</TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(job.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
