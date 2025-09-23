import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus } from "@/types";

import { Head, Link, usePage } from "@inertiajs/react";
import { CirclePlus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'College Management',
        href: '/admin/college',
    },
    {
        title: 'Campus',
        href: '/admin/college',
    },
];

type PageProps = {
    campuses: Campus[];
    flash?: { message?: string }
};

export default function CollegeCampus() {
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
            <Head title="College Management" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-10 py-5 overflow-x-auto">
                <h1 className='text-2xl font-bold'>Campus</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {campuses.map((campus) => (
                        <Card key={campus.id} className="hover:shadow-lg transition-shadow duration-200">
                            <Link href={`/admin/college/campus/${campus.id}`} className="flex flex-col items-center gap-3">
                                <CardContent>
                                    <div className="flex flex-col items-center gap-3">
                                        <img
                                            src={asset(campus.logo)}
                                            alt={campus.name}
                                            className="h-24 w-24 object-contain"
                                        />
                                        <span className='text-lg font-medium'>{campus.name}</span>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <Link href={`/admin/campus/create`} className="flex flex-col items-center gap-3 h-full">
                            <CardContent className="flex flex-col items-center justify-center h-full gap-2">
                                <CirclePlus size={64} className="text-slate-700" />
                                <span className='text-lg font-medium'>Add Campus</span>
                            </CardContent>
                        </Link>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}