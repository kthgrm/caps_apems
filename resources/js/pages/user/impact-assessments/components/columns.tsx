import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { ImpactAssessment } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { AwardIcon, BarChart, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
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

        router.patch(route('user.impact-assessments.archive', assessment.id), {
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
                            You are about to delete the assessment for project "{assessment.project?.name}". This action requires password confirmation.
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

export const columns: ColumnDef<ImpactAssessment>[] = [
    {
        accessorFn: (row) => row.project?.name,
        id: "project_name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Project Assessment" />
        },
        cell: ({ row }: any) => {
            const assessment = row.original;
            return (
                <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-purple-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">{assessment.project.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {assessment.id}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "beneficiary",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Beneficiary" />
        },
        cell: ({ row }: any) => {
            const beneficiary = row.getValue("beneficiary") as string;
            return beneficiary ? (
                <span className="line-clamp-2">{beneficiary}</span>
            ) : (
                <span className="text-muted-foreground text-sm">Not specified</span>
            );
        },
    },
    {
        accessorKey: "geographic_coverage",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Geographic Coverage" />
        },
        cell: ({ row }: any) => {
            const geographicCoverage = row.getValue("geographic_coverage") as string;
            return geographicCoverage ? (
                <span className="line-clamp-2">{geographicCoverage}</span>
            ) : (
                <span className="text-muted-foreground text-sm">Not specified</span>
            );
        },
    },
    {
        accessorKey: "num_direct_beneficiary",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Direct Beneficiaries" />
        },
        cell: ({ row }: any) => {
            const numDirectBeneficiaries = row.getValue("num_direct_beneficiary") as number;
            return numDirectBeneficiaries ? (
                <span className="line-clamp-2">{numDirectBeneficiaries}</span>
            ) : (
                <span className="text-muted-foreground text-sm">Not specified</span>
            );
        },
    },
    {
        accessorKey: "num_indirect_beneficiary",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Indirect Beneficiaries" />
        },
        cell: ({ row }: any) => {
            const numIndirectBeneficiaries = row.getValue("num_indirect_beneficiary") as number;
            return numIndirectBeneficiaries ? (
                <span className="line-clamp-2">{numIndirectBeneficiaries}</span>
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
            const assessment = row.original;

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
                            <Link href={`/user/impact-assessments/${assessment.id}`} className="font-light flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/user/impact-assessments/${assessment.id}/edit`} className="font-light flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit assessment
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ArchiveAssessmentButton assessment={assessment} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]