import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Campus, College, InternationalPartner, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Building } from 'lucide-react';
import { PartnershipsTable } from '@/components/tables/admin/international-partners-table';
import { asset } from '@/lib/utils';

type PageProps = {
    partnerships: InternationalPartner[];
    campus: Campus;
    college: College;
    flash?: { message?: string };
};

export default function PartnershipIndex() {
    const { campus, college, partnerships, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'International Partners',
            href: '/admin/international-partners',
        },
        {
            title: 'Campus',
            href: '/admin/international-partners',
        },
        {
            title: 'College',
            href: `/admin/international-partners/${campus.id}`,
        },
        {
            title: 'Partnerships',
            href: `/admin/international-partners/${campus.id}/${college.id}/partnerships`,
        },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    // Calculate stats from the data if stats are not provided
    const totalParticipants = partnerships.reduce((sum, partnership) =>
        sum + Number(partnership.number_of_participants), 0
    );
    const totalCommittee = partnerships.reduce((sum, partnership) =>
        sum + Number(partnership.number_of_committee), 0
    );
    const uniquePartners = new Set(partnerships.map(e => e.agency_partner)).size;

    const totalPartnerships = partnerships.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partnerships" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className='text-2xl font-bold'>Community Engagements</h1>
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
                                Total Engagements
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPartnerships.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Community activities
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Participants
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">
                                {totalParticipants.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                People engaged
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Committee Members
                            </CardTitle>
                            <Users className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">
                                {totalCommittee.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Organizing committee
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Partnerships
                            </CardTitle>
                            <Building className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700">
                                {uniquePartners.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Partner agencies
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Engagements List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PartnershipsTable partnerships={partnerships} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
