import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Calendar, FileCheck, Users, BarChart3, TrendingUp, Download, FileText, Building2, GraduationCap, CheckCircle, XCircle, Clock } from 'lucide-react';
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
import { type BreadcrumbItem, type User } from '@/types';

interface Resolution {
    id: number;
    resolution_number: string;
    year_of_effectivity: string;
    expiration: string;
    contact_person: string | null;
    contact_number_email: string | null;
    partner_agency_organization: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

interface PaginationData {
    current_page: number;
    data: Resolution[];
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
    resolutions: PaginationData;
    filters: {
        status?: string;
        year?: string;
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
        href: '/admin/report/resolutions',
    },
    {
        title: 'Resolutions Report',
        href: '/admin/report/resolutions',
    },
];

export default function ResolutionsReport({ resolutions, filters }: PageProps) {
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || 'all',
        year: filters.year || 'all',
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
        router.get('/admin/report/resolutions', cleanFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            status: 'all',
            year: 'all',
            date_from: '',
            date_to: '',
            search: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
        router.get('/admin/report/resolutions');
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
        const url = `/admin/report/resolutions/pdf?${params.toString()}`;
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

    const getStatusBadge = (resolution: Resolution) => {
        const currentDate = new Date();
        const expirationDate = new Date(resolution.expiration);
        const effectivityDate = new Date(resolution.year_of_effectivity);

        // Check if expired
        if (expirationDate < currentDate) {
            return (
                <Badge className="flex items-center gap-1 bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3" />
                    Expired
                </Badge>
            );
        }

        // Check if expiring soon (within 30 days)
        const daysToExpiration = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysToExpiration <= 30 && daysToExpiration > 0) {
            return (
                <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3" />
                    Expiring Soon
                </Badge>
            );
        }

        // Check if active
        if (effectivityDate <= currentDate && expirationDate >= currentDate) {
            return (
                <Badge className="flex items-center gap-1 bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3" />
                    Active
                </Badge>
            );
        }

        // Future effective date
        return (
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
                <Clock className="h-3 w-3" />
                Pending
            </Badge>
        );
    };

    // Generate year options for the filter
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear + 5; year >= currentYear - 10; year--) {
            years.push(year);
        }
        return years;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resolutions Report" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Resolutions Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive overview of all resolutions and their status
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
                                        placeholder="Search resolutions..."
                                        value={localFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Sort By</label>
                                <Select
                                    value={localFilters.sort_by}
                                    onValueChange={(value) => handleFilterChange('sort_by', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="created_at">Created Date</SelectItem>
                                        <SelectItem value="resolution_number">Resolution Number</SelectItem>
                                        <SelectItem value="year_of_effectivity">Effectivity Year</SelectItem>
                                        <SelectItem value="expiration">Expiration Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium mb-2">From</label>
                                <Input
                                    type="month"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    placeholder="From Month"
                                />
                            </div>

                            {/* Date To */}
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

                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters}>
                                Apply Filters
                            </Button>
                            <Button onClick={clearFilters} variant="outline">
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Resolutions ({resolutions.total.toLocaleString()})
                            <Button onClick={generatePDF} variant="outline" className="ml-auto">
                                <Download className="h-4 w-4 mr-2" />
                                Export PDF
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Resolution Number</TableHead>
                                        <TableHead>Effectivity Year</TableHead>
                                        <TableHead>Expiration Date</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Contact Info</TableHead>
                                        <TableHead>Partner Agency</TableHead>
                                        <TableHead>Submitted By</TableHead>
                                        <TableHead>Created Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {resolutions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center text-muted-foreground">
                                                No resolutions found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        resolutions.data.map((resolution) => (
                                            <TableRow key={resolution.id}>
                                                <TableCell className="font-medium">
                                                    {resolution.resolution_number}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(resolution.year_of_effectivity).getFullYear()}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(resolution.expiration)}
                                                </TableCell>
                                                <TableCell>
                                                    {resolution.contact_person || 'Not specified'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {resolution.contact_number_email || 'Not specified'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {resolution.partner_agency_organization || 'Not specified'}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {resolution.user.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {resolution.user.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(resolution.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {resolutions.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {resolutions.from} to {resolutions.to} of {resolutions.total} results
                                </div>
                                <div className="flex gap-2">
                                    {resolutions.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                }
                                            }}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
