import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Project, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { Plus, Folder } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { columns } from './components/columns';

type ProjectProps = {
    projects: Project[];
    flash?: { message: string; }
}

export default function Projects() {
    const { projects, flash } = usePage<ProjectProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Technology Transfer',
            href: '/user/technology-transfer',
        },
        {
            title: 'Projects',
            href: '/user/technology-transfer',
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    });

    const ProjectActions = () => (
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/user/technology-transfer/project/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className='hidden lg:block'>Add New Project</span>
                </Link>
            </Button>
        </div>
    );

    const totalProjects = projects.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Projects</h1>
                        <p className="text-muted-foreground">Manage your technology transfer projects</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-blue-200/50" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium">
                                Total Projects
                            </CardTitle>
                            <Folder className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent className='relative z-10'>
                            <div className="text-2xl font-bold text-blue-500">{totalProjects}</div>
                            <p className="text-xs">
                                Active projects
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Project List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={projects}
                            searchKey="name"
                            searchPlaceholder="Search projects..."
                            actionComponent={<ProjectActions />}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
