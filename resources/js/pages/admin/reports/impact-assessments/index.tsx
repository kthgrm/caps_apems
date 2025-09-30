import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Users, BarChart3, TrendingUp, Download, FileText, Target, Building2, GraduationCap, Folder, BarChart } from 'lucide-react';
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
import { type BreadcrumbItem, type ImpactAssessment, type Campus, type College, type Project, type User } from '@/types';

interface PaginationData {
    current_page: number;
    data: ImpactAssessment[];
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
    total_assessments: number;
    total_direct_beneficiaries: number;
    total_indirect_beneficiaries: number;
    avg_direct_beneficiaries: number;
}

interface PageProps {
    assessments: PaginationData;
    campuses: Campus[];
    colleges: College[];
    projects: Project[];
    statistics: Statistics;
    filters: {
        campus_id?: string;
        college_id?: string;
        project_id?: string;
        direct_min?: string;
        direct_max?: string;
        indirect_min?: string;
        indirect_max?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    };
}

const ImpactAssessmentsReportPage: React.FC<PageProps> = ({
    assessments,
    campuses,
    colleges,
    projects,
    statistics,
    filters
}) => {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCampus, setSelectedCampus] = useState(filters.campus_id || 'all');
    const [selectedCollege, setSelectedCollege] = useState(filters.college_id || 'all');
    const [selectedProject, setSelectedProject] = useState(filters.project_id || 'all');
    const [directMin, setDirectMin] = useState(filters.direct_min || '');
    const [directMax, setDirectMax] = useState(filters.direct_max || '');
    const [indirectMin, setIndirectMin] = useState(filters.indirect_min || '');
    const [indirectMax, setIndirectMax] = useState(filters.indirect_max || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    const breadcrumbItems: BreadcrumbItem[] = [
        { title: "Administration", href: "/admin/dashboard" },
        { title: "Reports", href: "/admin/report/impact-assessments" },
        { title: "Impact Assessments Report", href: "/admin/report/impact-assessments" },
    ];

    const handleSearch = () => {
        router.get(route('admin.report.impact-assessments'), {
            search: searchQuery,
            campus_id: selectedCampus === 'all' ? '' : selectedCampus,
            college_id: selectedCollege === 'all' ? '' : selectedCollege,
            project_id: selectedProject === 'all' ? '' : selectedProject,
            direct_min: directMin,
            direct_max: directMax,
            indirect_min: indirectMin,
            indirect_max: indirectMax,
            date_from: dateFrom,
            date_to: dateTo,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (column: string) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(newSortOrder);

        router.get(route('admin.report.impact-assessments'), {
            search: searchQuery,
            campus_id: selectedCampus === 'all' ? '' : selectedCampus,
            college_id: selectedCollege === 'all' ? '' : selectedCollege,
            project_id: selectedProject === 'all' ? '' : selectedProject,
            direct_min: directMin,
            direct_max: directMax,
            indirect_min: indirectMin,
            indirect_max: indirectMax,
            date_from: dateFrom,
            date_to: dateTo,
            sort_by: column,
            sort_order: newSortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePagination = (url: string) => {
        if (!url) return;
        router.get(url);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCampus('all');
        setSelectedCollege('all');
        setSelectedProject('all');
        setDirectMin('');
        setDirectMax('');
        setIndirectMin('');
        setIndirectMax('');
        setDateFrom('');
        setDateTo('');
        setSortBy('created_at');
        setSortOrder('desc');

        router.get(route('admin.report.impact-assessments'));
    };

    const downloadPDF = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCampus && selectedCampus !== 'all') params.append('campus_id', selectedCampus);
        if (selectedCollege && selectedCollege !== 'all') params.append('college_id', selectedCollege);
        if (selectedProject && selectedProject !== 'all') params.append('project_id', selectedProject);
        if (directMin) params.append('direct_min', directMin);
        if (directMax) params.append('direct_max', directMax);
        if (indirectMin) params.append('indirect_min', indirectMin);
        if (indirectMax) params.append('indirect_max', indirectMax);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);

        window.open(`${route('admin.report.impact-assessments.pdf')}?${params.toString()}`, '_blank');
    };

    // Filter colleges based on selected campus
    const filteredColleges = selectedCampus && selectedCampus !== 'all'
        ? colleges.filter(college => college.campus_id && college.campus_id.toString() === selectedCampus)
        : colleges;

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatBeneficiaries = (count: number | null | undefined) => {
        if (!count) return '0';
        return count.toLocaleString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbItems}>
            <Head title="Impact Assessments Report" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-medium">Impact Assessments Report</h1>
                        <p className="text-muted-foreground">
                            Comprehensive overview of all impact assessments and their beneficiaries
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
                                        placeholder="Search assessments..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Filter Selects */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Campus</label>
                                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
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
                                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select College" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Colleges</SelectItem>
                                        {filteredColleges.map((college) => (
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
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    placeholder="From Month"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">To</label>
                                <Input
                                    type="month"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    placeholder="To Month"
                                />
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleSearch} className='flex items-center gap-2'>
                                <Search className="h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="secondary" onClick={clearFilters}>
                                Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Impact Assessments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Impact Assessments ({assessments.total})
                            </div>
                            <Button onClick={downloadPDF} variant='outline'>
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
                                        <TableHead>Project & Beneficiary</TableHead>
                                        <TableHead>Geographic Coverage</TableHead>
                                        <TableHead>College</TableHead>
                                        <TableHead>Direct Impact</TableHead>
                                        <TableHead>Indirect Impact</TableHead>
                                        <TableHead>Total Impact</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assessments.data.map((assessment) => (
                                        <TableRow key={assessment.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{assessment.project?.name || 'N/A'}</p>
                                                    {assessment.beneficiary && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {assessment.beneficiary.substring(0, 60)}{assessment.beneficiary.length > 60 ? '...' : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Target className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{assessment.geographic_coverage || 'Not specified'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            <span className="text-xs">{assessment.project?.campus_college?.campus?.name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <GraduationCap className="h-3 w-3" />
                                                            <span className="text-xs">{assessment.project?.campus_college?.college?.name || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span className="font-medium">{formatBeneficiaries(assessment.num_direct_beneficiary)}</span>
                                                    </div>
                                                    <div className="text-muted-foreground text-xs mt-1">
                                                        Direct beneficiaries
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="h-3 w-3" />
                                                        <span className="font-medium">{formatBeneficiaries(assessment.num_indirect_beneficiary)}</span>
                                                    </div>
                                                    <div className="text-muted-foreground text-xs mt-1">
                                                        Indirect beneficiaries
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <BarChart3 className="h-3 w-3" />
                                                        <span className="font-bold text-primary">
                                                            {formatBeneficiaries((assessment.num_direct_beneficiary || 0) + (assessment.num_indirect_beneficiary || 0))}
                                                        </span>
                                                    </div>
                                                    <div className="text-muted-foreground text-xs mt-1">
                                                        Total impact
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{formatDate(assessment.created_at)}</p>
                                                    <p className="text-muted-foreground">by {assessment.user?.name || 'N/A'}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {assessments.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {assessments.from} to {assessments.to} of {assessments.total} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    {assessments.prev_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(assessments.prev_page_url)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {assessments.next_page_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(assessments.next_page_url)}
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
};

export default ImpactAssessmentsReportPage;
