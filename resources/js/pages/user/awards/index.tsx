import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Award, Plus, Filter, Download, Eye, Edit, Trash2, Globe, Earth, Locate, Map } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { DataTable } from '@/components/data-table';
import type { BreadcrumbItem, Award as AwardType } from '@/types';
import { columns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Awards & Recognition',
        href: '/user/awards',
    },
    {
        title: 'Award List',
        href: '/user/awards',
    },
];

type PageProps = {
    awards: AwardType[];
    flash?: { message?: string };
};

export default function AwardList() {
    const { awards, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const AwardsActions = () => (
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/user/awards/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className='hidden lg:block'>Add New Award</span>
                </Link>
            </Button>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Awards & Recognition" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-medium">Awards & Recognition</h1>
                        <p className="text-muted-foreground">Manage your awards and recognition records</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Card className='relative overflow-hidden group hover:shadow-md transition-shadow duration-200'>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-yellow-200/50" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium">
                                Total Awards
                            </CardTitle>
                            <Award className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent className='relative z-10'>
                            <div className="text-2xl font-bold text-yellow-500">{awards.length}</div>
                            <p className="text-xs">
                                Recognition achievements
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Awards Table with Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Awards List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={awards}
                            searchKey="award_name"
                            searchPlaceholder="Search awards..."
                            actionComponent={<AwardsActions />}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
