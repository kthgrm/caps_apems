import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus, CampusCollege, College } from "@/types";


import { Head, Link, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./components/columns";

const breadcrumbs = (campus: Campus): BreadcrumbItem[] => [
    {
        title: 'College Management',
        href: '/admin/college',
    },
    {
        title: campus.name,
        href: `/admin/college/${campus.id}`,
    },
];

type PageProps = {
    colleges: CampusCollege[];
    campus: Campus;
    flash?: { message?: string };
    errors?: { deletion?: string };
};

export default function CollegeIndex() {
    const { flash, colleges, campus, errors } = usePage<PageProps>().props;

    console.log('Colleges:', colleges);
    console.log('Campus:', campus);

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (errors?.deletion) {
            toast.error(errors.deletion);
        }
    }, [flash?.message, errors?.deletion]);

    return (
        <AppLayout breadcrumbs={breadcrumbs(campus)}>
            <Head title={`College Management - ${campus.name}`} />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold">{campus.name} Campus</h1>
                            <p className="text-muted-foreground">
                                Manage colleges for this campus
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/college/create?campus=${campus.id}`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add College
                        </Link>
                    </Button>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Colleges List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={colleges}
                            searchKey="name"
                            searchPlaceholder="Search colleges..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout >
    );
}