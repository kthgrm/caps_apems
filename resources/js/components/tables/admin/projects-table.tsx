import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Project } from "@/types"
import { columns } from "@/pages/admin/technology-transfer/projects/components/columns"
import { Plus, Filter, Download } from "lucide-react"
import { useState } from "react"

interface ProjectsTableProps {
    projects: Project[]
    isLoading?: boolean
}

export function ProjectsTable({ projects, isLoading }: ProjectsTableProps) {
    const [categoryFilter, setCategoryFilter] = useState<string>("all")

    // Filter projects based on selected filters
    const filteredProjects = projects.filter((project) => {
        const categoryMatch = categoryFilter === "all" || project.category === categoryFilter
        return categoryMatch
    })

    const uniqueCategories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)))

    const ProjectFilters = () => (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category!}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(categoryFilter !== "all") && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setCategoryFilter("all")
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                    Clear
                </Button>
            )}
        </div>
    )

    const ProjectActions = () => (
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
        </div>
    )

    return (
        <Card className="p-6">
            <DataTable
                columns={columns}
                data={filteredProjects}
                searchKey="name"
                searchPlaceholder="Search projects..."
                filterComponent={<ProjectFilters />}
                actionComponent={<ProjectActions />}
                isLoading={isLoading}
            />
        </Card>
    )
}
