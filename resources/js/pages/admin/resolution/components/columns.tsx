import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Resolution } from "@/types";
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, FileText, MoreHorizontal, Users, Building } from "lucide-react";

export const columns: ColumnDef<Resolution>[] = [
    {
        accessorKey: "resolution_number",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Resolution Number" />
        },
        cell: ({ row }) => {
            const resolution = row.original
            return (
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                        <span className="font-medium">{resolution.resolution_number}</span>
                        <span className="text-xs text-muted-foreground">ID: {resolution.id}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "user.name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Submitted By" />
        },
        cell: ({ row }) => {
            const resolution = row.original
            return (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>{resolution.user.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "partner_agency_organization",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Partner Agency/Organization" />
        },
        cell: ({ row }) => {
            const partnerAgency = row.getValue("partner_agency_organization") as string
            if (!partnerAgency) return <span className="text-xs text-muted-foreground">No partner agency</span>

            return (
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-600" />
                    <span>{partnerAgency}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "year_of_effectivity",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Year of Effectivity" />
        },
        cell: ({ row }) => {
            const date = row.getValue("year_of_effectivity") as string
            if (!date) return <span className="text-xs text-muted-foreground">Not set</span>

            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                        {new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "expiration",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Expiration Date" />
        },
        cell: ({ row }) => {
            const date = row.getValue("expiration") as string
            if (!date) return <span className="text-xs text-muted-foreground">Not set</span>

            const expirationDate = new Date(date);
            const currentDate = new Date();
            const isExpired = expirationDate < currentDate;

            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span className="text-sm">
                        {expirationDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "contact_person",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Contact Person" />
        },
        cell: ({ row }) => {
            const contactPerson = row.getValue("contact_person") as string
            const contactInfo = row.getValue("contact_number_email") as string

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{contactPerson}</span>
                    {contactInfo && (
                        <span className="text-xs text-muted-foreground">{contactInfo}</span>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const resolution = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/resolutions/${resolution.id}`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/resolutions/${resolution.id}/edit`} className="font-light">
                                Edit resolution
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-light">
                            Generate report
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            Delete resolution
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]