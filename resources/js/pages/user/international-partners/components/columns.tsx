import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { InternationalPartner } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Handshake, MapPin, MoreHorizontal, Trash, Trash2, Users } from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";

// Archive Partnership Component with Password Confirmation
const ArchivePartnershipButton = ({ partnership }: { partnership: InternationalPartner }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleArchive = () => {
        if (!password.trim()) {
            setErrorMessage('Please enter your password to confirm.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        router.patch(route('user.international-partners.archive', partnership.id), {
            password: password
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
            },
            onError: (errors) => {
                setIsLoading(false);
                if (errors.password) {
                    setErrorMessage(errors.password);
                } else if (errors.message) {
                    setErrorMessage(errors.message);
                } else {
                    setErrorMessage('Archive failed. Please try again.');
                }
            }
        });
    };

    const resetDialog = () => {
        setIsDialogOpen(false);
        setPassword('');
        setErrorMessage('');
    };

    return (
        <>
            <DropdownMenuItem
                variant="destructive"
                className="flex items-center gap-2"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Small delay to let dropdown close first
                    setTimeout(() => setIsDialogOpen(true), 100);
                }}
            >
                <Trash className="h-4 w-4" />
                Delete
            </DropdownMenuItem>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    resetDialog();
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            You are about to delete the partnership with "{partnership.agency_partner}". This action requires password confirmation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleArchive();
                                    }
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <InputError message={errorMessage} className="col-span-4" />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={resetDialog}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleArchive}
                            disabled={isLoading || !password.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const columns: ColumnDef<InternationalPartner>[] = [
    {
        accessorKey: "agency_partner",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Agency Partner" />
        },
        cell: ({ row }) => {
            const engagement = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Handshake className="h-4 w-4 text-green-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">{engagement.agency_partner}</span>
                        <span className="text-xs text-muted-foreground">ID: {engagement.id}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "activity_conducted",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Activity" />
        },
        cell: ({ row }) => {
            const activity = row.getValue("activity_conducted") as string;

            if (!activity) return <span className="text-xs text-muted-foreground">Not specified</span>;
            return (
                <Badge
                    variant="outline"
                    className={`capitalize ${activity}`}
                >
                    {activity}
                </Badge>
            );
        },
    },
    {
        accessorKey: "location",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Location" />
        },
        cell: ({ row }) => {
            const location = row.getValue("location") as string;
            return (
                <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{location}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "start_date",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Start Date" />
        },
        cell: ({ row }) => {
            const startDate = row.getValue("start_date") as string;
            return startDate ? new Date(startDate).toLocaleDateString() : 'Not set';
        },
    },
    {
        accessorKey: "end_date",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="End Date" />
        },
        cell: ({ row }) => {
            const endDate = row.getValue("end_date") as string;
            return endDate ? new Date(endDate).toLocaleDateString() : 'Not set';
        },
    },
    {
        id: "duration",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Duration" />
        },
        cell: ({ row }) => {
            const start = row.getValue("start_date") as string;
            const end = row.getValue("end_date") as string;
            if (!start || !end) return 'N/A';
            const startDate = new Date(start);
            const endDate = new Date(end);
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
            return (
                <span className="text-sm">
                    {days} day{days !== 1 ? 's' : ''}
                </span>
            );
        },
    },
    {
        accessorKey: "number_of_participants",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Participants" />
        },
        cell: ({ row }) => {
            const participants = row.getValue("number_of_participants") as number;
            return (
                <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{participants}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Actions" />
        },
        cell: ({ row }) => {
            const partnership = row.original;

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
                            <Link href={`/user/international-partners/${partnership.id}`} className="font-light flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/user/international-partners/${partnership.id}/edit`} className="font-light flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit partnership
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ArchivePartnershipButton partnership={partnership} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];