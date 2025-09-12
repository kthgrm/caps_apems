import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Campus, College as BaseCollege, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type College = BaseCollege & {
    partnerships_count: number;
};

type PageProps = {
    campus: Campus;
    colleges: College[];
    flash?: { message?: string };
};

export default function Engagement() {
    const { campus, colleges, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

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
    ];

    const asset = (path: string) => {
        return `/storage/${path}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Engagement" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-10 py-5 overflow-x-auto">
                <h1 className='text-2xl font-bold'>Colleges</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {colleges.map((college) => (
                        <Card key={college.id} className='hover:shadow-lg transition-shadow duration-200'>
                            <Link href={`/admin/international-partners/${campus.id}/${college.id}/partnerships`} className="flex flex-col items-center gap-2">
                                <CardContent>
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <img
                                            src={asset(college.logo)}
                                            alt={college.name}
                                            className="h-24 w-24 object-contain"
                                        />
                                        <p className='text-md font-medium'>{college.code}</p>
                                        <p className='text-sm'>{college.name}</p>
                                    </div>
                                </CardContent>
                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1 text-sm font-medium bg-muted"
                                >
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        {college.partnerships_count} Partnership{college.partnerships_count > 1 ? "s" : ""}
                                    </span>
                                </Badge>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
