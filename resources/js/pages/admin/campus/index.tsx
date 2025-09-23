import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Campus as BaseCampus } from "@/types";

type Campus = BaseCampus & {
    projects_count: number;
};

import { Head, Link, usePage } from "@inertiajs/react";
import { Plus, School } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Campus Management',
        href: '/admin/campus',
    },
];

type PageProps = {
    campuses: Campus[];
    flash?: { message?: string };
    errors?: { deletion?: string };
};

export default function CampusIndex() {
    const { flash, campuses, errors } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (errors?.deletion) {
            toast.error(errors.deletion);
        }
    }, [flash?.message, errors?.deletion]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campus Management" />
            <Toaster position="bottom-right" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Campus Management</h1>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Campus</CardTitle>
                            <School className="h-4 text-stone-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-gray-900">
                                {campuses.length}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Campus List
                            <Button asChild>
                                <Link href="/admin/campus/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Campus
                                </Link>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={campuses}
                            searchKey="name"
                            searchPlaceholder="Search campus..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}