import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, Filter, Calendar, User, Activity, FileText, Download, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem, Resolution } from '@/types';
import { DataTable } from '@/components/data-table';
import { columns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Resolutions', href: '/admin/resolutions' },
];

interface ResolutionIndexProps {
    resolutions: Resolution[];
}

export default function ResolutionIndex({ resolutions }: ResolutionIndexProps) {
    const expiredCount = resolutions.filter(r => new Date(r.expiration) < new Date()).length;
    const expiringSoonCount = resolutions.filter(r => {
        const expirationDate = new Date(r.expiration);
        const currentDate = new Date();
        return !((expirationDate < currentDate)) && (expirationDate.getTime() - currentDate.getTime()) < (30 * 24 * 60 * 60 * 1000);
    }).length;
    const activeCount = resolutions.length - expiredCount - expiringSoonCount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resolutions" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Resolutions</h1>
                        <p className="text-gray-600">
                            Manage and track all project resolutions
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/resolutions/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Resolution
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Resolutions</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{resolutions.length}</div>
                            <p className="text-xs text-muted-foreground">All resolutions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                            <Calendar className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{expiringSoonCount}</div>
                            <p className="text-xs text-muted-foreground">Within 30 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expired</CardTitle>
                            <Calendar className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
                            <p className="text-xs text-muted-foreground">Past expiration</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resolution List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={resolutions}
                            searchKey="resolution_number"
                            searchPlaceholder="Search resolutions..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
