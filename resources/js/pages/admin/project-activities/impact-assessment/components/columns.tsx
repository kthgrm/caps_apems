import { ColumnDef } from '@tanstack/react-table';
import { ImpactAssessment } from '@/types';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users, MapPin, FilePenLine, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Link, router } from '@inertiajs/react';
import { route } from "ziggy-js";
import { useState } from "react";

// Archive Assessment Component with Password Confirmation
const ArchiveAssessmentButton = ({ assessment }: { assessment: ImpactAssessment }) => {
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

        router.patch(`/admin/impact-assessment/${assessment.id}/archive`, {
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
                Delete assessment
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
                            You are about to delete the impact assessment for "{assessment.project?.name || 'Unknown Project'}". This action requires password confirmation.
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
                            className="bg-red-700 hover:bg-red-800"
                        >
                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

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
                            <Link href={`/admin/impact-assessment/assessments/${impactAssessment.id}`} className="font-light">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/impact-assessment/assessments/${impactAssessment.id}/edit`} className="font-light">
                                Edit assessment
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ArchiveAssessmentButton assessment={impactAssessment} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
