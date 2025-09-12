import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Project } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Edit, Eye, FileText, Folder, MoreHorizontal, Users, AlertCircle, Trash } from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";

// Archive Project Component with Password Confirmation
const ArchiveProjectButton = ({ project }: { project: Project }) => {
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

        router.patch(route('user.technology-transfer.archive', project.id), {
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
                            You are about to delete the project "{project.name}". This action requires password confirmation.
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
                    <Link href={`/user/technology-transfer/project/${project.id}`} className="font-medium hover:underline">
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
        accessorKey: "agency_partner",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Agency Partner" />
        },
        cell: ({ row }) => {
            const agencyPartner = row.getValue("agency_partner") as string
            if (!agencyPartner) return <span className="text-xs text-muted-foreground">Not specified</span>

            return (
                <span>{agencyPartner}</span>
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
            if (!leader) return <span className="text-xs text-muted-foreground">Not specified</span>

            return (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{leader}</span>
                </div>
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
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                        {new Date(date).toLocaleDateString()}
                    </span>
                </div>
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
                <span className="font-medium">₱{budget.toLocaleString()}</span>
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
                            <Link href={`/user/technology-transfer/project/${project.id}`} className="font-light flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/user/technology-transfer/project/${project.id}/edit`} className="font-light flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit project
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ArchiveProjectButton project={project} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]