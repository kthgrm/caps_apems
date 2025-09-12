import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Campus, College, Modalities, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, Tv, Globe, Building } from 'lucide-react';
import { ModalitiesTable } from '@/components/tables/admin/modalities-table';
import { DataTable } from '@/components/data-table';
import { columns } from './components/columns';

type PageProps = {
    modalities: Modalities[];
    campus: Campus;
    college: College;
    flash?: { message?: string };
};

export default function ModalitiesList() {
    const { campus, college, modalities, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modalities',
            href: '/admin/modalities',
        },
        {
            title: 'Campus',
            href: '/admin/modalities',
        },
        {
            title: 'College',
            href: `/admin/modalities/${campus.id}`,
        },
        {
            title: 'Modalities',
            href: `/admin/modalities/${campus.id}/${college.id}/modalities`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    const totalModalities = modalities.length;
    const tvCount = modalities.filter(modality => modality.tv_channel).length;
    const radioCount = modalities.filter(modality => modality.radio).length;
    const onlineCount = modalities.filter(modality => modality.online_link).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modalities" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className='text-2xl font-bold'>Modalities</h1>
                    </div>
                </div>

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
                                Total Modalities
                            </CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalModalities}</div>
                            <p className="text-xs text-muted-foreground">
                                Active modalities
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                TV Channels
                            </CardTitle>
                            <Tv className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">
                                {tvCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Television broadcast
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Radio Stations
                            </CardTitle>
                            <Radio className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">
                                {radioCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Radio broadcast
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Online Platforms
                            </CardTitle>
                            <Globe className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700">
                                {onlineCount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Digital platforms
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Modalities List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={modalities}
                            searchKey="partner_agency"
                            searchPlaceholder="Search by partner agency..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
