import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Radio, Plus, Filter, Download, Eye, Edit, Trash2, Globe, Earth, Locate, Map } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { DataTable } from '@/components/data-table';
import type { BreadcrumbItem, Modalities } from '@/types';
import { columns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Activities',
        href: '/user/modalities',
    },
    {
        title: 'Modalities',
        href: '/user/modalities',
    },
];

type PageProps = {
    modalities: Modalities[];
    flash?: { message?: string };
};

export default function ModalitiesList() {
    const { modalities, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const ModalitiesActions = () => (
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/user/modalities/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className='hidden lg:block'>Add New Modality</span>
                </Link>
            </Button>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project Modalities" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Project Modalities</h1>
                        <p className="text-muted-foreground">Manage your project delivery modalities</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-orange-200/50" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium">
                                Total Modalities
                            </CardTitle>
                            <Radio className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent className='relative z-10'>
                            <div className="text-2xl font-bold text-orange-500">{modalities.length}</div>
                            <p className="text-xs">
                                Project delivery modalities
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Modalities Table with Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Modalities List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={modalities}
                            searchKey="project_name"
                            searchPlaceholder="Search by project name..."
                            actionComponent={<ModalitiesActions />}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
