import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner'
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Campus, College, Project } from '@/types'
import { Head, usePage } from '@inertiajs/react';
import { Building, DollarSign, Target } from 'lucide-react';
import React, { useEffect } from 'react'
import { toast } from 'sonner';
import { ProjectsTable } from '@/components/tables/admin/projects-table';
import { DataTable } from '@/components/data-table';
import { columns } from './components/columns';

type PageProps = {
    campus: Campus;
    college: College;
    projects: Project[];
    flash?: { message?: string };
    stats?: {
        total_projects: number;
        total_budget: number;
        completed_projects: number;
        ongoing_projects: number;
        average_progress: number;
    };
};

export default function Projects() {
    const { campus, college, projects, flash, stats } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Technology Transfer',
            href: '/admin/technology-transfer',
        },
        {
            title: 'Campus',
            href: '/admin/technology-transfer',
        },
        {
            title: 'College',
            href: `/admin/technology-transfer/${campus.id}`,
        },
        {
            title: 'Projects',
            href: `/admin/technology-transfer/${campus.id}/${college.id}`,
        },
    ]

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    const total_projects = projects.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Technology Transfer" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className='text-2xl font-bold'>Projects</h1>
                    </div>
                </div>

                {/* Campus and College Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Department
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                {campus.logo && (
                                    <img
                                        src={asset(campus.logo)}
                                        alt="Campus logo"
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-lg">{campus.name}</h3>
                                    <p className="text-sm text-muted-foreground">Campus</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                {college.logo && (
                                    <img
                                        src={asset(college.logo)}
                                        alt="College logo"
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-lg">{college.name}</h3>
                                    <p className="text-sm text-muted-foreground">College • {college.code}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Projects
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total_projects}</div>
                            <p className="text-xs text-muted-foreground">
                                Active projects
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects Table with Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Projects List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={projects}
                            searchKey="name"
                            searchPlaceholder="Search projects..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}