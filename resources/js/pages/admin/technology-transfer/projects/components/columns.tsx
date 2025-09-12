import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Project } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, Folder, MoreHorizontal, Users } from "lucide-react";

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Project Name" />
        },
        cell: ({ row }) => {
            const project = row.original
            return (
                <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-blue-600" />
                    <Link href={`/admin/technology-transfer/projects/${project.id}`} className="font-medium hover:underline">
                        <div className="flex flex-col">
                            <span className="font-medium">{project.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {project.id}</span>
                        </div>
                    </Link>
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
            const project = row.original
            return (
                <span>{project.user.name}</span>
            )
        },
    },
    {
        accessorKey: "agency_partner",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Agency Partner" />
        },
        cell: ({ row }) => {
            const agencyPartner = row.getValue("agency_partner") as string
            if (!agencyPartner) return <span className="text-xs text-muted-foreground">No agency partner</span>

            return (
                <span>{agencyPartner}</span>
            )
        },
    },
    {
        accessorKey: "budget",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Budget" />
        },
        cell: ({ row }) => {
            const budget = row.getValue("budget") as number
            if (!budget) return <span className="text-xs text-muted-foreground">Not set</span>

            return (
                <span>₱{budget.toLocaleString()}</span>
            )
        },
    },
    {
        accessorKey: "start_date",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Start Date" />
        },
        cell: ({ row }) => {
            const date = row.getValue("start_date") as string
            if (!date) return <span className="text-xs text-muted-foreground">Not set</span>

            return (
                <span className="text-sm">
                    {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            )
        },
    },
    {
        accessorKey: "leader",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Leader" />
        },
        cell: ({ row }) => {
            const leader = row.getValue("leader") as string
            if (!leader) return <span className="text-xs text-muted-foreground">Not assigned</span>

            return (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>{leader}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const project = row.original

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
                            <Link href={`/admin/technology-transfer/projects/${project.id}`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Are you sure you want to archive this project? This action cannot be undone.')) {
                                    router.patch(`/admin/technology-transfer/projects/${project.id}/archive`);
                                }
                            }}
                        >
                            Archive project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]