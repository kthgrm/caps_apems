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
import { Award } from "@/types"
import { Filter, Download } from "lucide-react"
import { useState } from "react"
import { columns } from "@/pages/admin/awards/components/columns"

interface AwardsTableProps {
    awards: Award[]
    isLoading?: boolean
}

export function AwardsTable({ awards, isLoading }: AwardsTableProps) {
    console.log("AwardsTable rendered with awards:", awards)

    const [yearFilter, setYearFilter] = useState<string>("all")

    // Filter awards based on selected filters
    const filteredAwards = awards.filter((award) => {
        const yearMatch = yearFilter === "all" ||
            new Date(award.date_received).getFullYear().toString() === yearFilter

        return yearMatch
    })

    // Get unique values for filter options
    const uniqueYears = Array.from(new Set(awards.map(a => new Date(a.date_received).getFullYear()))).sort((a, b) => b - a)

    const AwardFilters = () => (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(yearFilter !== "all") && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setYearFilter("all")
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                    Clear
                </Button>
            )}
        </div>
    )

    const AwardActions = () => (
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Awards
            </Button>
        </div>
    )

    return (
        <Card className="p-6">
            <DataTable
                columns={columns}
                data={filteredAwards}
                searchKey="name"
                searchPlaceholder="Search awards..."
                filterComponent={<AwardFilters />}
                actionComponent={<AwardActions />}
                isLoading={isLoading}
            />
        </Card>
    )
}
