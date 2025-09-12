import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus as BaseCampus } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Awards and Recognitions',
        href: '/admin/awards',
    },
    {
        title: 'Campus',
        href: '/admin/awards',
    },
];

type Campus = BaseCampus & {
    awards_count: number;
};

type PageProps = {
    campuses: Campus[];
    flash?: { message?: string }
};

export default function Awards() {
    const { flash, campuses } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    const asset = (path: string) => {
        return `/storage/${path}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Awards" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-10 py-5 overflow-x-auto">
                <h1 className='text-2xl font-bold'>Campus</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {campuses.map((campus) => (
                        <Card key={campus.id} className="hover:shadow-lg transition-shadow duration-200">
                            <Link href={`/admin/awards-recognition/${campus.id}`} className="flex flex-col items-center gap-2">
                                <CardContent>
                                    <div className="flex flex-col items-center gap-3">
                                        <img
                                            src={asset(campus.logo)}
                                            alt={campus.name}
                                            className="h-24 w-24 object-contain"
                                        />
                                        <span className='text-lg font-medium'>{campus.name}</span>
                                        <Badge
                                            variant="secondary"
                                            className="px-3 py-1 text-sm font-medium bg-muted"
                                        >
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                {campus.awards_count} Award{campus.awards_count > 1 ? "s" : ""}
                                            </span>
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}