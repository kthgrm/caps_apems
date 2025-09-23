import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { College, Campus, CampusCollege } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { GraduationCap, Edit, MoreHorizontal, Trash, Eye, LoaderCircle } from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";

// Delete College Component with Password Confirmation
const DeleteCollegeButton = ({ college }: { college: CampusCollege }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const openDialog = () => {
        setIsDialogOpen(true);
        setPassword('');
        setErrorMessage('');
        setIsLoading(false);
    };

    const closeDialog = () => {
        if (isLoading) return; // Prevent closing during loading
        setIsDialogOpen(false);
        setPassword('');
        setErrorMessage('');
        setIsLoading(false);
    };

    const handleDelete = () => {
        if (!password.trim()) {
            setErrorMessage('Please enter your password to confirm.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        router.delete(`/admin/college/college/${college.college.id}`, {
            data: { password: password },
            onSuccess: () => {
                closeDialog();
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
            },
        });
    };

    return (
        <>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    openDialog();
                }}
                className="text-red-600 focus:text-red-600"
            >
                <Trash className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>

            <Dialog open={isDialogOpen} onOpenChange={() => { }}>
                <DialogContent
                    className="sm:max-w-[425px]"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>Delete College</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{college.college.name}"? This action cannot be undone and will also remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Enter your password to confirm:
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full"
                                placeholder="Password"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleDelete();
                                    }
                                }}
                            />
                            {errorMessage && <InputError message={errorMessage} />}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialog}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading || !password.trim()}
                            className="bg-red-700 hover:bg-red-800"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete College
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const columns: ColumnDef<CampusCollege>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="College Name" />
        ),
        cell: ({ row }) => {
            const colleges = row.original;
            return (
                <div className="flex flex-row gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={`/storage/${colleges.college.logo}`} alt={colleges.college.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                            <GraduationCap className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="font-medium">{colleges.college.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {colleges.college.code}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()}
                </div>
            );
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            return (
                <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const colleges = row.original;

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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/college/${colleges.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/college/college/${colleges.college.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteCollegeButton college={colleges} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];