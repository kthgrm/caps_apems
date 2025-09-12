import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Campus, College, ImpactAssessment, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, TrendingUp } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { columns } from './components/columns';

type PageProps = {
    assessments: ImpactAssessment[];
    campus: Campus;
    college: College;
    flash?: { message?: string };
};

export default function ImpactAssessments() {
    const { campus, college, assessments, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Impact Assessment',
            href: '/admin/impact-assessment',
        },
        {
            title: 'Campus',
            href: '/admin/impact-assessment',
        },
        {
            title: 'College',
            href: `/admin/impact-assessment/${campus.id}`,
        },
        {
            title: 'Assessments',
            href: `/admin/impact-assessment/${campus.id}/${college.id}/assessments`,
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

    const totalAssessments = assessments.length;
    const totalDirect = assessments.reduce((sum, assessment) =>
        sum + Number(assessment.num_direct_beneficiary), 0
    );
    const totalIndirect = assessments.reduce((sum, assessment) =>
        sum + Number(assessment.num_indirect_beneficiary), 0
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Impact Assessment" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className='text-2xl font-bold'>Impact Assessments</h1>
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
                                Total Assessments
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAssessments}</div>
                            <p className="text-xs text-muted-foreground">
                                Active impact assessments
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Direct Beneficiaries
                            </CardTitle>
                            <Users className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">
                                {totalDirect.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                People directly impacted
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Indirect Beneficiaries
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">
                                {totalIndirect.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                People indirectly impacted
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Impact
                            </CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700">
                                {(totalDirect + totalIndirect).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Combined reach
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Impact Assessment List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={assessments}
                            searchKey="project.name"
                            searchPlaceholder="Search by project name..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
