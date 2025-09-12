import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Award, Campus, College, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AwardIcon, Calendar, Users, Trophy, Building } from 'lucide-react';
import { AwardsTable } from '@/components/tables/admin/awards-table';
import { DataTable } from '@/components/data-table';
import { columns } from './components/columns';

type PageProps = {
    campus: Campus;
    college: College;
    awards: Award[];
    flash?: { message?: string };
};

export default function AwardsIndex() {
    const { campus, college, awards, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Awards and Recognitions',
            href: '/admin/awards',
        },
        {
            title: 'Campus',
            href: '/admin/awards',
        },
        {
            title: 'College',
            href: `/admin/awards/${campus.id}`,
        },
        {
            title: 'Awards',
            href: `/admin/awards/${campus.id}/${college.id}`,
        },
    ]

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    // Calculate statistics
    const totalAwards = awards.length;
    const thisYearAwards = awards.filter(award =>
        new Date(award.date_received).getFullYear() === new Date().getFullYear()
    ).length;
    const thisMonthAwards = awards.filter(award => {
        const awardDate = new Date(award.date_received);
        const now = new Date();
        return awardDate.getFullYear() === now.getFullYear() &&
            awardDate.getMonth() === now.getMonth();
    }).length;
    const recentAwards = awards.filter(award => {
        const awardDate = new Date(award.date_received);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return awardDate >= thirtyDaysAgo;
    }).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Awards Management" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className='text-2xl font-bold'>Awards and Recognitions</h1>
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAwards.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Total awards received by the college.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Year</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{thisYearAwards.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Awards received this year.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <AwardIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{thisMonthAwards.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Awards received this month.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Awards Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Awards List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={awards}
                            searchKey="name"
                            searchPlaceholder="Search awards..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
