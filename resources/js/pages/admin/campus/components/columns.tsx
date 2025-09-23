import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Campus } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Building, Edit, MoreHorizontal, Trash } from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";

// Delete Campus Component with Password Confirmation
const DeleteCampusButton = ({ campus }: { campus: Campus }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDelete = () => {
        if (!password.trim()) {
            setErrorMessage('Please enter your password to confirm.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        router.delete(`/admin/campus/${campus.id}`, {
            data: { password: password },
            onSuccess: () => {
                setIsDialogOpen(false);
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
            },
            onError: (errors: any) => {
                setIsLoading(false);
                if (errors.password) {
                    setErrorMessage(errors.password);
                } else if (errors.deletion) {
                    setErrorMessage(errors.deletion);
                } else if (errors.message) {
                    setErrorMessage(errors.message);
                } else {
                    setErrorMessage('Delete failed. Please try again.');
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
                className="flex items-center gap-2 text-red-600"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Small delay to let dropdown close first
                    setTimeout(() => setIsDialogOpen(true), 100);
                }}
            >
                <Trash className="h-4 w-4" />
                Delete campus
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
                            You are about to delete the campus "{campus.name}". This action cannot be undone and requires password confirmation.
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
                                        handleDelete();
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
                            onClick={handleDelete}
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

export const columns: ColumnDef<Campus>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Campus Name" />
        },
        cell: ({ row }) => {
            const campus = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={campus.logo ? `/storage/${campus.logo}` : undefined}
                            alt={`${campus.name} logo`}
                        />
                        <AvatarFallback className="bg-slate-100">
                            <Building className="h-4 w-4 text-slate-600" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{campus.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {campus.id}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Created" />
        },
        cell: ({ row }) => {
            const createdAt = row.original.created_at
            if (!createdAt) return "N/A"

            const date = new Date(createdAt)
            return (
                <div className="flex flex-col">
                    <span className="text-sm">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Last Updated" />
        },
        cell: ({ row }) => {
            const updatedAt = row.original.updated_at
            if (!updatedAt) return "N/A"

            const date = new Date(updatedAt)
            const now = new Date()
            const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

            let timeAgo = ""
            if (diffInDays === 0) {
                timeAgo = "Today"
            } else if (diffInDays === 1) {
                timeAgo = "Yesterday"
            } else if (diffInDays < 30) {
                timeAgo = `${diffInDays} days ago`
            } else {
                timeAgo = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            }

            return (
                <div className="flex flex-col">
                    <span className="text-sm">{timeAgo}</span>
                    <span className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const campus = row.original

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
                            <Link href={`/admin/campus/${campus.id}`} className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/campus/${campus.id}/edit`} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit campus
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteCampusButton campus={campus} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]