import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Calendar, DollarSign, BarChart3, TrendingUp, Download, FileText, Users, Target, Building2, GraduationCap, Folder } from 'lucide-react';
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
import { type BreadcrumbItem, type Project, type Campus, type College, type User } from '@/types';

interface PaginationData {
    current_page: number;
    data: Project[];
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

interface Statistics {
    total_projects: number;
    total_budget: number;
    avg_budget: number;
    projects_by_month: Array<{ period: string; count: number }>;
}

interface PageProps {
    projects: PaginationData;
    campuses: Campus[];
    colleges: College[];
    filters: {
        campus_id?: string;
        college_id?: string;
        date_from?: string;
        date_to?: string;
        budget_min?: string;
        budget_max?: string;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
    statistics: Statistics;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/admin/dashboard',
    },
    {
        title: 'Reports',
        href: '/admin/report/projects',
    },
    {
        title: 'Projects Report',
        href: '/admin/report/projects',
    },
];

export default function ProjectsReport({ projects, campuses, colleges, filters }: PageProps) {
    const [localFilters, setLocalFilters] = useState({
        campus_id: filters.campus_id || 'all',
        college_id: filters.college_id || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
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
        router.get('/admin/report/projects', cleanFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            campus_id: 'all',
            college_id: 'all',
            date_from: '',
            date_to: '',
            search: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
        router.get('/admin/report/projects');
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
        const url = `/admin/report/projects/pdf?${params.toString()}`;
        window.open(url, '_blank');
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (!amount) return 'No budget specified';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (startDate: string | null | undefined, endDate: string | null | undefined) => {
        if (!startDate || !endDate) {
            return <Badge variant="secondary">Date TBD</Badge>;
        }

        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return <Badge variant="secondary">Upcoming</Badge>;
        } else if (now > end) {
            return <Badge variant="outline">Completed</Badge>;
        } else {
            return <Badge variant="default">Ongoing</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects Report" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Projects Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive overview of all technology transfer projects
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
                                        placeholder="Search projects..."
                                        value={localFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Filter Selects */}
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
                            {/* Date Range Range */}
                            <div>
                                <label className="block text-sm font-medium mb-2">From Date</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    placeholder="From Date"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">To Date</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    placeholder="To Date"
                                />
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

                {/* Projects Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Folder className="h-5 w-5" />
                                Projects ({projects.total})
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
                                        <TableHead>Project</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Leader</TableHead>
                                        <TableHead>College</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.data.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{project.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {project.description?.substring(0, 60)}...
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{project.category || 'Unspecified'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{project.leader || 'Not assigned'}</p>
                                                    <p className="text-sm text-muted-foreground">Project Leader</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            <span className="text-xs">{project.campus_college?.campus?.name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <GraduationCap className="h-3 w-3" />
                                                            <span className="text-xs">{project.campus_college?.college?.name || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(project.budget)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(project.start_date)}</p>
                                                    <p className="text-muted-foreground">to {formatDate(project.end_date)}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(project.start_date, project.end_date)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(project.created_at)}</p>
                                                    <p className="text-muted-foreground">by {project.user?.name || 'N/A'}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {projects.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {projects.from} to {projects.to} of {projects.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    {projects.prev_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(projects.prev_page_url)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {projects.next_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(projects.next_page_url)}
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
