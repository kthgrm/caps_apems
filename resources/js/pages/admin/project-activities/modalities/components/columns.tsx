import { ColumnDef } from '@tanstack/react-table';
import { Modalities } from '@/types';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Radio, Tv, Globe, Building, Clock, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';

export const columns: ColumnDef<Modalities>[] = [
    {
        accessorKey: 'project.name',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Project Modality"
            />
        ),
        cell: ({ row }) => {
            const modality = row.original;
            const getModalityIcon = (modalityType: string) => {
                switch (modalityType.toLowerCase()) {
                    case 'tv':
                    case 'television':
                        return <Tv className="h-4 w-4 text-blue-500" />;
                    case 'radio':
                        return <Radio className="h-4 w-4 text-green-500" />;
                    case 'online':
                    case 'digital':
                        return <Globe className="h-4 w-4 text-purple-500" />;
                    default:
                        return <Building className="h-4 w-4 text-gray-500" />;
                }
            };

            return (
                <div className="flex items-center gap-2">
                    {getModalityIcon(modality.modality)}
                    <div className="flex flex-col">
                        <span className="font-medium">{modality.project.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {modality.id}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'modality',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Modality Type"
            />
        ),
        cell: ({ row }) => {
            const modality = row.original.modality;
            const getModalityIcon = (modalityType: string) => {
                switch (modalityType.toLowerCase()) {
                    case 'tv':
                    case 'television':
                        return <Tv className="h-3 w-3 text-blue-600" />;
                    case 'radio':
                        return <Radio className="h-3 w-3 text-green-600" />;
                    case 'online':
                    case 'digital':
                        return <Globe className="h-3 w-3 text-purple-600" />;
                    default:
                        return <Building className="h-3 w-3 text-gray-600" />;
                }
            };

            return (
                <div className="flex items-center gap-1">
                    {getModalityIcon(modality)}
                    <span className="font-medium capitalize">{modality}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'tv_channel',
        header: 'TV Channel',
        cell: ({ row }) => {
            const tvChannel = row.original.tv_channel;
            return tvChannel ? (
                <div className="flex items-center gap-1">
                    <Tv className="h-3 w-3 text-blue-600" />
                    <span className="text-sm">{tvChannel}</span>
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: 'radio',
        header: 'Radio Station',
        cell: ({ row }) => {
            const radio = row.original.radio;
            return radio ? (
                <div className="flex items-center gap-1">
                    <Radio className="h-3 w-3 text-green-600" />
                    <span className="text-sm">{radio}</span>
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: 'online_link',
        header: 'Online Link',
        cell: ({ row }) => {
            const onlineLink = row.original.online_link;
            return onlineLink ? (
                <div className="flex items-center gap-1 max-w-[150px]">
                    <Globe className="h-3 w-3 text-purple-600" />
                    <a
                        href={onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                    >
                        {onlineLink}
                    </a>
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: 'time_air',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Air Time"
            />
        ),
        cell: ({ row }) => {
            const timeAir = row.original.time_air;
            return timeAir ? (
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{timeAir}</span>
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: 'partner_agency',
        header: 'Partner Agency',
        cell: ({ row }) => {
            const partnerAgency = row.original.partner_agency;
            return partnerAgency ? (
                <div className="flex items-center gap-1 max-w-[120px]">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate text-sm">{partnerAgency}</span>
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            );
        },
    },
    {
        accessorKey: 'user.name',
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
            const modality = row.original;

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
                            <Link href={`/admin/modalities/${modality.id}/details`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            Delete modality
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
