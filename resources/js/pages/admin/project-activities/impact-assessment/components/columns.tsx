import { ColumnDef } from '@tanstack/react-table';
import { ImpactAssessment } from '@/types';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users, MapPin, FilePenLine } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';

export const columns: ColumnDef<ImpactAssessment>[] = [
    {
        id: 'project.name',
        accessorFn: (row) => row.project.name,
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Project Assessment"
            />
        ),
        cell: ({ row }) => {
            const assessment = row.original;
            return (
                <div className="flex items-center gap-2" >
                    <FilePenLine className="h-4 w-4 text-blue-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">{assessment.project.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {assessment.id}</span>
                    </div>
                </div >
            )
        },
    },
    {
        accessorKey: 'beneficiary',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Beneficiary"
            />
        ),
    },
    {
        accessorKey: 'num_direct_beneficiary',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Direct Beneficiaries"
            />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-700">
                    {Number(row.original.num_direct_beneficiary).toLocaleString()}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'num_indirect_beneficiary',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Indirect Beneficiaries"
            />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="font-medium text-blue-700">
                    {Number(row.original.num_indirect_beneficiary).toLocaleString()}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'geographic_coverage',
        header: 'Geographic Coverage',
        cell: ({ row }) => (
            <div className="flex items-center gap-1 max-w-[120px]">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate text-sm">
                    {row.original.geographic_coverage}
                </span>
            </div>
        ),
    },
    {
        id: 'user.name',
        accessorFn: (row) => row.user.name,
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Submitted By"
            />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const impactAssessment = row.original

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
                            <Link href={`/admin/impact-assessment/${impactAssessment.id}/details`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            Delete assessment
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
