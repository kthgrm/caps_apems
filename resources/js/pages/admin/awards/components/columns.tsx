import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Award } from "@/types";
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { AwardIcon, Download, Eye, MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Award>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Award Name" />
        },
        cell: ({ row }) => {
            const award = row.original
            return (
                <div className="flex items-center gap-2">
                    <AwardIcon className="h-4 w-4 text-yellow-600" />
                    <div className="flex flex-col">
                        <span className="font-medium">{award.award_name}</span>
                        <span className="text-xs text-muted-foreground">ID: {award.id}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Description" />
        },
    },
    {
        accessorKey: "people_involved",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="People Involved" />
        },
        cell: ({ row }) => {
            const people = row.original.people_involved
            const peopleList = people?.split(", ")
            return (
                <span className="text-sm flex flex-wrap gap-1">
                    {peopleList ? (
                        peopleList.map((person) => (
                            <Badge variant={"outline"} key={person}>
                                {person}
                            </Badge>
                        ))
                    ) : "No people involved"}
                </span>
            )
        }
    },
    {
        accessorKey: "date_received",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Date Received" />
        },
        cell: ({ row }) => {
            const dateReceived = row.original.date_received
            if (!dateReceived) return "N/A"

            const date = new Date(dateReceived)
            return (
                <span className="text-sm">
                    {date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            )
        },
    },
    {
        accessorKey: "user",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Submitted By" />
        },
        cell: ({ row }) => {
            const award = row.original
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{award.user.name}</span>
                    <span className="text-xs text-muted-foreground">{award.user.email}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const award = row.original

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
                            <Link href={`/admin/awards-recognition/awards/${award.id}`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            Delete award
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]