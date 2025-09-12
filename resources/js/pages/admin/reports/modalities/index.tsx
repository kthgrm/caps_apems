import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Radio, Tv, Globe, Clock, Users, BarChart3, TrendingUp, Download, FileText, Building2, GraduationCap, Folder } from 'lucide-react';
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
import { type BreadcrumbItem, type Campus, type College, type User } from '@/types';

interface Modality {
    id: number;
    modality: string;
    tv_channel: string | null;
    radio: string | null;
    online_link: string | null;
    time_air: string | null;
    period: string | null;
    partner_agency: string | null;
    hosted_by: string | null;
    created_at: string;
    updated_at: string;
    user: User;
    project: {
        id: number;
        name: string;
        campus_college: {
            id: number;
            campus: Campus;
            college: College;
        } | null;
    };
}

interface PaginationData {
    current_page: number;
    data: Modality[];
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
    modalities: PaginationData;
    campuses: Campus[];
    colleges: College[];
    filters: {
        campus_id?: string;
        college_id?: string;
        modality_type?: string;
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
        href: '/admin/report/modalities',
    },
    {
        title: 'Modalities Report',
        href: '/admin/report/modalities',
    },
];

export default function ModalitiesReport({ modalities, campuses, colleges, filters }: PageProps) {
    const [localFilters, setLocalFilters] = useState({
        campus_id: filters.campus_id || 'all',
        college_id: filters.college_id || 'all',
        modality_type: filters.modality_type || 'all',
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
        router.get('/admin/report/modalities', cleanFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            campus_id: 'all',
            college_id: 'all',
            modality_type: 'all',
            date_from: '',
            date_to: '',
            search: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
        router.get('/admin/report/modalities');
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
        const url = `/admin/report/modalities/pdf?${params.toString()}`;
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

    const getModalityBadge = (modality: string) => {
        const modalityMap: { [key: string]: { icon: any; color: string } } = {
            'TV': { icon: Tv, color: 'bg-blue-100 text-blue-800' },
            'Radio': { icon: Radio, color: 'bg-green-100 text-green-800' },
            'Online': { icon: Globe, color: 'bg-purple-100 text-purple-800' },
        };

        const config = modalityMap[modality] || { icon: Folder, color: 'bg-gray-100 text-gray-800' };
        const Icon = config.icon;

        return (
            <Badge className={`flex items-center gap-1 ${config.color}`}>
                <Icon className="h-3 w-3" />
                {modality}
            </Badge>
        );
    };

    const getFilteredColleges = () => {
        if (localFilters.campus_id === 'all') return colleges;
        // For simplicity, we'll show all colleges when a campus is selected
        // In a real application, you'd need to filter based on the campus-college relationship
        return colleges;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modalities Report" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Modalities Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive overview of all modalities and their distribution
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
                                        placeholder="Search modalities..."
                                        value={localFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Modality Type Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Modality Type</label>
                                <Select
                                    value={localFilters.modality_type}
                                    onValueChange={(value) => handleFilterChange('modality_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Modality Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="TV">TV</SelectItem>
                                        <SelectItem value="Radio">Radio</SelectItem>
                                        <SelectItem value="Online">Online</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Campus Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Campus</label>
                                <Select
                                    value={localFilters.campus_id}
                                    onValueChange={(value) => {
                                        handleFilterChange('campus_id', value);
                                        handleFilterChange('college_id', 'all');
                                    }}
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
                            <div>
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
                                        {getFilteredColleges().map((college) => (
                                            <SelectItem key={college.id} value={college.id.toString()}>
                                                {college.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium mb-2">From Date</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="block text-sm font-medium mb-2">To Date</label>
                                <Input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
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
                        <CardTitle className="flex items-center gap-2 justify-between">
                            <div className='flex items-center gap-2'>
                                <FileText className="h-5 w-5" />
                                Modalities ({modalities.total.toLocaleString()})
                            </div>
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
                                        <TableHead>Modality Type</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Channel/Link</TableHead>
                                        <TableHead>Time/Period</TableHead>
                                        <TableHead>Partner Agency</TableHead>
                                        <TableHead>Hosted By</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {modalities.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                                                No modalities found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        modalities.data.map((modality) => (
                                            <TableRow key={modality.id}>
                                                <TableCell>
                                                    {getModalityBadge(modality.modality)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold">
                                                            {modality.project.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            by {modality.user.name}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {modality.tv_channel && (
                                                            <div>TV: {modality.tv_channel}</div>
                                                        )}
                                                        {modality.radio && (
                                                            <div>Radio: {modality.radio}</div>
                                                        )}
                                                        {modality.online_link && (
                                                            <div className="truncate max-w-32" title={modality.online_link}>
                                                                Online: {modality.online_link}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {modality.time_air && (
                                                            <div>Time: {modality.time_air}</div>
                                                        )}
                                                        {modality.period && (
                                                            <div>Period: {modality.period}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {modality.partner_agency || 'Not specified'}
                                                </TableCell>
                                                <TableCell>
                                                    {modality.hosted_by || 'Not specified'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(modality.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {modalities.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {modalities.from} to {modalities.to} of {modalities.total} results
                                </div>
                                <div className="flex gap-2">
                                    {modalities.links.map((link, index) => (
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
