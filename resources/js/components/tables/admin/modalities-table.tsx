import { Modalities } from "@/types"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Download, Filter } from "lucide-react"
import { useState } from "react"
import { columns } from "@/pages/admin/project-activities/modalities/components/columns"

interface ModalitiesTableProps {
    modalities: Modalities[]
    isLoading?: boolean
}

export function ModalitiesTable({ modalities, isLoading }: ModalitiesTableProps) {
    const [modalityFilter, setModalityFilter] = useState<string>("all")

    // Filter modalities based on selected filters
    const filteredModalities = modalities.filter((modality) => {
        const modalityMatch = modalityFilter === "all" || modality.modality === modalityFilter

        return modalityMatch
    })

    // Get unique values for filter options
    const uniqueModalities = Array.from(new Set(modalities.map(m => m.modality).filter(Boolean)))

    const ModalityFilters = () => (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Modality Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Modalities</SelectItem>
                    {uniqueModalities.map((modality) => (
                        <SelectItem key={modality} value={modality!}>
                            {modality}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(modalityFilter !== "all") && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setModalityFilter("all")
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                    Clear
                </Button>
            )}
        </div>
    )

    return (
        <DataTable
            columns={columns}
            data={filteredModalities}
            searchKey="partner_agency"
            searchPlaceholder="Search by partner agency..."
            filterComponent={<ModalityFilters />}
            isLoading={isLoading}
        />
    )
}
