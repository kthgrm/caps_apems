import { ColumnDef } from '@tanstack/react-table';
import { InternationalPartner } from '@/types';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Eye, MoreHorizontal, Handshake } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';

export const columns: ColumnDef<InternationalPartner>[] = [
    {
        accessorKey: 'agency_partner',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Agency Partner"
            />
        ),
        cell: ({ row }) => {
            const partnership = row.original;
            return (
                <div className="flex items-center gap-2" >
                    <Handshake className="h-4 w-4 text-green-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">{partnership.agency_partner}</span>
                        <span className="text-xs text-muted-foreground">ID: {partnership.id}</span>
                    </div>
                </div >
            )
        },
    },
    {
        accessorKey: 'activity_conducted',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Activity Type"
            />
        ),
    },
    {
        accessorKey: 'location',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Location"
            />
        ),
    },
    {
        accessorKey: 'start_date',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Start Date"
            />
        ),
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
        accessorKey: 'duration',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Duration"
            />
        ),
        cell: ({ row }) => {
            const partnership = row.original
            return (
                <div className="flex flex-col">
                    {/* Compute duration in days if start_date and end_date exist */}
                    {partnership.start_date && partnership.end_date ? (
                        <span className="text-sm font-medium">
                            {(() => {
                                const start = new Date(partnership.start_date);
                                const end = new Date(partnership.end_date);
                                const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                return `${diff} day${diff !== 1 ? 's' : ''}`;
                            })()}
                        </span>
                    ) : (
                        <span className="text-sm font-medium">N/A</span>
                    )}
                </div>
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
            const partnership = row.original

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
                            <Link href={`/admin/international-partners/${partnership.id}/details`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-light">
                            Edit partnership
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            Delete partnership
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
