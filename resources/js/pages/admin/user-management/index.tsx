import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, CampusCollege, User } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Shield, ShieldCheck, ShieldOff, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
];

type PageProps = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    campusColleges: CampusCollege[];
    campuses: Array<{ id: number; name: string }>;
    colleges: Array<{ id: number; name: string }>;
    stats: {
        total: number;
        admin: number;
        regular: number;
        active: number;
        inactive: number;
    };
    filters: {
        search?: string;
        is_admin?: string;
        campus_id?: string;
        college_id?: string;
        campus_college_id?: string;
    };
    flash?: {
        message: string;
    };
};

export default function UserManagementIndex() {
    const { users, campusColleges, campuses, colleges, stats, filters, flash } = usePage<PageProps>().props;
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [userTypeFilter, setUserTypeFilter] = useState<string>(
        filters.is_admin === 'true' ? 'admin' :
            filters.is_admin === 'false' ? 'user' : 'all'
    );
    const [campusFilter, setCampusFilter] = useState<string>(filters.campus_id || 'all');
    const [collegeFilter, setCollegeFilter] = useState<string>(filters.college_id || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    // Debounce search to avoid too many requests
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);

            if (searchQuery) {
                params.set('search', searchQuery);
            } else {
                params.delete('search');
            }

            router.get(window.location.pathname, Object.fromEntries(params), {
                preserveState: true,
                preserveScroll: true,
                only: ['users'],
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle filter changes with server requests
    const handleUserTypeFilterChange = (value: string) => {
        setUserTypeFilter(value);
        const params = new URLSearchParams(window.location.search);

        if (value === 'all') {
            params.delete('is_admin');
        } else if (value === 'admin') {
            params.set('is_admin', 'true');
        } else if (value === 'user') {
            params.set('is_admin', 'false');
        }

        router.get(window.location.pathname, Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    const handleCampusFilterChange = (value: string) => {
        setCampusFilter(value);
        const params = new URLSearchParams(window.location.search);

        if (value === 'all') {
            params.delete('campus_id');
        } else {
            params.set('campus_id', value);
        }

        router.get(window.location.pathname, Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    const handleCollegeFilterChange = (value: string) => {
        setCollegeFilter(value);
        const params = new URLSearchParams(window.location.search);

        if (value === 'all') {
            params.delete('college_id');
        } else {
            params.set('college_id', value);
        }

        router.get(window.location.pathname, Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    const handleCampusCollegeFilterChange = (value: string) => {
        setCampusFilter('all');
        setCollegeFilter('all');
        const params = new URLSearchParams(window.location.search);

        // Clear separate campus and college filters
        params.delete('campus_id');
        params.delete('college_id');

        if (value === 'all') {
            params.delete('campus_college_id');
        } else {
            params.set('campus_college_id', value);
        }

        router.get(window.location.pathname, Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    const clearFilters = () => {
        setUserTypeFilter('all');
        setCampusFilter('all');
        setCollegeFilter('all');
        setSearchQuery('');
        router.get(window.location.pathname, {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    const handleToggleAdmin = (user: User) => {
        const action = user.is_admin ? 'remove admin privileges from' : 'grant admin privileges to';
        if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            router.patch(`/admin/users/${user.id}/toggle-admin`);
        }
    };

    const handleActivateSelected = () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select users to activate');
            return;
        }

        if (confirm(`Are you sure you want to activate ${selectedUsers.length} user(s)?`)) {
            const userIds = selectedUsers.map(user => user.id);
            router.patch('/admin/users/bulk-activate', { user_ids: userIds });
            setSelectedUsers([]);
        }
    };

    const handleDeactivateSelected = () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select users to deactivate');
            return;
        }

        if (confirm(`Are you sure you want to deactivate ${selectedUsers.length} user(s)?`)) {
            const userIds = selectedUsers.map(user => user.id);
            router.patch('/admin/users/bulk-deactivate', { user_ids: userIds });
            setSelectedUsers([]);
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        if (value) {
                            setSelectedUsers(users.data);
                        } else {
                            setSelectedUsers([]);
                        }
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                row.getValue("is_admin") ? null : (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                            const user = row.original;
                            if (value) {
                                setSelectedUsers(prev => [...prev, user]);
                            } else {
                                setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
                            }
                        }}
                        aria-label="Select row"
                    />
                )
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "campus_college",
            header: "Campus & College",
            cell: ({ row }) => {
                const campusCollege = row.getValue("campus_college") as any;
                return (
                    <div className="text-sm">
                        {campusCollege ? (
                            <>
                                <div className="font-medium">{campusCollege.campus.name}</div>
                                <div className="text-muted-foreground">{campusCollege.college.name}</div>
                            </>
                        ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "is_admin",
            header: "Role",
            cell: ({ row }) => {
                const isAdmin = row.getValue("is_admin") as boolean;
                return (
                    <Badge variant={isAdmin ? "default" : "secondary"}>
                        {isAdmin ? (
                            <>
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                Admin
                            </>
                        ) : (
                            <>
                                <Shield className="mr-1 h-3 w-3" />
                                User
                            </>
                        )}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean;
                return (
                    <Badge variant={isActive ? "default" : "destructive"} className={isActive ? "" : "bg-red-800"}>
                        {isActive ? (
                            <>
                                <UserCheck className="mr-1 h-3 w-3" />
                                Active
                            </>
                        ) : (
                            <>
                                <UserX className="mr-1 h-3 w-3" />
                                Inactive
                            </>
                        )}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"));
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

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
                                <Link href={`/admin/users/${user.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleAdmin(user)}>
                                {user.is_admin ? (
                                    <>
                                        <ShieldOff className="mr-2 h-4 w-4" />
                                        Remove Admin
                                    </>
                                ) : (
                                    <>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Make Admin
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDelete(user)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const searchComponent = (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-8"
            />
        </div>
    );

    const filterComponent = (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select value={userTypeFilter} onValueChange={handleUserTypeFilterChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Admin Users</SelectItem>
                    <SelectItem value="user">Regular Users</SelectItem>
                </SelectContent>
            </Select>

            <Select value={campusFilter} onValueChange={handleCampusFilterChange}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Campus" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Campuses</SelectItem>
                    {campuses.map((campus) => (
                        <SelectItem key={campus.id} value={campus.id.toString()}>
                            {campus.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={collegeFilter} onValueChange={handleCollegeFilterChange}>
                <SelectTrigger className="w-[320px]">
                    <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id.toString()}>
                            {college.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(userTypeFilter !== "all" || campusFilter !== "all" || collegeFilter !== "all" || searchQuery) && (
                <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="h-8 px-2 lg:px-3"
                >
                    Clear
                </Button>
            )}
        </div>
    );

    const actionComponent = (
        <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
                <>
                    <Button
                        onClick={handleActivateSelected}
                        size="sm"
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                    >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                    </Button>
                    <Button
                        onClick={handleDeactivateSelected}
                        size="sm"
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                    </Button>
                </>
            )}
            <Link href="/admin/users/create">
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </Link>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage system users and their permissions
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.admin}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.regular}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.inactive}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-1 items-center space-x-2 w-full">
                            {searchComponent}
                            {filterComponent}
                        </div>
                        <div className="flex items-center space-x-2">
                            {actionComponent}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={users.data}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
