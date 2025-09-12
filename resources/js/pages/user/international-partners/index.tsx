import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Plus, Eye, Edit, Trash2, MapPin, Calendar, Handshake } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { DataTable } from '@/components/data-table';
import type { BreadcrumbItem, InternationalPartner } from '@/types';
import { columns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'International Partners',
        href: '/user/international-partners',
    },
    {
        title: 'Partner List',
        href: '/user/international-partners',
    },
];

type PageProps = {
    internationalPartners: InternationalPartner[];
    flash?: { message?: string };
};

export default function InternationalPartnerList() {
    const { internationalPartners, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const InternationalPartnerActions = () => (
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/user/international-partners/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className='hidden lg:block'>Add New Partnership</span>
                </Link>
            </Button>
        </div>
    );

    const calculateStats = () => {
        const recentPartners = internationalPartners.filter(partner => {
            if (!partner.start_date) return false;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(partner.start_date) >= thirtyDaysAgo;
        }).length;

        return {
            total: internationalPartners.length,
            recent: recentPartners
        };
    };

    const stats = calculateStats();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="International Partners" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">International Partners</h1>
                        <p className="text-muted-foreground">Manage your international partnerships</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-green-200/50" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium">
                                Total Partnerships
                            </CardTitle>
                            <Handshake className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent className='relative z-10'>
                            <div className="text-2xl font-bold text-green-500">{stats.total}</div>
                            <p className="text-xs">
                                Partnerships recorded.
                            </p>
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recent Partnerships
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.recent}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Last 30 days
                            </p>
                        </CardContent>
                    </Card> */}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            International Partner List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={internationalPartners}
                            searchKey="agency_partner"
                            searchPlaceholder="Search partnerships..."
                            actionComponent={<InternationalPartnerActions />}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
