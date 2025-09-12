import { Engagement, InternationalPartner } from "@/types"
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
import { Download, Filter, Plus } from "lucide-react"
import { useState } from "react"
import { columns } from "@/pages/admin/international-partners/components/columns"

interface PartnershipsTableProps {
    partnerships: InternationalPartner[],
    isLoading?: boolean
}

export function PartnershipsTable({ partnerships, isLoading }: PartnershipsTableProps) {
    const [activityFilter, setActivityFilter] = useState<string>("all")
    const [locationFilter, setLocationFilter] = useState<string>("all")
    const [minParticipants, setMinParticipants] = useState<string>("")

    // Filter partnerships based on selected filters
    const filteredPartnerships = partnerships.filter((partnership) => {
        const activityMatch = activityFilter === "all" || partnership.activity_conducted === activityFilter
        const locationMatch = locationFilter === "all" || partnership.location === locationFilter
        const minParticipantsMatch = !minParticipants ||
            partnership.number_of_participants >= parseInt(minParticipants)

        return activityMatch && locationMatch && minParticipantsMatch
    })

    // Get unique values for filter options
    const uniqueActivities = Array.from(new Set(partnerships.map(e => e.activity_conducted).filter(Boolean)))
    const uniqueLocations = Array.from(new Set(partnerships.map(e => e.location).filter(Boolean)))

    const getActivityColor = (activity: string) => {
        switch (activity) {
            case 'seminar': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'training': return 'bg-green-100 text-green-800 border-green-200';
            case 'workshop': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'extension service': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'livelihood program': return 'bg-pink-100 text-pink-800 border-pink-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    const PartnershipFilters = () => (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    {uniqueActivities.map((activity) => (
                        <SelectItem key={activity} value={activity!}>
                            <div className="flex items-center gap-2">
                                <Badge className={`${getActivityColor(activity!)} border text-xs`}>
                                    {activity!.charAt(0).toUpperCase() + activity!.slice(1)}
                                </Badge>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location!}>
                            {location}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select> */}

            {(activityFilter !== "all" || locationFilter !== "all" || minParticipants) && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setActivityFilter("all")
                        setLocationFilter("all")
                        setMinParticipants("")
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                    Clear
                </Button>
            )}
        </div>
    )

    const PartnershipActions = () => (
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
            </Button>
        </div>
    )

    return (
        <DataTable
            columns={columns}
            data={filteredPartnerships}
            searchKey="agency_partner"
            searchPlaceholder="Search by agency partner..."
            filterComponent={<PartnershipFilters />}
            actionComponent={<PartnershipActions />}
            isLoading={isLoading}
        />
    )
}