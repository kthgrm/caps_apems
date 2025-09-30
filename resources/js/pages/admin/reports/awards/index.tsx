import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Award, BarChart3, TrendingUp, Download, FileText, Users, Trophy, Building2, GraduationCap, Star } from 'lucide-react';
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
import { type BreadcrumbItem, type Campus, type College, type User } from '@/types';

interface Award {
    id: number;
    award_name: string;
    date_received: string | null;
    description: string | null;
    event_details: string | null;
    awarding_body: string | null;
    location: string | null;
    people_involved: string | null;
    attachment_link: string | null;
    attachment_path: string | null;
    created_at: string;
    updated_at: string;
    user: User | null;
    campus_college: {
        id: number;
        campus: Campus;
        college: College;
    } | null;
}

interface PaginationData {
    current_page: number;
    data: Award[];
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
    awards: PaginationData;
    campuses: Campus[];
    colleges: College[];
    filters: {
        campus_id?: string;
        college_id?: string;
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
        href: '/admin/report/awards',
    },
    {
        title: 'Awards Report',
        href: '/admin/report/awards',
    },
];

export default function AwardsReport({ awards, campuses, colleges, filters }: PageProps) {
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
        router.get('/admin/report/awards', cleanFilters, {
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
        router.get('/admin/report/awards');
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
        const url = `/admin/report/awards/pdf?${params.toString()}`;
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

    const getYearFromDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).getFullYear().toString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Awards Report" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Awards Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive overview of all awards received by the institution
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
                                        placeholder="Search awards..."
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
                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium mb-2">From</label>
                                <Input
                                    type="month"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    placeholder="From Month"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">To</label>
                                <Input
                                    type="month"
                                    value={localFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    placeholder="To Month"
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

                {/* Awards Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Awards ({awards.total})
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
                                        <TableHead>Award</TableHead>
                                        <TableHead>Awarding Body</TableHead>
                                        <TableHead>Date Received</TableHead>
                                        <TableHead>College</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>People Involved</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {awards.data.map((award) => (
                                        <TableRow key={award.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{award.award_name}</p>
                                                    {award.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {award.description.substring(0, 60)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{award.awarding_body || 'Not specified'}</p>
                                                    {award.event_details && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {award.event_details.substring(0, 30)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(award.date_received)}</p>
                                                    <Badge variant="outline" className="mt-1">
                                                        {getYearFromDate(award.date_received)}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            <span className="text-xs">{award.campus_college?.campus?.name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <GraduationCap className="h-3 w-3" />
                                                            <span className="text-xs">{award.campus_college?.college?.name || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{award.location || 'Not specified'}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm max-w-48">
                                                    {award.people_involved ? (
                                                        <p className="truncate" title={award.people_involved}>
                                                            {award.people_involved}
                                                        </p>
                                                    ) : (
                                                        <p className="text-muted-foreground">Not specified</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(award.created_at)}</p>
                                                    <p className="text-muted-foreground">by {award.user?.name || 'N/A'}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {awards.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {awards.from} to {awards.to} of {awards.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    {awards.prev_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(awards.prev_page_url)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {awards.next_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(awards.next_page_url)}
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
