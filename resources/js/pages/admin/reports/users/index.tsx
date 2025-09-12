import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Users, BarChart3, TrendingUp, Download, FileText, UserCheck, UserX, Shield, Building2, GraduationCap, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem, type Campus, type College } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    campus_college: {
        id: number;
        campus: Campus;
        college: College;
    } | null;
}

interface PaginationData {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}

interface PageProps {
    users: PaginationData;
    campuses: Campus[];
    colleges: College[];
    filters: {
        campus_id?: string;
        college_id?: string;
        user_type?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/admin/dashboard',
    },
    {
        title: 'Reports',
        href: '/admin/report/users',
    },
    {
        title: 'Users Report',
        href: '/admin/report/users',
    },
];

export default function UsersReport({ users, campuses, colleges, filters }: PageProps) {
    const [localFilters, setLocalFilters] = useState({
        campus_id: filters.campus_id || 'all',
        college_id: filters.college_id || 'all',
        user_type: filters.user_type || 'all',
        status: filters.status || 'all',
        search: filters.search || '',
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
    });

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyFilters = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(localFilters).filter(([_, value]) => value !== '' && value !== 'all')
        );
        router.get('/admin/report/users', cleanFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            campus_id: 'all',
            college_id: 'all',
            user_type: 'all',
            status: 'all',
            search: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
        router.get('/admin/report/users');
    };

    const generatePDF = () => {
        const params = new URLSearchParams();

        // Add current filters to the PDF URL
        Object.entries(localFilters).forEach(([key, value]) => {
            if (value && value !== 'all' && value !== '') {
                params.append(key, value);
            }
        });

        // Open PDF in a new window/tab
        const url = `/admin/report/users/pdf?${params.toString()}`;
        window.open(url, '_blank');
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getUserTypeBadge = (isAdmin: boolean) => {
        return isAdmin ? (
            <Badge variant="default" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin
            </Badge>
        ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Regular
            </Badge>
        );
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                <UserCheck className="h-3 w-3" />
                Active
            </Badge>
        ) : (
            <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-200">
                <UserX className="h-3 w-3" />
                Inactive
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Report" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Users Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive overview of all system users and their activity
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search users..."
                                        value={localFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* User Type Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">User Type</label>
                                <Select
                                    value={localFilters.user_type}
                                    onValueChange={(value) => handleFilterChange('user_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select User Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="admin">Admin Users</SelectItem>
                                        <SelectItem value="regular">Regular Users</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <Select
                                    value={localFilters.status}
                                    onValueChange={(value) => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Campus Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Campus</label>
                                <Select
                                    value={localFilters.campus_id}
                                    onValueChange={(value) => handleFilterChange('campus_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Campus" />
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
                            </div>

                            {/* College Filter */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">College</label>
                                <Select
                                    value={localFilters.college_id}
                                    onValueChange={(value) => handleFilterChange('college_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select College" />
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
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters} className='flex items-center gap-2'>
                                <Search className="h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="secondary" onClick={clearFilters}>
                                Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Users ({users.total})
                            </div>
                            <Button onClick={generatePDF} variant='outline'>
                                <Download className="h-4 w-4" />
                                Generate PDF
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Registration Date</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getUserTypeBadge(user.is_admin)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(user.is_active)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            <span className="text-xs">{user.campus_college?.campus?.name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <GraduationCap className="h-3 w-3" />
                                                            <span className="text-xs">{user.campus_college?.college?.name || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(user.created_at)}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(user.updated_at)}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {users.from} to {users.to} of {users.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    {users.prev_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(users.prev_page_url)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {users.next_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(users.next_page_url)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
