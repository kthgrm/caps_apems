import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Award } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { AwardIcon, Edit, Eye, MoreHorizontal, Trash, Trash2 } from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";
import InputError from "@/components/input-error";
import { Label } from "@radix-ui/react-dropdown-menu";

// Archive Award Component with Password Confirmation
const ArchiveAwardButton = ({ award }: { award: Award }) => {
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

        router.patch(route('user.awards.archive', award.id), {
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
                            You are about to delete the award "{award.award_name}". This action requires password confirmation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                        <div className="grid grid-cols-1 items-center gap-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleArchive();
                                    }
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <InputError message={errorMessage} />
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
                            className="bg-red-800 hover:bg-red-900"
                        >
                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const columns: ColumnDef<Award>[] = [
    {
        accessorKey: "award_name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Award Name" />
        },
        cell: ({ row }: any) => {
            const award = row.original;
            return (
                <div className="flex items-center gap-2">
                    <AwardIcon className="h-4 w-4 text-yellow-600" />
                    <div className="flex flex-col">
                        <span className="font-medium">{award.award_name}</span>
                        <span className="text-xs text-muted-foreground">ID: {award.id}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Description" />
        },
        cell: ({ row }: any) => {
            const description = row.getValue("description") as string;
            return description ? (
                <span className="line-clamp-2">{description}</span>
            ) : (
                <span className="text-muted-foreground text-sm">No description</span>
            );
        },
    },
    {
        accessorKey: "level",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Level" />
        },
        cell: ({ row }: any) => {
            const level = row.getValue("level") as string;
            return level ? (
                <span className="line-clamp-2">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
            ) : (
                <span className="text-muted-foreground text-sm">No level specified</span>
            );
        },
    },
    {
        accessorKey: "date_received",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Date Received" />
        },
        cell: ({ row }: any) => {
            const dateReceived = row.getValue("date_received") as string;
            return dateReceived ? new Date(dateReceived).toLocaleDateString() : 'Not set';
        },
    },

    {
        accessorKey: "people_involved",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="People Involved" />
        },
        cell: ({ row }: any) => {
            const people = row.getValue("people_involved") as string;
            return people ? (
                <span className="line-clamp-1">{people}</span>
            ) : (
                <span className="text-muted-foreground text-sm">Not specified</span>
            );
        },
    },
    {
        id: "actions",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Actions" />
        },
        cell: ({ row }) => {
            const award = row.original;

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
                            <Link href={`/user/awards/${award.id}`} className="font-light flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href='#' className="font-light flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit award
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ArchiveAwardButton award={award} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]