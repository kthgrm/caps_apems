import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Badge } from "@/components/ui/badge";
import { Modalities } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Radio, Edit, Eye, MoreHorizontal, Trash, Tv, Globe, Clock } from "lucide-react";
import { route } from "ziggy-js";
import { useState } from "react";

// Archive Modality Component with Password Confirmation
const ArchiveModalityButton = ({ modality }: { modality: Modalities }) => {
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

        router.patch(route('user.modalities.archive', modality.id), {
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
                            You are about to delete the modality for project "{modality.project?.name}". This action requires password confirmation.
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

export const columns: ColumnDef<Modalities>[] = [
    {
        accessorFn: (row) => row.project?.name,
        id: "project_name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Project" />
        },
        cell: ({ row }: any) => {
            const modality = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-orange-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">{modality.project.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {modality.id}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "modality",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Delivery Mode" />
        },
        cell: ({ row }: any) => {
            const modalityType = row.getValue("modality") as string;
            const getModalityIcon = () => {
                switch (modalityType?.toLowerCase()) {
                    case 'tv':
                    case 'television':
                        return <Tv className="h-3 w-3" />;
                    case 'radio':
                        return <Radio className="h-3 w-3" />;
                    case 'online':
                    case 'internet':
                        return <Globe className="h-3 w-3" />;
                    default:
                        return <Radio className="h-3 w-3" />;
                }
            };

            return modalityType ? (
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    {getModalityIcon()}
                    {modalityType}
                </Badge>
            ) : (
                <span className="text-muted-foreground text-sm">Not specified</span>
            );
        },
    },
    {
        accessorKey: "tv_channel",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="TV Channel" />
        },
        cell: ({ row }: any) => {
            const tvChannel = row.getValue("tv_channel") as string;
            return tvChannel ? (
                <span className="line-clamp-2">{tvChannel}</span>
            ) : (
                <span className="text-muted-foreground text-sm">—</span>
            );
        },
    },
    {
        accessorKey: "radio",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Radio Station" />
        },
        cell: ({ row }: any) => {
            const radio = row.getValue("radio") as string;
            return radio ? (
                <span className="line-clamp-2">{radio}</span>
            ) : (
                <span className="text-muted-foreground text-sm">—</span>
            );
        },
    },
    {
        accessorKey: "time_air",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Air Time" />
        },
        cell: ({ row }: any) => {
            const timeAir = row.getValue("time_air") as string;
            return timeAir ? (
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{timeAir}</span>
                </div>
            ) : (
                <span className="text-muted-foreground text-sm">—</span>
            );
        },
    },
    {
        accessorKey: "partner_agency",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Partner Agency" />
        },
        cell: ({ row }: any) => {
            const partnerAgency = row.getValue("partner_agency") as string;
            return partnerAgency ? (
                <span className="line-clamp-2">{partnerAgency}</span>
            ) : (
                <span className="text-muted-foreground text-sm">—</span>
            );
        },
    },
    {
        id: "actions",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Actions" />
        },
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
                            <Link href={`/user/modalities/${modality.id}`} className="font-light flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/user/modalities/${modality.id}/edit`} className="font-light flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit modality
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ArchiveModalityButton modality={modality} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]
