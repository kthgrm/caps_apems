import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Resolution, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Building, Phone, Mail, FileText, Clock, Target } from 'lucide-react';

type PageProps = {
    resolution: Resolution;
    flash?: { message?: string }
}

export default function ResolutionDetails() {
    const { resolution, flash } = usePage<PageProps>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Resolutions', href: '/admin/resolutions' },
        { title: resolution.resolution_number, href: `/admin/resolutions/${resolution.id}` },
    ];

    useEffect(() => {
        if (flash?.message) {
            toast.info(flash.message);
        }
    }, [flash?.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resolution Details" />
            <Toaster position="bottom-right" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-10 py-5 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-bold'>Resolution Details</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Resolution Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Resolution ID</Label>
                                        <Input value={resolution.id} readOnly className="mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Resolution Number</Label>
                                        <Input value={resolution.resolution_number} readOnly className="mt-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Year of Effectivity</Label>
                                        <Input
                                            value={new Date(resolution.year_of_effectivity).toLocaleDateString()}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Expiration Date</Label>
                                        <Input
                                            value={new Date(resolution.expiration).toLocaleDateString()}
                                            readOnly
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partner Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Partner Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-light">Partner Agency/Organization</Label>
                                    <Input value={resolution.partner_agency_organization} readOnly className="mt-1" />
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-light">Contact Person</Label>
                                        <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-blue-600" />
                                                <span className="font-semibold text-blue-800">
                                                    {resolution.contact_person}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-light">Contact Information</Label>
                                        <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                {resolution.contact_number_email.includes('@') ? (
                                                    <Mail className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <Phone className="h-5 w-5 text-green-600" />
                                                )}
                                                <span className="font-semibold text-green-800">
                                                    {resolution.contact_number_email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Record Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Record Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Created</span>
                                        <span>{resolution.created_at ? new Date(resolution.created_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created By</span>
                                        <span>{resolution.user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date Last Updated</span>
                                        <span>{resolution.updated_at ? new Date(resolution.updated_at).toLocaleDateString() : 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Last Updated By</span>
                                        <span>{resolution.user.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={`/admin/resolutions/${resolution.id}/edit`}>
                                        Edit Resolution
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Generate Report
                                </Button>
                                <Separator />
                                <Button variant="destructive" className="w-full justify-start bg-red-800 hover:bg-red-900">
                                    Delete Resolution
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
